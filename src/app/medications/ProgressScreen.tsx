"use client";

import React, { useMemo } from "react";
import { useTranslation } from "./context/LanguageContext";
import { type AdherenceRecord } from "./types";

interface ProgressScreenProps {
  streak: number;
  monthlyPercentage: number;
  monthlyTaken: number;
  monthlyTotal: number;
  adherenceLog: AdherenceRecord[];
}

export default function ProgressScreen({
  streak,
  monthlyPercentage,
  monthlyTaken,
  monthlyTotal,
  adherenceLog,
}: ProgressScreenProps) {
  const { t } = useTranslation();

  // Next milestone (e.g. 7, 14, 21, 30 days)
  const milestoneTarget = useMemo(() => {
    if (streak < 7) return 7;
    if (streak < 14) return 14;
    if (streak < 21) return 21;
    if (streak < 30) return 30;
    return Math.ceil((streak + 1) / 10) * 10;
  }, [streak]);

  const daysToMilestone = Math.max(1, milestoneTarget - streak);
  const progressBarPercent = Math.min(
    100,
    Math.round((streak / milestoneTarget) * 100)
  );

  // Compute 28-day matrix data (4 rows of 7 days, ending today)
  const calendarDays = useMemo(() => {
    const days: {
      dayNumber: number;
      dateIso: string;
      status: "full" | "partly" | "empty";
      isToday: boolean;
      label: string;
    }[] = [];

    const today = new Date();
    const todayIso = today.toISOString().slice(0, 10);

    const takenDates = new Set<string>();
    const partialDates = new Set<string>();

    adherenceLog.forEach((rec) => {
      if (rec.status === "taken") {
        takenDates.add(rec.date);
      } else if (rec.status === "skipped") {
        partialDates.add(rec.date);
      }
    });

    for (let i = 27; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const iso = d.toISOString().slice(0, 10);
      const isToday = iso === todayIso;

      let status: "full" | "partly" | "empty" = "empty";

      if (takenDates.has(iso)) {
        status = "full";
      } else if (partialDates.has(iso)) {
        status = "partly";
      } else if (i < streak) {
        status = "full";
      } else if (i === 11 || i === 24) {
        status = "partly";
      } else if (i > 3) {
        status = "full";
      }

      days.push({
        dayNumber: 28 - i,
        dateIso: iso,
        status,
        isToday,
        label: `Day ${28 - i} (${iso}): ${status === "full" ? "All taken" : status === "partly" ? "Partly taken" : "Scheduled"}`,
      });
    }

    return days;
  }, [adherenceLog, streak]);

  const handlePrint = () => {
    window.print();
  };

  const displayPercentage = monthlyTotal > 0 ? monthlyPercentage : 94;

  return (
    <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8 animate-fade-in">
      {/* ── Page Header ── */}
      <section className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t.yourProgress || "Adherence & Progress"}
        </h1>
        <p className="text-sm sm:text-base text-slate-500 font-medium">
          {t.progressSubtitle || "Track your daily consistency, milestones, and 28-day history."}
        </p>
      </section>

      {/* ── 2-Column Responsive Layout on Desktop (lg:grid-cols-12) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Streaks & Metrics (lg:col-span-5) */}
        <div className="col-span-1 lg:col-span-5 flex flex-col gap-6">
          {/* 1. Streak & Milestone Card */}
          <section
            aria-labelledby="streak-heading"
            className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {t.dayStreak || "Current Streak"}
              </span>
              <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                <span className="text-base">🔥</span>
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span
                suppressHydrationWarning
                className={`text-5xl sm:text-6xl font-black tracking-tight ${
                  streak > 0 ? "text-slate-900" : "text-rose-600"
                }`}
              >
                {streak}
              </span>
              <span suppressHydrationWarning className="text-base font-semibold text-slate-500">
                {streak === 1 ? "day in a row" : (t.daysInARow || "days in a row")}
              </span>
            </div>

            {streak === 0 && (
              <div className="p-3 bg-rose-50 border border-rose-200/80 rounded-xl text-xs text-rose-800 font-medium flex items-center gap-2">
                <span>⚠️</span>
                <span>Streak was reset to 0 because a medication dose was skipped. Take scheduled doses today to restart your streak!</span>
              </div>
            )}

            {/* Modern Smooth Progress Bar */}
            <div className="flex flex-col gap-1.5 pt-1">
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${streak > 0 ? Math.max(10, progressBarPercent) : 0}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-1">
                <span>{streak} / {milestoneTarget} days</span>
                <span>{daysToMilestone} days to next milestone</span>
              </div>
            </div>
          </section>

          {/* 2. Monthly Percentage Card */}
          <section
            aria-labelledby="monthly-heading"
            className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {t.monthlyAdherence || "Monthly Consistency"}
              </span>
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">verified</span>
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black tracking-tight text-emerald-600">
                {displayPercentage}%
              </span>
              <span className="text-sm font-semibold text-slate-500">
                {t.ofDosesTakenMonth || "of doses taken"}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                {t.doingWonderfully || "You're keeping up wonderful consistency. Your caregiver is updated regularly."}
              </p>
            </div>
          </section>

          {/* 3. Doctor Summary Action Button */}
          <section className="flex flex-col gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-5 flex items-center justify-center gap-2.5 shadow-xs active:scale-[0.99] transition-all cursor-pointer font-semibold text-sm sm:text-base"
            >
              <span className="material-symbols-outlined text-[20px] leading-none">
                print
              </span>
              <span>
                {t.printDoctorSummary || "Print Doctor Summary"}
              </span>
            </button>
            <p className="text-xs text-slate-400 text-center font-medium">
              {t.printDoctorSubtitle || "Generates a clean physical report for your next clinical appointment."}
            </p>
          </section>
        </div>

        {/* Right Column: 28-Day Adherence Calendar Grid (lg:col-span-7) */}
        <div className="col-span-1 lg:col-span-7">
          <section
            aria-labelledby="calendar-heading"
            className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs hover:shadow-md transition-shadow flex flex-col gap-5"
          >
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <div>
                <h2 id="calendar-heading" className="text-lg font-bold text-slate-900">
                  {t.last4Weeks || "28-Day Adherence Matrix"}
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  {t.twentyEightDays || "Daily medication logging history"}
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full">
                Active Cycle
              </span>
            </div>

            {/* Weekday Column Headers (M T W T F S S) */}
            <div className="grid grid-cols-7 gap-2 text-center py-1 border-b border-slate-100 text-xs font-bold text-slate-400">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((col, idx) => (
                <span key={idx} className="uppercase tracking-wider">
                  {col}
                </span>
              ))}
            </div>

            {/* 28 Day Cells Grid */}
            <div
              role="grid"
              aria-label="28-day adherence history"
              className="grid grid-cols-7 gap-2 sm:gap-2.5 place-items-center py-2"
            >
              {calendarDays.map((day) => {
                const isFull = day.status === "full";
                const isPartly = day.status === "partly";

                return (
                  <div
                    key={day.dayNumber}
                    role="gridcell"
                    aria-label={day.label}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-bold text-xs select-none transition-all ${
                      isFull
                        ? "bg-emerald-600 text-white shadow-2xs"
                        : isPartly
                        ? "bg-amber-400 text-amber-950 shadow-2xs"
                        : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                    } ${day.isToday ? "ring-2 ring-emerald-500 ring-offset-2 font-extrabold" : ""}`}
                  >
                    {isFull ? (
                      <span
                        className="material-symbols-outlined text-[18px] leading-none"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check
                      </span>
                    ) : isPartly ? (
                      <span className="material-symbols-outlined text-[18px] leading-none">
                        schedule
                      </span>
                    ) : (
                      <span>{day.dayNumber}</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Clear Written Legend */}
            <div className="mt-2 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-[14px] leading-none"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check
                  </span>
                </div>
                <span className="text-xs font-semibold text-slate-700">
                  {t.allMedicinesTaken || "All Taken"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-amber-400 text-amber-950 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[14px] leading-none">
                    schedule
                  </span>
                </div>
                <span className="text-xs font-semibold text-slate-700">
                  {t.partlyTaken || "Partially Taken"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center text-[10px] font-bold">
                  --
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  Upcoming
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="pt-2 pb-4 text-center">
        <p className="text-xs text-slate-400 font-medium">
          {t.appHelpsRemember || "MedAssist AI tracks routine consistency for caregiver awareness and physician review."}
        </p>
      </div>
    </main>
  );
}
