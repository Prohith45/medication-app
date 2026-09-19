// ─── Local Drug Library (Fallback for OpenFDA) ──────────────────────
// Patient-friendly descriptions for common medications.

export interface DrugInfo {
  name: string;
  category: string; // e.g. "Blood Thinner", "Antidiabetic"
  purpose: string; // 1–2 plain-language sentences
  howItWorks: string; // 1 sentence on biological mechanism
  sideEffects: string[]; // 3–5 common side effects
}

export const DRUG_LIBRARY: Record<string, DrugInfo> = {
  aspirin: {
    name: "Aspirin",
    category: "Blood Thinner / Pain Reliever",
    purpose:
      "Aspirin is used to relieve mild-to-moderate pain, reduce fever, and help prevent blood clots. It is often prescribed in low doses to protect against heart attacks and strokes.",
    howItWorks:
      "Aspirin blocks an enzyme called COX, which reduces the production of prostaglandins — chemicals that cause pain, inflammation, and blood clotting.",
    sideEffects: [
      "Stomach upset or heartburn",
      "Increased bleeding tendency",
      "Nausea",
      "Ringing in the ears (tinnitus)",
      "Allergic reactions (rare)",
    ],
  },
  metformin: {
    name: "Metformin",
    category: "Antidiabetic",
    purpose:
      "Metformin helps control high blood sugar in people with type 2 diabetes. It is usually the first medication prescribed and can help prevent diabetes-related complications.",
    howItWorks:
      "Metformin reduces the amount of sugar your liver releases into the blood and helps your body respond better to insulin.",
    sideEffects: [
      "Nausea or stomach upset",
      "Diarrhea",
      "Metallic taste in mouth",
      "Loss of appetite",
      "Vitamin B12 deficiency (long-term)",
    ],
  },
  lisinopril: {
    name: "Lisinopril",
    category: "ACE Inhibitor / Blood Pressure",
    purpose:
      "Lisinopril is used to treat high blood pressure and heart failure. It can also help protect the kidneys in people with diabetes.",
    howItWorks:
      "Lisinopril blocks an enzyme (ACE) that narrows blood vessels, allowing them to relax and widen so blood flows more easily.",
    sideEffects: [
      "Dry cough",
      "Dizziness or lightheadedness",
      "Headache",
      "Elevated potassium levels",
      "Fatigue",
    ],
  },
  warfarin: {
    name: "Warfarin",
    category: "Blood Thinner (Anticoagulant)",
    purpose:
      "Warfarin prevents harmful blood clots from forming or growing. It is prescribed to people at risk of stroke, deep vein thrombosis, or pulmonary embolism.",
    howItWorks:
      "Warfarin blocks vitamin K, which your liver needs to make clotting factors, so your blood takes longer to clot.",
    sideEffects: [
      "Increased bruising",
      "Bleeding gums",
      "Blood in urine or stools",
      "Prolonged bleeding from cuts",
      "Hair loss (rare)",
    ],
  },
  atorvastatin: {
    name: "Atorvastatin",
    category: "Statin / Cholesterol Lowering",
    purpose:
      "Atorvastatin lowers LDL ('bad') cholesterol and triglycerides in the blood. It helps reduce the risk of heart attack and stroke.",
    howItWorks:
      "Atorvastatin blocks an enzyme in the liver (HMG-CoA reductase) that is needed to produce cholesterol, so your body makes less of it.",
    sideEffects: [
      "Muscle pain or weakness",
      "Joint pain",
      "Nausea or digestive upset",
      "Headache",
      "Elevated liver enzymes (rare)",
    ],
  },
  amoxicillin: {
    name: "Amoxicillin",
    category: "Antibiotic",
    purpose:
      "Amoxicillin treats bacterial infections such as ear infections, urinary tract infections, bronchitis, and strep throat. It does not work against viruses.",
    howItWorks:
      "Amoxicillin kills bacteria by preventing them from building their cell walls, causing the bacteria to burst and die.",
    sideEffects: [
      "Diarrhea",
      "Nausea or vomiting",
      "Skin rash",
      "Stomach cramps",
      "Yeast infections",
    ],
  },
  ibuprofen: {
    name: "Ibuprofen",
    category: "NSAID / Pain Reliever",
    purpose:
      "Ibuprofen relieves pain, reduces inflammation, and lowers fever. It is commonly used for headaches, muscle aches, menstrual cramps, and arthritis.",
    howItWorks:
      "Ibuprofen blocks COX enzymes, reducing the production of prostaglandins — chemicals responsible for pain, swelling, and fever.",
    sideEffects: [
      "Stomach pain or heartburn",
      "Nausea",
      "Dizziness",
      "Increased risk of stomach ulcers",
      "Kidney problems (with prolonged use)",
    ],
  },
  omeprazole: {
    name: "Omeprazole",
    category: "Proton Pump Inhibitor (PPI)",
    purpose:
      "Omeprazole reduces stomach acid production and is used to treat heartburn, gastroesophageal reflux disease (GERD), and stomach ulcers.",
    howItWorks:
      "Omeprazole shuts down tiny acid pumps in the lining of your stomach, significantly reducing the amount of acid produced.",
    sideEffects: [
      "Headache",
      "Nausea or stomach pain",
      "Diarrhea or constipation",
      "Flatulence",
      "Vitamin B12 deficiency (long-term)",
    ],
  },
  amlodipine: {
    name: "Amlodipine",
    category: "Calcium Channel Blocker / Blood Pressure",
    purpose:
      "Amlodipine is used to treat high blood pressure and chest pain (angina). Lowering blood pressure helps prevent strokes, heart attacks, and kidney problems.",
    howItWorks:
      "Amlodipine relaxes blood vessel walls by blocking calcium from entering muscle cells, allowing blood to flow more easily.",
    sideEffects: [
      "Ankle swelling (edema)",
      "Dizziness",
      "Flushing",
      "Fatigue",
      "Heart palpitations",
    ],
  },
  metoprolol: {
    name: "Metoprolol",
    category: "Beta Blocker / Heart & Blood Pressure",
    purpose:
      "Metoprolol is used to treat high blood pressure, chest pain, and heart failure. It also helps prevent future heart attacks in people who have had one.",
    howItWorks:
      "Metoprolol blocks beta-adrenergic receptors in the heart, slowing the heart rate and reducing the force of each heartbeat to lower blood pressure.",
    sideEffects: [
      "Tiredness or fatigue",
      "Dizziness",
      "Slow heartbeat",
      "Cold hands and feet",
      "Depression or mood changes",
    ],
  },
  losartan: {
    name: "Losartan",
    category: "ARB / Blood Pressure",
    purpose:
      "Losartan treats high blood pressure and helps protect the kidneys in people with type 2 diabetes. It is also used to lower the risk of stroke.",
    howItWorks:
      "Losartan blocks the action of angiotensin II, a hormone that tightens blood vessels, allowing vessels to relax and blood pressure to drop.",
    sideEffects: [
      "Dizziness",
      "Stuffy nose",
      "Back pain",
      "Fatigue",
      "Elevated potassium (rare)",
    ],
  },
  levothyroxine: {
    name: "Levothyroxine",
    category: "Thyroid Hormone Replacement",
    purpose:
      "Levothyroxine replaces the thyroid hormone your body cannot produce enough of (hypothyroidism). It helps restore normal energy levels, metabolism, and body temperature.",
    howItWorks:
      "Levothyroxine is a synthetic version of the T4 hormone that your thyroid gland naturally makes; it is converted in your body to the active T3 hormone.",
    sideEffects: [
      "Weight changes",
      "Headache",
      "Nervousness or irritability",
      "Sweating",
      "Temporary hair loss (when starting)",
    ],
  },
  sertraline: {
    name: "Sertraline",
    category: "SSRI / Antidepressant",
    purpose:
      "Sertraline is used to treat depression, anxiety disorders, OCD, PTSD, and panic attacks. It helps improve mood, sleep, appetite, and energy levels.",
    howItWorks:
      "Sertraline increases the level of serotonin in the brain by preventing its reabsorption, which helps regulate mood and emotional responses.",
    sideEffects: [
      "Nausea",
      "Dizziness",
      "Drowsiness or insomnia",
      "Dry mouth",
      "Sexual dysfunction",
    ],
  },
  gabapentin: {
    name: "Gabapentin",
    category: "Anticonvulsant / Nerve Pain",
    purpose:
      "Gabapentin treats nerve pain (neuropathy), seizures, and restless legs syndrome. It is also used off-label for anxiety and chronic pain conditions.",
    howItWorks:
      "Gabapentin calms overactive nerve signals in the brain and nervous system by mimicking the neurotransmitter GABA, though its exact mechanism is not fully understood.",
    sideEffects: [
      "Drowsiness or dizziness",
      "Fatigue",
      "Coordination problems",
      "Swelling in hands/feet",
      "Blurred vision",
    ],
  },
  acetaminophen: {
    name: "Acetaminophen",
    category: "Analgesic / Fever Reducer",
    purpose:
      "Acetaminophen (Tylenol) relieves mild-to-moderate pain and reduces fever. It is commonly used for headaches, muscle aches, colds, and toothaches.",
    howItWorks:
      "Acetaminophen works in the brain to reduce the perception of pain and lower the body's thermostat to bring down fever; its exact mechanism is still being studied.",
    sideEffects: [
      "Nausea",
      "Stomach pain",
      "Liver damage (with overdose)",
      "Allergic skin reactions (rare)",
      "Loss of appetite",
    ],
  },
};
