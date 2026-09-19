import { type Medication, type DetectedInteraction, type DrugInteraction } from "../types";
import { DRUG_INTERACTIONS } from "../data/interactions";
import { resolveIndianBrand } from "../data/indianMedicines";

/**
 * Maps composite generics or synonymous terms to arrays of searchable ingredient terms.
 */
function expandIngredients(key: string): string[] {
  const norm = key.toLowerCase().trim();
  const set = new Set<string>([norm]);

  // Synonyms & Composites
  if (norm.includes("paracetamol") || norm.includes("acetaminophen")) {
    set.add("paracetamol");
    set.add("acetaminophen");
  }
  if (norm.includes("ibuprofen_paracetamol") || norm.includes("combiflam")) {
    set.add("ibuprofen");
    set.add("paracetamol");
    set.add("acetaminophen");
    set.add("nsaid");
  }
  if (norm.includes("aspirin") || norm.includes("ecosprin")) {
    set.add("aspirin");
    set.add("acetylsalicylic acid");
  }
  if (norm.includes("pantoprazole_domperidone") || norm.includes("pan-d")) {
    set.add("pantoprazole");
    set.add("domperidone");
    set.add("ppi");
  }
  if (norm.includes("amoxicillin_clavulanate") || norm.includes("augmentin")) {
    set.add("amoxicillin");
    set.add("clavulanate");
    set.add("clavulanic acid");
  }
  if (norm.includes("mefenamic_dicyclomine") || norm.includes("meftal")) {
    set.add("mefenamic acid");
    set.add("dicyclomine");
    set.add("nsaid");
  }
  if (norm.includes("calcium_vitamin_d3") || norm.includes("shelcal")) {
    set.add("calcium");
    set.add("vitamin d");
    set.add("vitamin d3");
  }

  return Array.from(set);
}

/**
 * Normalizes and checks if a medication name matches a rule target drug name.
 * Resolves Indian trade brands, handles multi-ingredient combos, and checks aliases.
 */
function matchesDrug(medName: string, ruleDrug: string): boolean {
  const normalizedMed = medName.toLowerCase().trim();
  const normalizedRule = ruleDrug.toLowerCase().trim();

  // 1. Direct or Substring match
  if (
    normalizedMed.includes(normalizedRule) ||
    normalizedRule.includes(normalizedMed)
  ) {
    return true;
  }

  // 2. Token word match
  const medTokens = normalizedMed.split(/[\s,/-]+/);
  const ruleTokens = normalizedRule.split(/[\s,/-]+/);
  if (ruleTokens.some((rt) => medTokens.includes(rt))) {
    return true;
  }

  // 3. Indian Brand Alias Resolution
  const { genericName } = resolveIndianBrand(normalizedMed);
  const expandedIngredients = expandIngredients(genericName || normalizedMed);

  for (const ing of expandedIngredients) {
    if (
      ing.includes(normalizedRule) ||
      normalizedRule.includes(ing) ||
      ruleTokens.some((rt) => ing.split(/[\s,/-]+/).includes(rt))
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Evaluates all unique pairs of user medications against clinical interaction rules.
 * Runs in O(N^2 * R).
 */
export function detectInteractions(medications: Medication[]): DetectedInteraction[] {
  if (!medications || medications.length < 2) return [];

  const detected: DetectedInteraction[] = [];
  const seenPairs = new Set<string>();

  for (let i = 0; i < medications.length; i++) {
    for (let j = i + 1; j < medications.length; j++) {
      const medA = medications[i];
      const medB = medications[j];

      // Pair identifier independent of order
      const pairKey = [medA.id, medB.id].sort().join("<->");

      for (const rule of DRUG_INTERACTIONS) {
        const [target1, target2] = rule.drugs;

        const forwardMatch = matchesDrug(medA.name, target1) && matchesDrug(medB.name, target2);
        const reverseMatch = matchesDrug(medA.name, target2) && matchesDrug(medB.name, target1);

        if (forwardMatch || reverseMatch) {
          const rulePairKey = `${pairKey}:${rule.id}`;
          if (!seenPairs.has(rulePairKey)) {
            seenPairs.add(rulePairKey);
            detected.push({
              id: `detected_${rule.id}_${medA.id}_${medB.id}`,
              rule,
              medicationA: forwardMatch ? medA : medB,
              medicationB: forwardMatch ? medB : medA,
            });
          }
        }
      }
    }
  }

  // Sort: High severity first, then moderate
  return detected.sort((a, b) => {
    if (a.rule.severity === "high" && b.rule.severity !== "high") return -1;
    if (a.rule.severity !== "high" && b.rule.severity === "high") return 1;
    return 0;
  });
}

/**
 * Returns a set of medication IDs that are involved in at least one active interaction conflict.
 */
export function getConflictingMedicationIds(interactions: DetectedInteraction[]): Set<string> {
  const ids = new Set<string>();
  for (const item of interactions) {
    ids.add(item.medicationA.id);
    ids.add(item.medicationB.id);
  }
  return ids;
}
