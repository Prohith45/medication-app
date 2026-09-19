"use client";

import { useMemo } from "react";
import { type AdherenceRecord } from "./types";

// ─── Date Helpers ───────────────────────────────────────────────────

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Get YYYY-MM-DD for a date offset by N days from today */
function dateOffset(daysFromToday: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  return d.toISOString().slice(0, 10);
}

/** Get short weekday label */
function weekdayLabel(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short" });
}

/** Get day number */
function dayNumber(dateStr: string): number {
  return new Date(dateStr + "T00:00:00").getDate();
}

// ─── Types ──────────────────────────────────────────────────────────

export type DayStatus = "all-taken" | "partial" | "missed" | "none" | "future";

export interface DayEntry {
  date: string;
  label: string; // "Mon", "Tue", etc.
  day: number; // 1–31
  status: DayStatus;
  takenCount: number;
  totalCount: number;
  isToday: boolean;
}

export interface ComplianceStats {
  /** Consecutive days where ALL scheduled doses were taken */
  currentStreak: number;
  /** Doses taken this month */
  monthlyTaken: number;
  /** Total doses logged (taken + skipped) this month */
  monthlyTotal: number;
  /** 0–100 percentage */
  monthlyPercentage: number;
  /** 7-day visual strip entries (Mon→Sun of current week) */
  weekStrip: DayEntry[];
}

// ─── Core Computation ───────────────────────────────────────────────

export function useAdherence(log: AdherenceRecord[]): ComplianceStats {
  return useMemo(() => {
    const today = todayStr();
    const currentMonth = today.slice(0, 7); // "YYYY-MM"

    // ── Group logs by date ──────────────────────────────────────
    const byDate = new Map<string, AdherenceRecord[]>();
    for (const rec of log) {
      const existing = byDate.get(rec.date) ?? [];
      existing.push(rec);
      byDate.set(rec.date, existing);
    }

    // ── Current streak ──────────────────────────────────────────
    // Walk backwards from today; each day must have at least 1 log
    // and ALL logs for that day must be "taken"
    let currentStreak = 0;
    for (let i = 0; i < 365; i++) {
      const dateStr = dateOffset(-i);
      const dayLogs = byDate.get(dateStr);
      if (!dayLogs || dayLogs.length === 0) {
        // No logs for this day — if it's today, skip (day not over yet)
        if (i === 0) continue;
        break;
      }
      const allTaken = dayLogs.every((r) => r.status === "taken");
      if (allTaken) {
        currentStreak++;
      } else {
        // If today and partially done, don't break streak yet
        if (i === 0) continue;
        break;
      }
    }

    // ── Monthly compliance ──────────────────────────────────────
    const monthLogs = log.filter(
      (r) => r.date.startsWith(currentMonth) && r.status !== "pending"
    );
    const monthlyTaken = monthLogs.filter((r) => r.status === "taken").length;
    const monthlyTotal = monthLogs.length;
    const monthlyPercentage =
      monthlyTotal > 0 ? Math.round((monthlyTaken / monthlyTotal) * 100) : 0;

    // ── 7-day strip (current week Mon→Sun) ──────────────────────
    // Find the Monday of the current week
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon … 6=Sat
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const weekStrip: DayEntry[] = [];
    for (let i = 0; i < 7; i++) {
      const offset = mondayOffset + i;
      const dateStr = dateOffset(offset);
      const dayLogs = byDate.get(dateStr) ?? [];
      const nonPending = dayLogs.filter((r) => r.status !== "pending");
      const takenCount = nonPending.filter((r) => r.status === "taken").length;
      const totalCount = nonPending.length;

      let status: DayStatus;
      if (dateStr > today) {
        status = "future";
      } else if (totalCount === 0) {
        status = "none";
      } else if (takenCount === totalCount) {
        status = "all-taken";
      } else if (takenCount > 0) {
        status = "partial";
      } else {
        status = "missed";
      }

      weekStrip.push({
        date: dateStr,
        label: weekdayLabel(dateStr),
        day: dayNumber(dateStr),
        status,
        takenCount,
        totalCount,
        isToday: dateStr === today,
      });
    }

    return {
      currentStreak,
      monthlyTaken,
      monthlyTotal,
      monthlyPercentage,
      weekStrip,
    };
  }, [log]);
}
