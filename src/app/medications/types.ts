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
  durationDays?: number | "ongoing"; // e.g., 5, 7, 14, or "ongoing"
  startDate?: string;                // "YYYY-MM-DD"
  endDate?: string;                 // calculated "YYYY-MM-DD" for fixed courses
}

export type MedicationFormData = Omit<Medication, "id" | "createdAt">;

export function calculateEndDate(
  startDate: string,
  durationDays: number | "ongoing"
): string | undefined {
  if (durationDays === "ongoing") return undefined;
  if (!startDate || typeof durationDays !== "number" || durationDays <= 0) return undefined;
  const d = new Date(startDate + "T00:00:00");
  d.setDate(d.getDate() + durationDays - 1);
  return d.toISOString().split("T")[0];
}

export interface CourseProgress {
  isOngoing: boolean;
  isCompleted: boolean;
  isActive: boolean;
  isFuture: boolean;
  currentDay: number;
  totalDays: number;
  remainingDays: number;
  label: string;
  badgeText: string;
}

export function getCourseProgress(med: {
  startDate?: string;
  endDate?: string;
  durationDays?: number | "ongoing";
}): CourseProgress {
  const duration = med.durationDays ?? "ongoing";
  if (duration === "ongoing") {
    return {
      isOngoing: true,
      isCompleted: false,
      isActive: true,
      isFuture: false,
      currentDay: 1,
      totalDays: 0,
      remainingDays: 0,
      label: "Ongoing (Chronic Maintenance)",
      badgeText: "Ongoing",
    };
  }

  const today = new Date().toISOString().split("T")[0];
  const start = med.startDate || today;
  const total = typeof duration === "number" ? duration : parseInt(String(duration), 10) || 7;
  const end = med.endDate || calculateEndDate(start, total) || today;

  const startDateObj = new Date(start + "T00:00:00");
  const todayDateObj = new Date(today + "T00:00:00");

  const diffMs = todayDateObj.getTime() - startDateObj.getTime();
  const dayIndex = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1; // 1-indexed

  if (dayIndex < 1) {
    const daysUntilStart = 1 - dayIndex;
    return {
      isOngoing: false,
      isCompleted: false,
      isActive: false,
      isFuture: true,
      currentDay: 0,
      totalDays: total,
      remainingDays: total,
      label: `Starts in ${daysUntilStart} ${daysUntilStart === 1 ? "day" : "days"} (${start})`,
      badgeText: `Starts in ${daysUntilStart}d`,
    };
  }

  if (dayIndex > total) {
    return {
      isOngoing: false,
      isCompleted: true,
      isActive: false,
      isFuture: false,
      currentDay: total,
      totalDays: total,
      remainingDays: 0,
      label: `Course completed (${total} days)`,
      badgeText: "Completed",
    };
  }

  const remaining = total - dayIndex;
  return {
    isOngoing: false,
    isCompleted: false,
    isActive: true,
    isFuture: false,
    currentDay: dayIndex,
    totalDays: total,
    remainingDays: remaining,
    label: `Day ${dayIndex} of ${total} (${remaining} ${remaining === 1 ? "day" : "days"} left)`,
    badgeText: `Day ${dayIndex} of ${total}`,
  };
}

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
