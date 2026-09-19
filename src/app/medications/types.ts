// ─── Medication Data Types ───────────────────────────────────────────

export type Frequency = "daily" | "weekly" | "as-needed";

export type DosingPattern =
  | "morning"
  | "afternoon"
  | "evening"
  | "night"
  | "with-breakfast"
  | "with-lunch"
  | "with-dinner"
  | "before-meals"
  | "after-meals";

export interface Medication {
  id: string;
  name: string;
  dose: string; // e.g. "100mg", "500mg"
  frequency: Frequency;
  dosingPattern: DosingPattern;
  times: string[]; // e.g. ["08:00", "20:00"]
  timingCondition?: string; // e.g. "Morning (Breakfast)", "Take after food"
  initialStatus?: "due" | "pending";
  createdAt: string; // ISO date string
}

export type MedicationFormData = Omit<Medication, "id" | "createdAt">;

export interface DayMatrixEntry {
  dayNumber: number;
  dateIso: string;
  status: "taken" | "partial" | "pending" | "today";
  logDetails?: string[];
}

// ─── Predefined Drug List ─────────────────────────────────────────

export const COMMON_MEDICATIONS: string[] = [
  "Dolo 650",
  "Pan-D",
  "Bisoprolol",
  "Cetirizine",
  "Folitrax",
  "Ecosprin",
  "Combiflam",
  "Aspirin",
  "Metformin",
  "Lisinopril",
  "Warfarin",
  "Atorvastatin",
  "Amlodipine",
  "Omeprazole",
  "Metoprolol",
  "Losartan",
  "Gabapentin",
  "Hydrochlorothiazide",
  "Sertraline",
  "Simvastatin",
  "Levothyroxine",
  "Acetaminophen",
  "Ibuprofen",
  "Amoxicillin",
  "Prednisone",
  "Albuterol",
  "Pantoprazole",
  "Concor",
  "Telma 40",
  "Glycomet 500",
  "Augmentin 625",
  "Meftal Spas",
  "Shelcal 500",
  "Calpol 650",
  "Crocin",
];

// ─── Display Helpers ────────────────────────────────────────────────

export const FREQUENCY_LABELS: Record<Frequency, string> = {
  daily: "Daily",
  weekly: "Weekly",
  "as-needed": "As Needed",
};

export const DOSING_PATTERN_LABELS: Record<DosingPattern, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  night: "Night",
  "with-breakfast": "With Breakfast",
  "with-lunch": "With Lunch",
  "with-dinner": "With Dinner",
  "before-meals": "Before Meals",
  "after-meals": "After Meals",
};

// ─── Reminder / Adherence Types ─────────────────────────────────────

/** An active dose alert awaiting user action (confirm / skip) */
export interface DoseAlert {
  id: string;
  medicationId: string;
  medicationName: string;
  dose: string;
  scheduledTime: string; // "HH:MM" 24h
  firedAt: string; // ISO timestamp
}

export type DoseStatus = "taken" | "skipped" | "pending";

/** A single adherence log entry */
export interface AdherenceRecord {
  id: string;
  medicationId: string;
  medicationName: string;
  date: string; // YYYY-MM-DD
  time: string; // "HH:MM"
  status: DoseStatus;
  respondedAt: string; // ISO timestamp
}

// ─── Interaction Types ──────────────────────────────────────────────

export type InteractionSeverity = "high" | "moderate";

export interface DrugInteraction {
  id: string;
  drugs: [string, string];
  severity: InteractionSeverity;
  title: string;
  description: string;
  actionRequired: string;
}

export interface DetectedInteraction {
  id: string;
  rule: DrugInteraction;
  medicationA: Medication;
  medicationB: Medication;
}

// ─── Shared Helpers ─────────────────────────────────────────────────

/** Convert 24h "HH:MM" to "8:00 AM" or "11:01 AM" style */
export function formatTime12h(time: string): string {
  if (!time) return "8:00 AM";
  const parts = time.split(":");
  const h = parseInt(parts[0] || "0", 10);
  const m = parseInt(parts[1] || "0", 10);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, "0")} ${suffix}`;
}

/** Clean slot label for badges: Morning, Afternoon, Evening, Night */
export function getTimeSlotBadgeLabel(time: string, condition?: string): string {
  if (condition) {
    if (condition.includes("Breakfast") || condition.startsWith("Morning")) return "Morning";
    if (condition.includes("Lunch") || condition.startsWith("Afternoon")) return "Afternoon";
    if (condition.includes("Snacks") || condition.startsWith("Evening")) return "Evening";
    if (condition.includes("Bedtime") || condition.startsWith("Night")) return "Night";
  }
  const h = parseInt(time.split(":")[0] || "0", 10);
  if (h >= 5 && h < 12) return "Morning";
  if (h >= 12 && h < 17) return "Afternoon";
  if (h >= 17 && h < 21) return "Evening";
  return "Night";
}
