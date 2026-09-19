/**
 * Lightweight, zero-dependency Levenshtein distance and typo-tolerant fuzzy matching
 * for Indian medicine brands and generic formulations.
 */

import { type IndianDrugDetail } from "../data/indianMedicines";

/**
 * Computes standard Levenshtein edit distance between two strings.
 */
export function levenshteinDistance(a: string, b: string): number {
  const al = a.length;
  const bl = b.length;
  if (al === 0) return bl;
  if (bl === 0) return al;

  // Single row dynamic programming to minimize memory allocation
  let prevRow = new Array(bl + 1);
  let currRow = new Array(bl + 1);

  for (let j = 0; j <= bl; j++) {
    prevRow[j] = j;
  }

  for (let i = 1; i <= al; i++) {
    currRow[0] = i;
    const aChar = a[i - 1];

    for (let j = 1; j <= bl; j++) {
      const cost = aChar === b[j - 1] ? 0 : 1;
      currRow[j] = Math.min(
        prevRow[j] + 1, // deletion
        currRow[j - 1] + 1, // insertion
        prevRow[j - 1] + cost // substitution
      );
    }

    // Swap buffers
    const temp = prevRow;
    prevRow = currRow;
    currRow = temp;
  }

  return prevRow[bl];
}

/**
 * Normalizes a drug name for typo comparison by stripping dosage forms and numbers.
 */
export function normalizeDrugToken(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\b(tablets?|tab|capsules?|cap|syrup|syp|inj|injection|suspension|drops?|gel|cream|ointment)\b/gi, "")
    .replace(/\b(\d+(\.\d+)?\s*(mg|ml|gm|g|mcg|iu|iu\/ml|%))\b/gi, "")
    .replace(/\b(sr|cr|er|xl|dsr|hcl|forte|plus|duo)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

export interface FuzzyMatchResult {
  matchedKey: string;
  genericKey: string;
  displayGeneric?: string;
  distance: number;
  matchType: "exact" | "substring" | "fuzzy";
  details?: IndianDrugDetail;
}

/**
 * Resolves a drug query against an alias dictionary and details map with typo tolerance.
 * Distance threshold default is 2 (e.g., "citirizen" -> "cetirizine", "doloo" -> "dolo").
 */
export function fuzzyResolveIndianMedicine(
  query: string,
  aliases: Record<string, string>,
  detailsMap: Record<string, IndianDrugDetail>,
  maxDistance: number = 2
): FuzzyMatchResult | null {
  if (!query || query.trim().length === 0) return null;

  const raw = query.toLowerCase().trim();
  const normalized = normalizeDrugToken(raw);
  const mainWord = normalized.split(" ")[0] || normalized;

  // ── Tier 1A: Exact alias or details match ──
  if (aliases[raw]) {
    const gen = aliases[raw];
    return {
      matchedKey: raw,
      genericKey: gen,
      displayGeneric: detailsMap[gen]?.displayGeneric || gen,
      distance: 0,
      matchType: "exact",
      details: detailsMap[gen],
    };
  }

  if (detailsMap[raw]) {
    return {
      matchedKey: raw,
      genericKey: raw,
      displayGeneric: detailsMap[raw].displayGeneric,
      distance: 0,
      matchType: "exact",
      details: detailsMap[raw],
    };
  }

  if (normalized && aliases[normalized]) {
    const gen = aliases[normalized];
    return {
      matchedKey: normalized,
      genericKey: gen,
      displayGeneric: detailsMap[gen]?.displayGeneric || gen,
      distance: 0,
      matchType: "exact",
      details: detailsMap[gen],
    };
  }

  // ── Tier 1B: Prefix / Token Containment ──
  for (const [alias, genericKey] of Object.entries(aliases)) {
    if (
      normalized === alias ||
      normalized.startsWith(`${alias} `) ||
      (alias.length >= 4 && normalized.includes(alias))
    ) {
      return {
        matchedKey: alias,
        genericKey,
        displayGeneric: detailsMap[genericKey]?.displayGeneric || genericKey,
        distance: 0,
        matchType: "substring",
        details: detailsMap[genericKey],
      };
    }
  }

  // ── Tier 1C: Levenshtein Distance Matching (<= maxDistance) ──
  let bestMatch: FuzzyMatchResult | null = null;
  let minDistance = maxDistance + 1;

  // Candidate pool: all aliases + all generic keys in details map
  const candidateEntries: [string, string][] = [
    ...Object.entries(aliases),
    ...Object.keys(detailsMap).map((k) => [k, k] as [string, string]),
  ];

  for (const [candidate, genericKey] of candidateEntries) {
    // 1. Compare against normalized full string
    const distFull = levenshteinDistance(normalized, candidate);
    if (distFull < minDistance && distFull <= maxDistance) {
      minDistance = distFull;
      bestMatch = {
        matchedKey: candidate,
        genericKey,
        displayGeneric: detailsMap[genericKey]?.displayGeneric || genericKey,
        distance: distFull,
        matchType: "fuzzy",
        details: detailsMap[genericKey],
      };
    }

    // 2. Compare against primary first word token (e.g. "citirizen" from "citirizen 10mg")
    if (mainWord !== normalized && mainWord.length >= 3) {
      const distWord = levenshteinDistance(mainWord, candidate);
      if (distWord < minDistance && distWord <= maxDistance) {
        minDistance = distWord;
        bestMatch = {
          matchedKey: candidate,
          genericKey,
          displayGeneric: detailsMap[genericKey]?.displayGeneric || genericKey,
          distance: distWord,
          matchType: "fuzzy",
          details: detailsMap[genericKey],
        };
      }
    }
  }

  return bestMatch;
}
