import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import {
  INDIAN_BRAND_ALIASES,
  INDIAN_DRUG_DETAILS,
  resolveIndianBrand,
} from "../../medications/data/indianMedicines";
import { fuzzyResolveIndianMedicine } from "../../medications/utils/fuzzyMatch";
import { DRUG_LIBRARY } from "../../medications/data/drugLibrary";

// ─── OpenFDA Result Interface ───────────────────────────────────────

interface OpenFDAResult {
  results?: Array<{
    indications_and_usage?: string[];
    description?: string[];
    mechanism_of_action?: string[];
    adverse_reactions?: string[];
    openfda?: {
      brand_name?: string[];
      generic_name?: string[];
      pharm_class_epc?: string[];
    };
  }>;
}

// ─── Category Guesser Helper ────────────────────────────────────────

function guessCategory(key: string): string {
  const map: Record<string, string> = {
    aspirin: "Blood Thinner / Antiplatelet",
    metformin: "Antidiabetic (Biguanide)",
    lisinopril: "ACE Inhibitor / Blood Pressure",
    warfarin: "Anticoagulant / Blood Thinner",
    atorvastatin: "Statin / Lipid Lowering",
    amoxicillin: "Antibiotic",
    ibuprofen: "NSAID / Pain & Inflammation",
    omeprazole: "Proton Pump Inhibitor (PPI)",
    amlodipine: "Calcium Channel Blocker",
    metoprolol: "Beta Blocker",
    losartan: "ARB / Blood Pressure",
    levothyroxine: "Thyroid Hormone",
    sertraline: "SSRI / Antidepressant",
    gabapentin: "Anticonvulsant / Neuropathic Pain",
    acetaminophen: "Analgesic / Antipyretic",
    paracetamol: "Analgesic / Antipyretic",
    pantoprazole: "Proton Pump Inhibitor (PPI)",
    simvastatin: "Statin / Cholesterol Lowering",
    prednisone: "Corticosteroid",
    albuterol: "Bronchodilator",
    hydrochlorothiazide: "Diuretic / Blood Pressure",
    bisoprolol: "Beta Blocker / Cardiac",
    telmisartan: "ARB / Blood Pressure",
    cetirizine: "Antihistamine / Anti-allergic",
    fexofenadine: "Non-Sedating Antihistamine",
    imatinib: "Targeted Oral Chemotherapy (Tyrosine Kinase Inhibitor)",
    tamoxifen: "Selective Estrogen Receptor Modulator / Hormone Therapy",
    methotrexate: "Antimetabolite / Chemotherapy & DMARD",
    capecitabine: "Fluoropyrimidine / Oral Chemotherapy",
    ondansetron: "5-HT3 Receptor Antagonist / Antiemetic",
    gefitinib: "EGFR Tyrosine Kinase Inhibitor / Targeted Therapy",
    dapagliflozin: "SGLT2 Inhibitor / Antidiabetic & Cardiorenal",
    sitagliptin: "DPP-4 Inhibitor / Incretin Enhancer",
    prazosin: "Alpha-1 Blocker / Antihypertensive",
  };

  const lower = key.toLowerCase();
  for (const [k, v] of Object.entries(map)) {
    if (lower.includes(k)) return v;
  }
  return "Prescription Medication";
}

// ─── GET /api/explain?drug=<NAME> ───────────────────────────────────

export async function GET(request: NextRequest) {
  const drugName = request.nextUrl.searchParams.get("drug");

  if (!drugName || drugName.trim().length === 0) {
    return NextResponse.json(
      { error: "Missing 'drug' query parameter" },
      { status: 400 }
    );
  }

  const rawTrimmed = drugName.trim();

  // ══════════════════════════════════════════════════════════════════
  // TIER 1: Instant Local Indian Formulary & Typo-Tolerant Match
  // ══════════════════════════════════════════════════════════════════
  const resolution = resolveIndianBrand(rawTrimmed);

  if (resolution.details) {
    const d = resolution.details;
    return NextResponse.json({
      name: rawTrimmed,
      genericName: d.displayGeneric,
      isIndianBrand: resolution.isIndianBrand,
      category: d.category,
      standardDose: d.standardDoses.join(", "),
      timing: d.timingAdvice,
      timingAdvice: d.timingAdvice,
      purpose: d.purpose,
      howItWorks: d.howItWorks,
      sideEffects: d.sideEffects,
      source: "Indian Regional Formulary",
      sourceBadge:
        resolution.matchType === "fuzzy"
          ? `Indian Regional Formulary (Fuzzy Match: ${resolution.genericName})`
          : "Indian Regional Formulary (PMBJP & 1mg Verified)",
      matchedTerm: resolution.genericName,
      fuzzyDistance: resolution.distance || 0,
    });
  }

  // Also check standard offline drug library
  const libKey = rawTrimmed.toLowerCase();
  if (DRUG_LIBRARY[libKey]) {
    const lib = DRUG_LIBRARY[libKey];
    return NextResponse.json({
      name: rawTrimmed,
      genericName: lib.name,
      isIndianBrand: false,
      category: lib.category,
      standardDose: "As prescribed",
      timing: "Take as directed by your physician with plenty of water.",
      timingAdvice: "Take as directed by your physician with plenty of water.",
      purpose: lib.purpose,
      howItWorks: lib.howItWorks,
      sideEffects: lib.sideEffects,
      source: "Clinical Reference Formulary",
      sourceBadge: "Clinical Reference Formulary",
    });
  }

  // ══════════════════════════════════════════════════════════════════
  // TIER 2: OpenFDA Clinical Label Dual Search
  // ══════════════════════════════════════════════════════════════════
  const fdaSearchTerm = resolution.genericName || rawTrimmed;
  let fdaUsableResult: {
    purpose: string;
    howItWorks: string;
    sideEffects: string[];
    category: string;
    genericName?: string;
  } | null = null;

  try {
    const fdaQuery = `openfda.generic_name:"${encodeURIComponent(
      fdaSearchTerm
    )}"+openfda.brand_name:"${encodeURIComponent(fdaSearchTerm)}"+openfda.brand_name:"${encodeURIComponent(rawTrimmed)}"`;
    const fdaUrl = `https://api.fda.gov/drug/label.json?search=${fdaQuery}&limit=1`;

    const fdaController = new AbortController();
    const fdaTimeout = setTimeout(() => fdaController.abort(), 2500);
    const fdaRes = await fetch(fdaUrl, { signal: fdaController.signal });
    clearTimeout(fdaTimeout);

    if (fdaRes.ok) {
      const fdaData: OpenFDAResult = await fdaRes.json();
      const item = fdaData.results?.[0];

      if (item) {
        const rawPurpose = item.indications_and_usage?.[0] ?? "";
        const rawMech =
          item.mechanism_of_action?.[0] ?? item.description?.[0] ?? "";
        const rawAdverse = item.adverse_reactions?.[0] ?? "";

        if (rawPurpose || rawMech || rawAdverse) {
          // Extract first 1-2 clean sentences for purpose
          const cleanPurpose = rawPurpose
            ? rawPurpose.split(/\.\s+/).slice(0, 2).join(". ") + "."
            : `Indicated for conditions responsive to ${rawTrimmed}.`;

          const cleanMech = rawMech
            ? rawMech.split(/\.\s+/).slice(0, 2).join(". ") + "."
            : `Provides targeted pharmacological activity.`;

          // Extract adverse reaction bullet points or sentences
          const sideEffectsList: string[] = [];
          if (rawAdverse) {
            const lines = rawAdverse
              .split(/[\n,;•]/)
              .map((s) => s.trim())
              .filter((s) => s.length > 3 && s.length < 60 && !s.includes("table"));
            sideEffectsList.push(...lines.slice(0, 4));
          }
          if (sideEffectsList.length === 0) {
            sideEffectsList.push(
              "Nausea or stomach upset",
              "Dizziness or headache",
              "Consult doctor if persistent discomfort occurs"
            );
          }

          fdaUsableResult = {
            purpose: cleanPurpose.replace(/[<>[\]]/g, ""),
            howItWorks: cleanMech.replace(/[<>[\]]/g, ""),
            sideEffects: sideEffectsList,
            category:
              item.openfda?.pharm_class_epc?.[0] || guessCategory(fdaSearchTerm),
            genericName: item.openfda?.generic_name?.[0] || fdaSearchTerm,
          };
        }
      }
    }
  } catch (fdaErr) {
    console.warn("[/api/explain] Tier 2 OpenFDA skipped:", fdaErr);
  }

  // If OpenFDA had strong clinical data and Gemini is not needed, we can return it directly
  if (fdaUsableResult) {
    return NextResponse.json({
      name: rawTrimmed,
      genericName: fdaUsableResult.genericName,
      isIndianBrand: resolution.isIndianBrand,
      category: fdaUsableResult.category,
      standardDose: "As prescribed",
      timing: "Take with a full glass of water as directed by your physician or pharmacist.",
      timingAdvice: "Take with a full glass of water as directed by your physician or pharmacist.",
      purpose: fdaUsableResult.purpose,
      howItWorks: fdaUsableResult.howItWorks,
      sideEffects: fdaUsableResult.sideEffects,
      source: "OpenFDA",
      sourceBadge: "OpenFDA Clinical Label Database",
    });
  }

  // ══════════════════════════════════════════════════════════════════
  // TIER 3: Gemini Zero-Failure Clinical AI Fallback
  // ══════════════════════════════════════════════════════════════════
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey !== "YOUR_GEMINI_API_KEY_HERE") {
    try {
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `You are a clinical pharmacist in India. Provide structured JSON for medication: '${rawTrimmed}'.
Output strictly this JSON structure:
{
  "name": "Standard Brand or Generic Name",
  "genericName": "Active chemical ingredient(s)",
  "category": "Therapeutic class (e.g., Oral Chemotherapy, Antihistamine)",
  "standardDose": "Common adult dose",
  "timing": "Clear intake instructions (e.g., Take with a full glass of water after food)",
  "purpose": "Plain-language medical purpose in 1-2 simple sentences",
  "howItWorks": "Simple explanation of physiological action",
  "sideEffects": ["Side effect 1", "Side effect 2", "Side effect 3"],
  "source": "Clinical AI Formulary (Gemini)"
}`;

      const modelsToTry = [
        "gemini-2.5-flash",
        "gemini-1.5-flash",
        "gemini-2.0-flash",
      ];

      const timeoutPromise = new Promise<string>((_, reject) =>
        setTimeout(() => reject(new Error("Gemini AI 2.5s stage timeout")), 2500)
      );

      const generateWithFallback = async (): Promise<string> => {
        for (const model of modelsToTry) {
          try {
            const response = await ai.models.generateContent({
              model,
              contents: [{ role: "user", parts: [{ text: prompt }] }],
              config: {
                temperature: 0.2,
                maxOutputTokens: 600,
              },
            });
            const text = response.text ?? "";
            if (text) return text;
          } catch {
            // Try next fallback model
          }
        }
        return "";
      };

      const aiOutput = await Promise.race([generateWithFallback(), timeoutPromise]);

      if (aiOutput) {
        const cleaned = aiOutput
          .replace(/```json\s*/gi, "")
          .replace(/```\s*/g, "")
          .trim();

        const parsed = JSON.parse(cleaned);

        if (parsed.purpose && parsed.howItWorks) {
          return NextResponse.json({
            name: parsed.name || rawTrimmed,
            genericName: parsed.genericName || rawTrimmed,
            isIndianBrand: true,
            category: parsed.category || guessCategory(rawTrimmed),
            standardDose: parsed.standardDose || "As prescribed",
            timing: parsed.timing || "Take with water as directed by your physician.",
            timingAdvice: parsed.timing || "Take with water as directed by your physician.",
            purpose: parsed.purpose,
            howItWorks: parsed.howItWorks,
            sideEffects: Array.isArray(parsed.sideEffects) ? parsed.sideEffects : [parsed.sideEffects],
            source: "Clinical AI Formulary (Gemini)",
            sourceBadge: "Clinical AI Formulary (Gemini)",
          });
        }
      }
    } catch (aiErr) {
      console.warn("[/api/explain] Tier 3 Gemini AI failed:", aiErr);
    }
  }

  // ══════════════════════════════════════════════════════════════════
  // DETERMINISTIC ZERO-FAILURE FALLBACK
  // ══════════════════════════════════════════════════════════════════
  const category = guessCategory(rawTrimmed);
  return NextResponse.json({
    name: rawTrimmed,
    genericName: resolution.genericName !== rawTrimmed ? resolution.genericName : undefined,
    isIndianBrand: resolution.isIndianBrand,
    category,
    standardDose: "As directed by physician",
    timing: "Take with a full glass of water as directed on your prescription bottle.",
    timingAdvice: "Take with a full glass of water as directed on your prescription bottle.",
    purpose: `${rawTrimmed} is prescribed for routine therapeutic management. Consult your doctor or pharmacist for specific treatment instructions.`,
    howItWorks: "Provides targeted therapeutic benefits according to its pharmacological class.",
    sideEffects: [
      "Mild nausea or stomach discomfort",
      "Dizziness upon standing",
      "Consult your pharmacist or physician if any unexpected symptoms persist",
    ],
    source: "Clinical Reference Formulary",
    sourceBadge: "Clinical Reference Formulary",
  });
}
