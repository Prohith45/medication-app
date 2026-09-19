/**
 * Calendar utilities for the Dynamic 28-Day Adherence Matrix.
 * Calculates dates using the system clock (new Date()) while
 * preserving past days' visual records in localStorage.
 */

export type AdherenceDayStatus = "taken" | "partial" | "pending";

export interface CalendarDayEntry {
  dayNumber: number; // Day of the month (1-31)
  index: number; // 27 down to 0
  dateKey: string; // YYYY-MM-DD
  status: AdherenceDayStatus;
  isToday: boolean;
  dayOfWeek: number; // 0=Sun..6=Sat
  logDetails: string[];
}

export type CalendarHistoryMap = Record<
  string,
  {
    status: AdherenceDayStatus;
    logDetails?: string[];
  }
>;

export const CALENDAR_HISTORY_KEY = "medassist_calendar_history";

/**
 * Reads calendar history from localStorage or seeds it once
 * with a realistic pattern (25 days taken, 2 days partial)
 * so past days never reset or get cleared.
 */
export function getOrSeedCalendarHistory(): CalendarHistoryMap {
  if (typeof window === "undefined") return {};

  try {
    const raw = localStorage.getItem(CALENDAR_HISTORY_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && Object.keys(parsed).length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Failed reading calendar history from localStorage", e);
  }

  // Seed the past 27 days + today
  const seed: CalendarHistoryMap = {};
  const today = new Date();

  for (let i = 27; i >= 1; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateKey = d.toISOString().split("T")[0];

    // Day index 4 and 17 are seeded as partial (2 days partial, 25 taken)
    const isPartial = i === 4 || i === 17;
    if (isPartial) {
      seed[dateKey] = {
        status: "partial",
        logDetails: [
          "Dolo 650 (650 mg) - Taken at 8:00 AM",
          "Metformin (500 mg) - Skipped (Stomach upset)",
          "Atorvastatin (20 mg) - Taken at 9:00 PM",
        ],
      };
    } else {
      seed[dateKey] = {
        status: "taken",
        logDetails: [
          "Dolo 650 (650 mg) - Taken at 8:05 AM",
          "Metformin (500 mg) - Taken at 1:15 PM",
          "Atorvastatin (20 mg) - Taken at 8:30 PM",
        ],
      };
    }
  }

  // Today (i = 0) initially pending
  const todayKey = today.toISOString().split("T")[0];
  seed[todayKey] = {
    status: "pending",
    logDetails: ["Scheduled doses for today"],
  };

  try {
    localStorage.setItem(CALENDAR_HISTORY_KEY, JSON.stringify(seed));
  } catch (e) {
    console.warn("Failed saving calendar seed to localStorage", e);
  }

  return seed;
}

/**
 * Updates today's entry in localStorage under medassist_calendar_history
 */
export function updateTodayCalendarHistory(
  status: AdherenceDayStatus,
  logDetails: string[]
): CalendarHistoryMap {
  if (typeof window === "undefined") return {};

  try {
    const history = getOrSeedCalendarHistory();
    const todayKey = new Date().toISOString().split("T")[0];
    history[todayKey] = { status, logDetails };
    localStorage.setItem(CALENDAR_HISTORY_KEY, JSON.stringify(history));
    return history;
  } catch (e) {
    console.warn("Failed updating today's calendar history", e);
    return {};
  }
}

/**
 * Generates an array of exactly 28 days ending on TODAY (new Date()).
 * Each index i goes from 27 down to 0:
 *   const d = new Date();
 *   d.setDate(d.getDate() - i);
 *   const dateKey = d.toISOString().split('T')[0];
 *   const dayNumber = d.getDate();
 *   const isToday = i === 0;
 */
export function generate28DaysCalendar(
  history: CalendarHistoryMap,
  todayStatus: AdherenceDayStatus,
  todayLogs: string[]
): CalendarDayEntry[] {
  const days: CalendarDayEntry[] = [];
  const today = new Date();

  for (let i = 27; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateKey = d.toISOString().split("T")[0];
    const dayNumber = d.getDate();
    const isToday = i === 0;
    const dayOfWeek = d.getDay();

    if (isToday) {
      days.push({
        dayNumber,
        index: i,
        dateKey,
        status: todayStatus,
        isToday: true,
        dayOfWeek,
        logDetails:
          todayLogs && todayLogs.length > 0
            ? todayLogs
            : ["Scheduled doses for today"],
      });
    } else {
      const pastRecord = history[dateKey];
      // Fallback pattern if past date was not explicitly seeded
      const fallbackStatus: AdherenceDayStatus =
        i === 4 || i === 17 ? "partial" : "taken";
      const status = pastRecord ? pastRecord.status : fallbackStatus;
      const logDetails = pastRecord?.logDetails || [
        "Dolo 650 (650 mg) - Taken at 8:05 AM",
        "Metformin (500 mg) - Taken at 1:15 PM",
      ];

      days.push({
        dayNumber,
        index: i,
        dateKey,
        status,
        isToday: false,
        dayOfWeek,
        logDetails,
      });
    }
  }

  return days;
}
