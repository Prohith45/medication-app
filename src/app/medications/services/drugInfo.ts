import { DRUG_LIBRARY, type DrugInfo } from "../data/drugLibrary";

// ─── OpenFDA Response Shape (partial) ───────────────────────────────

interface OpenFDAResult {
  results?: Array<{
    indications_and_usage?: string[];
    description?: string[];
    mechanism_of_action?: string[];
    adverse_reactions?: string[];
    openfda?: {
      brand_name?: string[];
      pharm_class_epc?: string[]; // pharmacologic class
    };
  }>;
}

// ─── Helpers ────────────────────────────────────────────────────────

/** Truncate dense clinical text to the first N sentences. */
function firstSentences(text: string, n: number): string {
  // Split on sentence-ending punctuation followed by a space or end
  const sentences = text
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .match(/[^.!?]+[.!?]+/g);
  if (!sentences) return text.slice(0, 200);
  return sentences.slice(0, n).join(" ").trim();
}

/** Extract bullet-friendly side effects from a raw adverse_reactions blob */
function parseSideEffects(raw: string): string[] {
  // Common patterns: comma-separated lists or semicolons
  const cleaned = raw
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Try splitting on commas inside parenthetical lists
  const candidates = cleaned
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(
      (s) =>
        s.length > 3 &&
        s.length < 80 &&
        !s.match(/^\d/) &&
        !s.toLowerCase().startsWith("see ")
    );

  if (candidates.length >= 3) return candidates.slice(0, 5);

  // Fallback: grab first 3 sentences
  return firstSentences(raw, 3)
    .split(".")
    .map((s) => s.trim())
    .filter((s) => s.length > 3)
    .slice(0, 5);
}

/** Heuristic: Is the text too clinical / dense for a patient? */
function isTooDense(text: string): boolean {
  // If average word length > 8 or text has too many parentheticals
  const words = text.split(/\s+/);
  const avgLen = words.reduce((a, w) => a + w.length, 0) / (words.length || 1);
  const parenCount = (text.match(/\(/g) || []).length;
  return avgLen > 7.5 || parenCount > 4;
}

// ─── Main Function ──────────────────────────────────────────────────

export async function getDrugDetails(drugName: string): Promise<DrugInfo> {
  const key = drugName.toLowerCase().trim();

  // 1. Try OpenFDA API
  try {
    const url = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${encodeURIComponent(
      drugName
    )}"&limit=1`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data: OpenFDAResult = await res.json();
    const result = data.results?.[0];

    if (result) {
      const rawPurpose =
        result.indications_and_usage?.[0] ?? result.description?.[0] ?? "";
      const rawMechanism =
        result.mechanism_of_action?.[0] ?? result.description?.[0] ?? "";
      const rawSideEffects = result.adverse_reactions?.[0] ?? "";
      const category =
        result.openfda?.pharm_class_epc?.[0] ?? guessCategory(key);

      // If text is too dense / clinical, fall back to local library
      if (isTooDense(rawPurpose) && DRUG_LIBRARY[key]) {
        return DRUG_LIBRARY[key];
      }

      const purpose = rawPurpose
        ? firstSentences(rawPurpose, 2)
        : "Information not available from FDA database.";

      const howItWorks = rawMechanism
        ? firstSentences(rawMechanism, 1)
        : "Mechanism information not available.";

      const sideEffects = rawSideEffects
        ? parseSideEffects(rawSideEffects)
        : ["Side effect details not available"];

      return {
        name: drugName,
        category,
        purpose,
        howItWorks,
        sideEffects,
      };
    }
  } catch {
    // API failed or timed out — fall through to local library
  }

  // 2. Fallback: local dictionary
  if (DRUG_LIBRARY[key]) {
    return DRUG_LIBRARY[key];
  }

  // 3. Last resort: generic response
  return {
    name: drugName,
    category: "Medication",
    purpose: `Detailed information for ${drugName} is not available in our database. Please consult your pharmacist or doctor for accurate information.`,
    howItWorks: "Mechanism information not available for this medication.",
    sideEffects: [
      "Consult your pharmacist for information on possible side effects",
    ],
  };
}

// ─── Category Guesser (when OpenFDA doesn't provide one) ────────────

function guessCategory(key: string): string {
  const map: Record<string, string> = {
    aspirin: "Blood Thinner / Pain Reliever",
    metformin: "Antidiabetic",
    lisinopril: "ACE Inhibitor / Blood Pressure",
    warfarin: "Blood Thinner (Anticoagulant)",
    atorvastatin: "Statin / Cholesterol Lowering",
    amoxicillin: "Antibiotic",
    ibuprofen: "NSAID / Pain Reliever",
    omeprazole: "Proton Pump Inhibitor (PPI)",
    amlodipine: "Calcium Channel Blocker",
    metoprolol: "Beta Blocker",
    losartan: "ARB / Blood Pressure",
    levothyroxine: "Thyroid Hormone",
    sertraline: "SSRI / Antidepressant",
    gabapentin: "Anticonvulsant / Nerve Pain",
    acetaminophen: "Analgesic / Fever Reducer",
    simvastatin: "Statin / Cholesterol Lowering",
    prednisone: "Corticosteroid",
    pantoprazole: "Proton Pump Inhibitor (PPI)",
    albuterol: "Bronchodilator",
    hydrochlorothiazide: "Diuretic / Blood Pressure",
  };
  return map[key] ?? "Medication";
}
