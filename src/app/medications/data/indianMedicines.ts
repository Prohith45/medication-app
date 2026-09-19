/**
 * Indian Brand Aliases and Regional Formulary Database
 * Provides trade name to international generic resolution and rich regional clinical context.
 * References:
 * - Commercial Indian Brands (1mg / Tata 1mg Formulary)
 * - A-Z Indian Trade Names Database
 * - Pradhan Mantri Bharatiya Janaushadhi Pariyojana (PMBJP) Essential Drug List
 */

import { fuzzyResolveIndianMedicine } from "../utils/fuzzyMatch";

export interface IndianDrugDetail {
  genericName: string;
  displayGeneric: string;
  category: string;
  timingAdvice: string;
  standardDoses: string[];
  purpose: string;
  howItWorks: string;
  sideEffects: string[];
}

export const INDIAN_BRAND_ALIASES: Record<string, string> = {
  // ── Paracetamol Brands ──
  dolo: "paracetamol",
  "dolo 650": "paracetamol",
  dolo650: "paracetamol",
  crocin: "paracetamol",
  "crocin 650": "paracetamol",
  "crocin advance": "paracetamol",
  calpol: "paracetamol",
  "calpol 500": "paracetamol",
  "calpol 650": "paracetamol",
  pcm: "paracetamol",
  panadol: "paracetamol",

  // ── Pantoprazole + Domperidone combinations ──
  "pan-d": "pantoprazole_domperidone",
  pand: "pantoprazole_domperidone",
  "pan d": "pantoprazole_domperidone",
  "pan-d capsule": "pantoprazole_domperidone",
  "pantocid-dsr": "pantoprazole_domperidone",
  "pantocid dsr": "pantoprazole_domperidone",
  "pantodac dsr": "pantoprazole_domperidone",

  // ── Pantoprazole Plain ──
  "pan 40": "pantoprazole",
  pan40: "pantoprazole",
  pantocid: "pantoprazole",
  "pantocid 40": "pantoprazole",
  pantodac: "pantoprazole",
  "pantop 40": "pantoprazole",

  // ── Aspirin Brands ──
  ecosprin: "aspirin",
  "ecosprin 75": "aspirin",
  "ecosprin 150": "aspirin",
  disprin: "aspirin",
  "delisprin 75": "aspirin",

  // ── Cardiovascular Combination (Aspirin + Atorvastatin) ──
  "ecosprin av": "aspirin_atorvastatin",
  "ecosprin-av": "aspirin_atorvastatin",
  "ecosprin av 75": "aspirin_atorvastatin",
  "ecosprin av 150": "aspirin_atorvastatin",
  "atorlip asp": "aspirin_atorvastatin",
  "modlip asp": "aspirin_atorvastatin",

  // ── Ibuprofen + Paracetamol Combinations ──
  combiflam: "ibuprofen_paracetamol",
  "combiflam plus": "ibuprofen_paracetamol",
  flexon: "ibuprofen_paracetamol",
  "flexon mr": "ibuprofen_paracetamol",
  ibugesic: "ibuprofen",
  "ibugesic plus": "ibuprofen_paracetamol",

  // ── Bisoprolol ──
  concor: "bisoprolol",
  "concor cor": "bisoprolol",
  "concor 5": "bisoprolol",
  "concor 2.5": "bisoprolol",
  corbis: "bisoprolol",

  // ── Telmisartan ──
  telma: "telmisartan",
  "telma 40": "telmisartan",
  "telma 80": "telmisartan",
  "telma-h": "telmisartan",
  "telma h": "telmisartan",
  telmikind: "telmisartan",
  "telvas 40": "telmisartan",

  // ── Metformin ──
  glycomet: "metformin",
  "glycomet 500": "metformin",
  "glycomet 1000": "metformin",
  "glycomet sr": "metformin",
  "glycomet gp": "metformin",
  cetapin: "metformin",
  "obimet 500": "metformin",

  // ── SGLT2 Inhibitor (Dapagliflozin) ──
  forxiga: "dapagliflozin",
  "forxiga 10": "dapagliflozin",
  "forxiga 5": "dapagliflozin",
  dapagliflozin: "dapagliflozin",
  dapa: "dapagliflozin",
  oxra: "dapagliflozin",
  dapaglyn: "dapagliflozin",

  // ── DPP-4 Inhibitor (Sitagliptin) ──
  januvia: "sitagliptin",
  "januvia 100": "sitagliptin",
  "januvia 50": "sitagliptin",
  sitagliptin: "sitagliptin",
  istavel: "sitagliptin",
  janumet: "sitagliptin",

  // ── Alpha-1 Blocker (Prazosin) ──
  minipress: "prazosin",
  "minipress xl": "prazosin",
  "minipress xl 2.5": "prazosin",
  "minipress xl 5": "prazosin",
  prazopress: "prazosin",
  "prazopress 2": "prazosin",
  "prazopress 5": "prazosin",
  prazosin: "prazosin",

  // ── Allergy & Respiratory Formulations ──
  cetirizine: "cetirizine",
  citirizine: "cetirizine",
  okacet: "cetirizine",
  "okacet 10": "cetirizine",
  cetzine: "cetirizine",
  "cetzine 10": "cetirizine",
  alercet: "cetirizine",
  zyrtec: "cetirizine",

  "montair-lc": "montelukast_levocetirizine",
  "montek-lc": "montelukast_levocetirizine",
  "montair lc": "montelukast_levocetirizine",
  "montek lc": "montelukast_levocetirizine",
  monticope: "montelukast_levocetirizine",
  "telekast-l": "montelukast_levocetirizine",
  "telekast l": "montelukast_levocetirizine",
  "montemac-l": "montelukast_levocetirizine",

  allegra: "fexofenadine",
  "allegra 120": "fexofenadine",
  "allegra 180": "fexofenadine",
  fexova: "fexofenadine",
  "fexova 120": "fexofenadine",
  "fexova 180": "fexofenadine",
  fexigra: "fexofenadine",

  // ── Oncology & Critical Care Cancer Therapeutics ──
  imatinib: "imatinib",
  glivec: "imatinib",
  gleevic: "imatinib",
  "glivec 400": "imatinib",
  veenix: "imatinib",
  imacel: "imatinib",
  shivec: "imatinib",

  tamoxifen: "tamoxifen",
  tamodex: "tamoxifen",
  "tamodex 20": "tamoxifen",
  "tamodex 10": "tamoxifen",
  cytotam: "tamoxifen",
  mamofen: "tamoxifen",

  folitrax: "methotrexate",
  "folitrax 10": "methotrexate",
  "folitrax 15": "methotrexate",
  "folitrax 7.5": "methotrexate",
  "folitrax 2.5": "methotrexate",
  methotrexate: "methotrexate",
  mexate: "methotrexate",
  imutrex: "methotrexate",

  xecap: "capecitabine",
  "xecap 500": "capecitabine",
  capecitabine: "capecitabine",
  capnat: "capecitabine",
  capegard: "capecitabine",

  emset: "ondansetron",
  "emset 4": "ondansetron",
  "emset 8": "ondansetron",
  ondansetron: "ondansetron",
  zofran: "ondansetron",
  vomikind: "ondansetron",
  periset: "ondansetron",

  geftinat: "gefitinib",
  "geftinat 250": "gefitinib",
  gefitinib: "gefitinib",
  gefticip: "gefitinib",

  // ── Antibiotics ──
  augmentin: "amoxicillin_clavulanate",
  "augmentin 625": "amoxicillin_clavulanate",
  "augmentin 625 duo": "amoxicillin_clavulanate",
  "augmentin 375": "amoxicillin_clavulanate",
  "moxikind-cv": "amoxicillin_clavulanate",
  "moxikind cv 625": "amoxicillin_clavulanate",
  "clam 625": "amoxicillin_clavulanate",

  // ── Spasmodic Pain ──
  "meftal spas": "mefenamic_dicyclomine",
  "meftal-spas": "mefenamic_dicyclomine",
  meftal: "mefenamic_acid",
  "meftal 500": "mefenamic_acid",
  spasmonil: "dicyclomine",
  cyclopam: "dicyclomine_paracetamol",

  // ── Calcium + Vitamin D3 ──
  shelcal: "calcium_vitamin_d3",
  "shelcal 500": "calcium_vitamin_d3",
  "shelcal-hd": "calcium_vitamin_d3",
  "shelcal hd": "calcium_vitamin_d3",
  gemcal: "calcium_vitamin_d3",
  cipcal: "calcium_vitamin_d3",
  "cipcal 500": "calcium_vitamin_d3",

  // ── Other high-frequency formulations ──
  azithral: "azithromycin",
  "azithral 500": "azithromycin",
  azee: "azithromycin",
  rantac: "ranitidine",
  "rantac 150": "ranitidine",
  zinetac: "ranitidine",
  cifran: "ciprofloxacin",
  "ciplox 500": "ciprofloxacin",
  norflox: "norfloxacin",
  "norflox tz": "norfloxacin_tinidazole",
};

export const INDIAN_DRUG_DETAILS: Record<string, IndianDrugDetail> = {
  paracetamol: {
    genericName: "paracetamol",
    displayGeneric: "Paracetamol (Acetaminophen)",
    category: "Analgesic & Antipyretic",
    timingAdvice: "Take after food with water. Maintain minimum 4 to 6 hours between doses.",
    standardDoses: ["500mg", "650mg"],
    purpose: "Reduces fever and relieves mild to moderate headache, body ache, and toothache.",
    howItWorks: "Blocks prostaglandin chemical messengers in the central nervous system that transmit pain and regulate body temperature.",
    sideEffects: [
      "Nausea or mild stomach discomfort",
      "Allergic rash (rare)",
      "Liver strain if exceeding 3000mg/day",
    ],
  },
  pantoprazole_domperidone: {
    genericName: "pantoprazole_domperidone",
    displayGeneric: "Pantoprazole (40mg) + Domperidone (30mg SR)",
    category: "Antacid & Prokinetic Combination",
    timingAdvice: "Take on an empty stomach in the morning, 30 to 60 minutes before breakfast.",
    standardDoses: ["Pantoprazole 40mg + Domperidone 30mg SR"],
    purpose: "Treats gastroesophageal reflux disease (GERD), acid acidity, heartburn, bloating, and nausea.",
    howItWorks: "Pantoprazole inhibits the gastric proton pump to decrease stomach acid secretion, while Domperidone speeds up stomach emptying to prevent acid regurgitation.",
    sideEffects: [
      "Headache or dry mouth",
      "Mild diarrhea or flatulence",
      "Dizziness or stomach cramping",
    ],
  },
  pantoprazole: {
    genericName: "pantoprazole",
    displayGeneric: "Pantoprazole",
    category: "Proton Pump Inhibitor (PPI)",
    timingAdvice: "Take on an empty stomach 30 to 60 minutes before morning breakfast.",
    standardDoses: ["20mg", "40mg"],
    purpose: "Heals stomach and intestinal ulcers, relieves acid reflux, heartburn, and protects stomach lining from NSAID painkiller damage.",
    howItWorks: "Irreversibly blocks the hydrogen-potassium ATPase pump in gastric parietal cells, significantly decreasing stomach acid volume.",
    sideEffects: [
      "Headache",
      "Nausea or diarrhea",
      "Vitamin B12 / Magnesium depletion with long-term use",
    ],
  },
  aspirin: {
    genericName: "aspirin",
    displayGeneric: "Aspirin (Acetylsalicylic Acid)",
    category: "Antiplatelet / Blood Thinner",
    timingAdvice: "Take immediately after a full meal with a full glass of water. Do not lie down for 15 mins.",
    standardDoses: ["75mg", "150mg"],
    purpose: "Prevents secondary heart attacks, ischemic strokes, and blood clots in high-risk cardiac patients.",
    howItWorks: "Permanently inhibits platelet COX-1 enzyme, stopping thromboxane A2 production and keeping blood platelets from clumping together.",
    sideEffects: [
      "Gastric irritation or acid reflux",
      "Increased bleeding from minor cuts",
      "Stomach ulceration risk",
    ],
  },
  aspirin_atorvastatin: {
    genericName: "aspirin_atorvastatin",
    displayGeneric: "Aspirin (75mg) + Atorvastatin (10mg/20mg)",
    category: "Antiplatelet + Statin Cardiovascular Combination",
    timingAdvice: "Take once daily in the evening after dinner with water. Avoid grapefruit juice.",
    standardDoses: ["Aspirin 75mg + Atorvastatin 10mg", "Aspirin 75mg + Atorvastatin 20mg"],
    purpose: "Provides dual-action secondary protection against heart attacks, ischemic strokes, and peripheral arterial blood clots.",
    howItWorks: "Aspirin permanently blocks platelet clumping while Atorvastatin inhibits HMG-CoA reductase to lower LDL cholesterol and stabilize arterial plaques.",
    sideEffects: [
      "Mild muscle ache or stiffness",
      "Heartburn or indigestion",
      "Increased tendency to bruise",
    ],
  },
  ibuprofen_paracetamol: {
    genericName: "ibuprofen_paracetamol",
    displayGeneric: "Ibuprofen (400mg) + Paracetamol (325mg)",
    category: "NSAID + Analgesic Combination",
    timingAdvice: "Always take with or immediately after meals or milk. Never take on an empty stomach.",
    standardDoses: ["Ibuprofen 400mg + Paracetamol 325mg"],
    purpose: "Provides dual-action relief for severe headache, dental pain, fever, joint inflammation, muscular cramps, and post-injury swelling.",
    howItWorks: "Ibuprofen stops peripheral inflammatory prostaglandins (COX-1/COX-2), while Paracetamol acts on the brain's central pain receptors.",
    sideEffects: [
      "Stomach acidity or burning sensation",
      "Nausea and indigestion",
      "Avoid in kidney disease or stomach ulcer history",
    ],
  },
  bisoprolol: {
    genericName: "bisoprolol",
    displayGeneric: "Bisoprolol Fumarate",
    category: "Cardioselective Beta Blocker",
    timingAdvice: "Take at the same time each morning with or without food. Do not stop abruptly.",
    standardDoses: ["1.25mg", "2.5mg", "5mg"],
    purpose: "Manages hypertension (high blood pressure), angina pectoris, and chronic stable heart failure.",
    howItWorks: "Selectively blocks beta-1 adrenergic receptors in the heart, slowing the heart rate and reducing cardiac workload.",
    sideEffects: [
      "Fatigue or daytime drowsiness",
      "Slow heart rate (bradycardia)",
      "Cold hands or feet",
    ],
  },
  telmisartan: {
    genericName: "telmisartan",
    displayGeneric: "Telmisartan",
    category: "Angiotensin II Receptor Blocker (ARB)",
    timingAdvice: "Take once daily, morning or evening, with or without food at the same time.",
    standardDoses: ["20mg", "40mg", "80mg"],
    purpose: "Controls elevated blood pressure, protects kidneys in diabetic patients, and lowers stroke/heart attack risks.",
    howItWorks: "Blocks the vasoconstricting actions of Angiotensin II on blood vessel receptors, causing vascular relaxation and lower arterial pressure.",
    sideEffects: [
      "Dizziness or lightheadedness when standing",
      "Sinus congestion or back pain",
      "Elevated potassium levels (hyperkalemia)",
    ],
  },
  metformin: {
    genericName: "metformin",
    displayGeneric: "Metformin Hydrochloride",
    category: "Biguanide / Antidiabetic",
    timingAdvice: "Take with or immediately after your largest meals (breakfast/dinner) to minimize stomach upset.",
    standardDoses: ["500mg", "850mg", "1000mg SR"],
    purpose: "First-line management for Type 2 Diabetes Mellitus; improves glycemic control and insulin sensitivity.",
    howItWorks: "Suppresses liver glucose production (gluconeogenesis), reduces intestinal glucose absorption, and enhances cellular insulin uptake.",
    sideEffects: [
      "Nausea, bloating, or loose stools",
      "Metallic taste in mouth",
      "Vitamin B12 deficiency with chronic therapy",
    ],
  },
  dapagliflozin: {
    genericName: "dapagliflozin",
    displayGeneric: "Dapagliflozin",
    category: "SGLT2 Inhibitor / Cardiorenal Protective Antidiabetic",
    timingAdvice: "Take once daily in the morning with or without food. Drink plenty of water throughout the day.",
    standardDoses: ["5mg", "10mg"],
    purpose: "Lowers blood glucose in Type 2 Diabetes, reduces heart failure hospitalizations, and slows progression of chronic kidney disease (CKD).",
    howItWorks: "Blocks the SGLT2 transporter in the kidneys, causing excess bloodstream glucose and sodium to be excreted safely through the urine.",
    sideEffects: [
      "Urinary tract infections (UTIs) or genital thrush",
      "Frequent urination or mild dehydration",
      "Mild lightheadedness",
    ],
  },
  sitagliptin: {
    genericName: "sitagliptin",
    displayGeneric: "Sitagliptin",
    category: "DPP-4 Inhibitor / Incretin Enhancer",
    timingAdvice: "Take once daily with or without food at the same time every day.",
    standardDoses: ["50mg", "100mg"],
    purpose: "Improves blood sugar control in adults with Type 2 Diabetes without significant risk of hypoglycemia or weight gain.",
    howItWorks: "Inhibits DPP-4 enzyme degradation of incretin hormones (GLP-1), triggering insulin secretion only when blood sugar is elevated.",
    sideEffects: [
      "Upper respiratory tract congestion",
      "Headache",
      "Stomach discomfort (rare pancreatitis)",
    ],
  },
  prazosin: {
    genericName: "prazosin",
    displayGeneric: "Prazosin Hydrochloride",
    category: "Alpha-1 Adrenergic Blocker / Antihypertensive",
    timingAdvice: "Take first dose at bedtime to avoid sudden faintness. Take with or without food.",
    standardDoses: ["1mg", "2mg", "5mg", "2.5mg XL", "5mg XL"],
    purpose: "Treats severe hypertension (high blood pressure) and relieves urinary obstruction symptoms caused by benign prostatic hyperplasia (BPH).",
    howItWorks: "Relaxes arterial and venous vascular smooth muscle by blocking alpha-1 receptors, decreasing peripheral vascular resistance.",
    sideEffects: [
      "Orthostatic hypotension (dizziness when standing quickly)",
      "Fatigue or daytime drowsiness",
      "Mild headache or palpitations",
    ],
  },
  cetirizine: {
    genericName: "cetirizine",
    displayGeneric: "Cetirizine Hydrochloride",
    category: "Antihistamine / Anti-Allergic",
    timingAdvice: "Take once daily in the evening or at bedtime with water. May cause mild drowsiness.",
    standardDoses: ["5mg", "10mg"],
    purpose: "Relieves allergic symptoms including seasonal runny nose, sneezing, itchy red watery eyes, skin hives, and allergic itching.",
    howItWorks: "Blocks peripheral histamine H1 receptor sites, stopping histamine from triggering swelling, itching, and mucus secretion.",
    sideEffects: [
      "Mild drowsiness or tiredness",
      "Dry mouth",
      "Mild headache",
    ],
  },
  montelukast_levocetirizine: {
    genericName: "montelukast_levocetirizine",
    displayGeneric: "Montelukast (10mg) + Levocetirizine (5mg)",
    category: "Leukotriene Receptor Antagonist + Antihistamine",
    timingAdvice: "Take once daily in the evening or before bedtime with water.",
    standardDoses: ["Montelukast 10mg + Levocetirizine 5mg"],
    purpose: "Treats persistent allergic rhinitis, asthma symptoms, seasonal allergies, and nocturnal bronchospasm.",
    howItWorks: "Montelukast prevents airway inflammation and constriction by blocking leukotrienes, while Levocetirizine blocks histamine receptors.",
    sideEffects: [
      "Drowsiness or fatigue",
      "Dry mouth or throat irritation",
      "Vivid dreams or headache",
    ],
  },
  fexofenadine: {
    genericName: "fexofenadine",
    displayGeneric: "Fexofenadine Hydrochloride",
    category: "Non-Sedating Second-Generation Antihistamine",
    timingAdvice: "Take with water before meals. Avoid taking with fruit juices (orange, apple, grapefruit) within 4 hours.",
    standardDoses: ["120mg", "180mg"],
    purpose: "Relieves seasonal allergic rhinitis, hay fever, and chronic hives (urticaria) without causing sedation.",
    howItWorks: "Blocks peripheral histamine H1 receptors without crossing the blood-brain barrier, providing non-drowsy allergy relief.",
    sideEffects: [
      "Headache",
      "Mild nausea",
      "Dizziness (rare)",
    ],
  },

  // ── Oncology & Critical Care Formulations ──
  imatinib: {
    genericName: "imatinib",
    displayGeneric: "Imatinib Mesylate",
    category: "Tyrosine Kinase Inhibitor / Oral Targeted Chemotherapy",
    timingAdvice: "Take with a full meal and a large glass of water to reduce stomach irritation. Do not crush tablets.",
    standardDoses: ["100mg", "400mg"],
    purpose: "First-line oral targeted therapy for Chronic Myeloid Leukemia (CML), Ph+ ALL, and Gastrointestinal Stromal Tumors (GIST).",
    howItWorks: "Selectively binds and deactivates BCR-ABL tyrosine kinase, stopping the runaway growth of abnormal malignant white blood cells.",
    sideEffects: [
      "Fluid retention / puffiness around eyes and legs",
      "Nausea or diarrhea",
      "Muscle cramps or joint aches",
      "Fatigue or low blood counts",
    ],
  },
  tamoxifen: {
    genericName: "tamoxifen",
    displayGeneric: "Tamoxifen Citrate",
    category: "Selective Estrogen Receptor Modulator (SERM) / Hormone Therapy",
    timingAdvice: "Take once daily at the same time each day with or without food. Swallow with water.",
    standardDoses: ["10mg", "20mg"],
    purpose: "Treats and reduces recurrence risk of estrogen receptor-positive (ER+) breast cancer in women and men.",
    howItWorks: "Binds competitively to estrogen receptors in breast tumor cells, preventing estrogen from fueling cancer cell multiplication.",
    sideEffects: [
      "Hot flashes and night sweats",
      "Nausea or fatigue",
      "Vaginal discharge or irregular cycles",
      "Increased blood clot risk",
    ],
  },
  methotrexate: {
    genericName: "methotrexate",
    displayGeneric: "Methotrexate",
    category: "Antimetabolite / Antineoplastic & Disease-Modifying Drug (DMARD)",
    timingAdvice: "⚠️ CRITICAL SAFETY: For arthritis/psoriasis, take strictly ONCE WEEKLY on the same designated day, NOT daily. Take with food.",
    standardDoses: ["2.5mg", "5mg", "7.5mg", "10mg", "15mg"],
    purpose: "Treats acute leukemias, severe rheumatoid arthritis, and severe resistant psoriasis.",
    howItWorks: "Inhibits dihydrofolate reductase (DHFR), starving rapidly dividing cancer and autoimmune cells of the folate needed for DNA synthesis.",
    sideEffects: [
      "Mouth sores or ulcers",
      "Nausea or loss of appetite",
      "Low white blood cell count",
      "Take prescribed folic acid on non-methotrexate days",
    ],
  },
  capecitabine: {
    genericName: "capecitabine",
    displayGeneric: "Capecitabine",
    category: "Fluoropyrimidine Carbamate / Oral Chemotherapy",
    timingAdvice: "Take strictly within 30 minutes after completing a meal with water. Follow prescribed 14-day on, 7-day off cycle.",
    standardDoses: ["500mg"],
    purpose: "Oral chemotherapy for metastatic colorectal cancer, advanced gastric cancer, and locally advanced breast cancer.",
    howItWorks: "Enzymatically converts inside tumor cells to active 5-FU, disrupting DNA replication and arresting cancer cell growth.",
    sideEffects: [
      "Hand-foot syndrome (tingling, redness, peeling on palms/soles)",
      "Diarrhea or vomiting",
      "Fatigue and weakness",
    ],
  },
  ondansetron: {
    genericName: "ondansetron",
    displayGeneric: "Ondansetron Hydrochloride",
    category: "5-HT3 Receptor Antagonist / Antiemetic",
    timingAdvice: "Take 30 minutes before chemotherapy or radiation, or at onset of severe nausea. With or without food.",
    standardDoses: ["4mg", "8mg"],
    purpose: "Prevents and treats severe nausea and vomiting caused by cancer chemotherapy, radiation therapy, and surgical procedures.",
    howItWorks: "Blocks serotonin receptors centrally in the vomiting center (CTZ) and peripherally in the gastrointestinal tract.",
    sideEffects: [
      "Headache",
      "Constipation",
      "Warmth or flushing sensation",
    ],
  },
  gefitinib: {
    genericName: "gefitinib",
    displayGeneric: "Gefitinib",
    category: "EGFR Tyrosine Kinase Inhibitor / Targeted Antineoplastic",
    timingAdvice: "Take once daily with or without food at the same time every day. Swallow tablet whole with water.",
    standardDoses: ["250mg"],
    purpose: "Targeted oral therapy for non-small cell lung cancer (NSCLC) harboring activating EGFR mutations.",
    howItWorks: "Inhibits EGFR tyrosine kinase phosphorylation, preventing downstream signaling pathways essential for tumor survival and proliferation.",
    sideEffects: [
      "Acne-like facial skin rash or dry skin",
      "Diarrhea",
      "Nausea or loss of appetite",
    ],
  },
  amoxicillin_clavulanate: {
    genericName: "amoxicillin_clavulanate",
    displayGeneric: "Amoxicillin (500mg) + Clavulanic Acid (125mg)",
    category: "Broad-Spectrum Antibiotic",
    timingAdvice: "Take at the start of a meal to optimize absorption and reduce gastrointestinal irritation.",
    standardDoses: ["625mg Duo", "375mg"],
    purpose: "Treats bacterial infections of the respiratory tract, sinuses, ears, urinary tract, and skin.",
    howItWorks: "Amoxicillin inhibits bacterial cell wall synthesis while Clavulanic Acid deactivates bacterial beta-lactamase resistance enzymes.",
    sideEffects: [
      "Mild diarrhea or loose stools",
      "Nausea and stomach upset",
      "Complete the full prescribed course",
    ],
  },
  mefenamic_dicyclomine: {
    genericName: "mefenamic_dicyclomine",
    displayGeneric: "Mefenamic Acid (250mg) + Dicyclomine HCl (10mg)",
    category: "Antispasmodic & NSAID",
    timingAdvice: "Take after meals with water as-needed during spasmodic pain episodes.",
    standardDoses: ["Mefenamic 250mg + Dicyclomine 10mg"],
    purpose: "Relieves painful menstrual cramps (dysmenorrhea), abdominal colic, and intestinal muscle spasms.",
    howItWorks: "Dicyclomine relaxes contracted smooth muscles in the gut while Mefenamic Acid reduces pain-causing prostaglandins.",
    sideEffects: [
      "Dry mouth and thirst",
      "Drowsiness or blurred vision",
      "Stomach upset",
    ],
  },
  calcium_vitamin_d3: {
    genericName: "calcium_vitamin_d3",
    displayGeneric: "Elemental Calcium (500mg) + Vitamin D3 (250 IU)",
    category: "Nutritional Bone Mineral Supplement",
    timingAdvice: "Take after lunch or dinner with plenty of water for optimal mineral absorption.",
    standardDoses: ["500mg + 250IU", "500mg + 400IU"],
    purpose: "Prevents and treats calcium deficiency, osteoporosis, weak bone density, and osteomalacia.",
    howItWorks: "Supplies elemental calcium for bone mineral scaffolding while Vitamin D3 enhances intestinal calcium transport into the bloodstream.",
    sideEffects: [
      "Constipation or mild flatulence",
      "Stomach heaviness",
      "Avoid taking concurrently with iron or thyroid medication (space by 3 hours)",
    ],
  },
};

/**
 * Normalizes an input string and resolves Indian trade brands to generic keys,
 * backed by typo-tolerant fuzzy matching (Levenshtein distance <= 2).
 */
export function resolveIndianBrand(rawName: string): {
  isIndianBrand: boolean;
  genericName: string;
  displayGeneric?: string;
  details?: IndianDrugDetail;
  matchType?: "exact" | "substring" | "fuzzy";
  distance?: number;
} {
  if (!rawName) {
    return { isIndianBrand: false, genericName: "" };
  }

  const normalized = rawName.toLowerCase().trim();

  // 1. Direct alias match
  if (INDIAN_BRAND_ALIASES[normalized]) {
    const genericKey = INDIAN_BRAND_ALIASES[normalized];
    const details = INDIAN_DRUG_DETAILS[genericKey];
    return {
      isIndianBrand: true,
      genericName: genericKey,
      displayGeneric: details?.displayGeneric || genericKey,
      details,
      matchType: "exact",
      distance: 0,
    };
  }

  // 2. Direct match in details dictionary
  if (INDIAN_DRUG_DETAILS[normalized]) {
    const details = INDIAN_DRUG_DETAILS[normalized];
    return {
      isIndianBrand: false,
      genericName: normalized,
      displayGeneric: details.displayGeneric,
      details,
      matchType: "exact",
      distance: 0,
    };
  }

  // 3. Token / partial alias match (e.g. "Dolo 650mg Tab" matches "dolo")
  for (const [alias, genericKey] of Object.entries(INDIAN_BRAND_ALIASES)) {
    if (
      normalized === alias ||
      normalized.startsWith(`${alias} `) ||
      normalized.includes(alias)
    ) {
      const details = INDIAN_DRUG_DETAILS[genericKey];
      return {
        isIndianBrand: true,
        genericName: genericKey,
        displayGeneric: details?.displayGeneric || genericKey,
        details,
        matchType: "substring",
        distance: 0,
      };
    }
  }

  // 4. Typo-Tolerant Fuzzy Match (Levenshtein distance <= 2)
  const fuzzy = fuzzyResolveIndianMedicine(
    rawName,
    INDIAN_BRAND_ALIASES,
    INDIAN_DRUG_DETAILS,
    2
  );

  if (fuzzy) {
    return {
      isIndianBrand: true,
      genericName: fuzzy.genericKey,
      displayGeneric: fuzzy.displayGeneric,
      details: fuzzy.details,
      matchType: fuzzy.matchType,
      distance: fuzzy.distance,
    };
  }

  return { isIndianBrand: false, genericName: rawName };
}
