import { type DrugInteraction } from "../types";

/**
 * Predefined Clinical Drug Interactions Dataset
 * Covers well-documented pairwise interactions, categorised by severity.
 */
export const DRUG_INTERACTIONS: DrugInteraction[] = [
  {
    id: "int_ecosprin_combiflam",
    drugs: ["Aspirin", "Combiflam"],
    severity: "high",
    title: "High Bleeding Risk: Dual Antiplatelet & NSAID Interaction",
    description:
      "Combining antiplatelet Ecosprin (Aspirin) with Combiflam (Ibuprofen + Paracetamol) sharply increases upper gastrointestinal mucosal bleeding, ulceration, and platelet inhibition.",
    actionRequired:
      "Avoid taking Combiflam while on Ecosprin. Consult your doctor or pharmacist for a safer analgesic such as standalone Paracetamol.",
  },
  {
    id: "int_aspirin_warfarin",
    drugs: ["Aspirin", "Warfarin"],
    severity: "high",
    title: "Severe Bleeding Hazard",
    description:
      "Combining anticoagulant Warfarin with antiplatelet Aspirin dramatically increases systemic bleeding risk, gastrointestinal hemorrhages, and spontaneous bruising.",
    actionRequired:
      "Do not combine without direct hematologist/cardiologist supervision. Seek urgent medical care if you notice unexplained bruising, blood in stools, or persistent nosebleeds.",
  },
  {
    id: "int_ibuprofen_warfarin",
    drugs: ["Ibuprofen", "Warfarin"],
    severity: "high",
    title: "Gastrointestinal Ulceration & Severe Hemorrhage",
    description:
      "NSAIDs like Ibuprofen cause stomach mucosal erosion and platelet inhibition, compounding Warfarin's anticoagulant effect into severe internal hemorrhage risk.",
    actionRequired:
      "Avoid concurrent use. Discuss alternative pain relief options (e.g., monitored Acetaminophen) with your doctor or pharmacist.",
  },
  {
    id: "int_metformin_alcohol",
    drugs: ["Metformin", "Alcohol"],
    severity: "high",
    title: "Life-Threatening Lactic Acidosis Risk",
    description:
      "Excessive or acute alcohol consumption while taking Metformin impairs liver lactate clearance and potentiates severe metabolic lactic acidosis.",
    actionRequired:
      "Avoid heavy or binge alcohol consumption while taking Metformin. Watch for symptoms like muscle cramping, rapid breathing, and extreme drowsiness.",
  },
  {
    id: "int_lisinopril_potassium",
    drugs: ["Lisinopril", "Potassium Supplements"],
    severity: "moderate",
    title: "Hyperkalemia (Elevated Blood Potassium) Risk",
    description:
      "ACE inhibitors such as Lisinopril conserve potassium in the kidneys. Adding potassium supplements or salt substitutes can elevate serum potassium to cardiotoxic levels.",
    actionRequired:
      "Do not take over-the-counter potassium supplements or salt substitutes without routine potassium blood monitoring authorized by your physician.",
  },
  {
    id: "int_lisinopril_ibuprofen",
    drugs: ["Lisinopril", "Ibuprofen"],
    severity: "moderate",
    title: "Reduced Antihypertensive Efficacy & Acute Kidney Strain",
    description:
      "NSAIDs (Ibuprofen) blunt renal prostaglandin synthesis, reducing Lisinopril's blood pressure-lowering effectiveness and increasing acute renal failure risk.",
    actionRequired:
      "Consult your physician for non-NSAID analgesics if you require chronic pain management while managing hypertension.",
  },
  {
    id: "int_atorvastatin_clarithromycin",
    drugs: ["Atorvastatin", "Clarithromycin"],
    severity: "moderate",
    title: "Statin Toxicity & Rhabdomyolysis Risk",
    description:
      "Clarithromycin strongly inhibits the CYP3A4 metabolic pathway responsible for breaking down Atorvastatin, multiplying blood statin concentrations and risking severe muscle damage.",
    actionRequired:
      "Atorvastatin is commonly paused temporarily while taking clarithromycin. Notify your prescribing physician immediately if experiencing severe muscle aches.",
  },
  {
    id: "int_aspirin_ibuprofen",
    drugs: ["Aspirin", "Ibuprofen"],
    severity: "moderate",
    title: "Decreased Cardioprotection & Increased GI Irritation",
    description:
      "Ibuprofen competes with low-dose Aspirin for platelet COX-1 binding sites, hindering Aspirin's anti-clotting cardiac protection and compounding gastrointestinal irritation.",
    actionRequired:
      "If both are required, take immediate-release Aspirin at least 30 minutes before Ibuprofen, or 8 hours after, per pharmacist recommendations.",
  },
  {
    id: "int_omeprazole_clopidogrel",
    drugs: ["Omeprazole", "Clopidogrel"],
    severity: "moderate",
    title: "Reduced Antiplatelet Activation",
    description:
      "Omeprazole inhibits CYP2C19, the hepatic enzyme required to convert Clopidogrel into its active antiplatelet form, reducing protection against arterial clots.",
    actionRequired:
      "Ask your physician or gastroenterologist about alternative acid suppressants that do not strongly inhibit CYP2C19 (such as Pantoprazole).",
  },
  {
    id: "int_sertraline_aspirin",
    drugs: ["Sertraline", "Aspirin"],
    severity: "moderate",
    title: "Additive Upper GI Bleed Susceptibility",
    description:
      "SSRIs like Sertraline decrease platelet serotonin storage, amplifying the antiplatelet bleeding vulnerability provoked by Aspirin.",
    actionRequired:
      "Report any unusual dark stools or easy bruising. Your doctor may evaluate protective gastroprotective measures if both medications are essential.",
  },
  {
    id: "int_warfarin_acetaminophen",
    drugs: ["Warfarin", "Acetaminophen"],
    severity: "moderate",
    title: "Elevated INR / Bleeding with Prolonged High Dose",
    description:
      "Chronic high-dose Acetaminophen (>2g/day for several days) can inhibit Warfarin metabolism, raising the International Normalized Ratio (INR) and bleeding susceptibility.",
    actionRequired:
      "Limit Acetaminophen to occasional, lowest-effective doses and alert your anticoagulation clinic if using it regularly.",
  },
  {
    id: "int_hydrochlorothiazide_ibuprofen",
    drugs: ["Hydrochlorothiazide", "Ibuprofen"],
    severity: "moderate",
    title: "Antagonism of Diuretic Efficacy & Renal Stress",
    description:
      "Ibuprofen counteracts the natriuretic and blood pressure-lowering effects of thiazide diuretics like Hydrochlorothiazide, potentially worsening fluid retention.",
    actionRequired:
      "Monitor blood pressure and fluid swelling in ankles. Discuss alternative pain management options with your physician.",
  },
  {
    id: "int_atorvastatin_gemfibrozil",
    drugs: ["Atorvastatin", "Gemfibrozil"],
    severity: "high",
    title: "Severe Myopathy and Rhabdomyolysis Risk",
    description:
      "Gemfibrozil impairs statin glucuronidation and clearance, causing dangerous accumulation of Atorvastatin that can trigger muscle breakdown and acute kidney failure.",
    actionRequired:
      "Concomitant use is generally contraindicated. Consult your clinician for alternative lipid-lowering regimens.",
  },
];
