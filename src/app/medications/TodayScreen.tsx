"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useTranslation } from "./context/LanguageContext";
import {
  type Medication,
  type DoseAlert,
  type AdherenceRecord,
  type DetectedInteraction,
  formatTime12h,
  getTimeSlotBadgeLabel,
} from "./types";
import { type UserProfile } from "./types/profile";
import DayLogModal, { type DayLogModalItem } from "./DayLogModal";
import SpeakerButton from "./SpeakerButton";
import {
  getOrSeedCalendarHistory,
  updateTodayCalendarHistory,
  generate28DaysCalendar,
  type CalendarDayEntry,
  type CalendarHistoryMap,
  type AdherenceDayStatus,
} from "./utils/calendar";

interface TodayScreenProps {
  medications: Medication[];
  adherenceLog: AdherenceRecord[];
  activeAlerts: DoseAlert[];
  streak: number;
  monthlyPercentage: number;
  monthlyTaken: number;
  monthlyTotal: number;
  userProfile: UserProfile;
  seniorMode?: boolean;
  missedDoseCount: number;
  autoAlertSent: boolean;
  detectedInteractions?: DetectedInteraction[];
  onTakeDose: (med: Medication, scheduledTime: string, alertId?: string) => void;
  onSkipDose: (med: Medication, scheduledTime: string, alertId?: string) => void;
  onOpenAddMedicine?: () => void;
  onTestAlarm?: () => void;
  onTriggerEmergency?: () => void;
  onOpenDrugInfo?: (drugName: string) => void;
}

export default function TodayScreen({
  medications,
  adherenceLog,
  activeAlerts,
  streak,
  monthlyPercentage,
  monthlyTaken,
  monthlyTotal,
  userProfile,
  seniorMode = false,
  missedDoseCount,
  autoAlertSent,
  detectedInteractions = [],
  onTakeDose,
  onSkipDose,
  onOpenAddMedicine,
  onTestAlarm,
  onTriggerEmergency,
  onOpenDrugInfo,
}: TodayScreenProps) {
  const { t, language } = useTranslation();

  // Selected Day for DayLogModal
  const [selectedDayLog, setSelectedDayLog] = useState<DayLogModalItem | null>(null);

  const todayIso = useMemo(() => new Date().toISOString().slice(0, 10), []);

  // Dynamic greeting based on current local hour
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return t.goodMorning || "Good morning";
    if (hour >= 12 && hour < 17) return t.goodAfternoon || "Good afternoon";
    return t.goodEvening || "Good evening";
  }, [t]);

  // Today formatted string (e.g., "Saturday, Sep 19")
  const todayFormatted = useMemo(() => {
    const now = new Date();
    return new Intl.DateTimeFormat(language === "te" ? "te-IN" : "en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    }).format(now);
  }, [language]);

  // Map of adherence log for today (newest records take precedence)
  const todayRecordsMap = useMemo(() => {
    const map = new Map<string, AdherenceRecord>();
    const todayLogs = adherenceLog.filter((rec) => rec.date === todayIso);
    for (let i = todayLogs.length - 1; i >= 0; i--) {
      const rec = todayLogs[i];
      map.set(`${rec.medicationId}_${rec.time}`, rec);
      map.set(rec.medicationId, rec);
    }
    return map;
  }, [adherenceLog, todayIso]);

  // Build daily dose entries from medications
  const allDoseEntries = useMemo(() => {
    const entries: {
      med: Medication;
      time: string;
      formattedTime: string;
      timeSlotBadge: string;
      status: "taken" | "skipped" | "upcoming";
      matchingRecord?: AdherenceRecord;
      matchingAlert?: DoseAlert;
    }[] = [];

    medications.forEach((med) => {
      const times = med.times && med.times.length > 0 ? med.times : ["08:00"];
      times.forEach((time) => {
        const record = todayRecordsMap.get(`${med.id}_${time}`) || todayRecordsMap.get(med.id);
        const alert = activeAlerts.find(
          (a) => a.medicationId === med.id && a.scheduledTime === time
        );

        let status: "taken" | "skipped" | "upcoming" = "upcoming";
        if (record) {
          status = record.status === "taken" ? "taken" : "skipped";
        }

        const badgeLabel = getTimeSlotBadgeLabel(time, med.timingCondition);

        entries.push({
          med,
          time,
          formattedTime: formatTime12h(time),
          timeSlotBadge: `${formatTime12h(time)} • ${badgeLabel}`,
          status,
          matchingRecord: record,
          matchingAlert: alert,
        });
      });
    });

    return entries.sort((a, b) => a.time.localeCompare(b.time));
  }, [medications, todayRecordsMap, activeAlerts]);

  // Determine "Due Now" item: First upcoming dose (preferring active alerts)
  const dueNowItem = useMemo(() => {
    const upcoming = allDoseEntries.filter((e) => e.status === "upcoming");
    const withAlert = upcoming.find((e) => !!e.matchingAlert);
    return withAlert || upcoming[0] || null;
  }, [allDoseEntries]);

  // Remaining doses
  const remainingDoseEntries = useMemo(() => {
    if (!dueNowItem) return allDoseEntries;
    return allDoseEntries.filter(
      (e) => !(e.med.id === dueNowItem.med.id && e.time === dueNowItem.time)
    );
  }, [allDoseEntries, dueNowItem]);

  // Real-Time Status Calculation for Day 28 (Today)
  const todayStatus = useMemo<AdherenceDayStatus>(() => {
    if (allDoseEntries.length === 0) return "pending";
    if (allDoseEntries.every((e) => e.status === "taken")) return "taken";
    if (allDoseEntries.some((e) => e.status === "skipped")) return "partial";
    return "pending";
  }, [allDoseEntries]);

  const todayLogs = useMemo<string[]>(() => {
    if (allDoseEntries.length === 0) return ["No medications scheduled for today"];
    return allDoseEntries.map((e) => {
      if (e.status === "taken") {
        return `${e.med.name} (${e.med.dose}) - Taken at ${e.formattedTime}`;
      }
      if (e.status === "skipped") {
        return `${e.med.name} (${e.med.dose}) - Skipped`;
      }
      return `${e.med.name} (${e.med.dose}) - Due at ${e.formattedTime}`;
    });
  }, [allDoseEntries]);

  // Persistent Calendar History Map (localStorage)
  const [calendarHistory, setCalendarHistory] = useState<CalendarHistoryMap>({});

  useEffect(() => {
    setCalendarHistory(getOrSeedCalendarHistory());
  }, []);

  useEffect(() => {
    const todayKey = new Date().toISOString().split("T")[0];

    // Avoid updates if today's status in history is already identical
    setCalendarHistory((prevHistory) => {
      const currentEntry = prevHistory?.[todayKey];
      if (
        currentEntry?.status === todayStatus &&
        JSON.stringify(currentEntry?.logDetails) === JSON.stringify(todayLogs)
      ) {
        return prevHistory; // No reference change, avoids re-render
      }

      const updated = updateTodayCalendarHistory(todayStatus, todayLogs);
      return updated && Object.keys(updated).length > 0 ? updated : prevHistory;
    });
  }, [todayStatus, JSON.stringify(todayLogs)]);

  // Generate 28 Days ending on TODAY
  const matrixDays = useMemo<CalendarDayEntry[]>(() => {
    return generate28DaysCalendar(calendarHistory, todayStatus, todayLogs);
  }, [calendarHistory, todayStatus, todayLogs]);

  const streakMilestone = 14;
  const daysToMilestone = Math.max(1, streakMilestone - streak);

  return (
    <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* ── Auto-Alert Banner when 2+ Doses Skipped ── */}
      {autoAlertSent && (
        <div
          role="alert"
          className="w-full mb-6 bg-rose-50 border border-rose-200 text-rose-900 p-4 sm:p-5 rounded-2xl shadow-xs flex items-start sm:items-center justify-between gap-4 animate-fade-in"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[28px] text-rose-600 shrink-0">
              notification_important
            </span>
            <div>
              <p className="text-base sm:text-lg font-bold leading-tight">
                {language === "te"
                  ? "🚨 సంరక్షకులకు టెలిగ్రామ్ ద్వారా సమాచారం పంపబడింది"
                  : "🚨 Guardian notified via Telegram"}
              </p>
              <p className="text-sm font-medium text-rose-700 mt-0.5">
                {language === "te"
                  ? "మీరు 2+ మోతాదులు వదిలేశారు. కుటుంబ సభ్యుల సంరక్షణ కోసం ఆటో-అలర్ట్ జారీ చేయబడింది."
                  : `Multiple missed doses detected (${missedDoseCount} skipped). Alert dispatched to ${userProfile.guardianName} (${userProfile.guardianRelation}).`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Responsive 2-Column Dashboard Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ══════════════════════════════════════════════════════════════════
            LEFT COLUMN (7 cols): Today's Schedule & Due Medication
           ══════════════════════════════════════════════════════════════════ */}
        <section className="col-span-1 lg:col-span-7 flex flex-col gap-6">
          {/* Greeting Banner */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1
                  className={`font-extrabold text-slate-900 tracking-tight leading-tight ${
                    seniorMode ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl"
                  }`}
                >
                  {greeting}, {userProfile.patientName || "Rohith"} 👋
                </h1>
                <p suppressHydrationWarning className="text-sm sm:text-base font-medium text-slate-500 mt-1">
                  {todayFormatted}
                </p>
              </div>

              {onOpenAddMedicine && (
                <button
                  type="button"
                  onClick={onOpenAddMedicine}
                  className="sm:hidden px-3.5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs active:scale-95"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  <span>Add</span>
                </button>
              )}
            </div>

            {/* Subtle Medical Disclaimer Note */}
            <div className="bg-slate-100/80 border border-slate-200/70 rounded-xl px-3.5 py-2 flex items-center gap-2 text-xs sm:text-sm text-slate-600">
              <span className="text-slate-400">ℹ️</span>
              <span>Routine support tool. Always consult your doctor before adjusting doses.</span>
            </div>
          </div>

          {/* ── High-Priority Due Card ── */}
          {dueNowItem ? (
            <article
              aria-label="High Priority Due Medication"
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-7 relative overflow-hidden border-l-4 border-l-amber-500 flex flex-col gap-5 hover:shadow-md transition-shadow"
            >
              {/* Badge & Explainer Link */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200/80 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                  <span className="material-symbols-outlined text-[16px] text-amber-600">
                    schedule
                  </span>
                  <span>{t.dueNow || "Due Now"} • {dueNowItem.timeSlotBadge}</span>
                </span>

                {onOpenDrugInfo && (
                  <button
                    type="button"
                    onClick={() => onOpenDrugInfo(dueNowItem.med.name)}
                    className="text-xs sm:text-sm font-semibold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">info</span>
                    <span>Explain Medicine</span>
                  </button>
                )}
              </div>

              {/* Drug Name, Dosage & Audio Reader */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h2
                    className={`font-bold text-slate-900 tracking-tight leading-tight ${
                      seniorMode ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl"
                    }`}
                  >
                    {dueNowItem.med.name}
                  </h2>
                  <p className="text-sm sm:text-base text-slate-600 font-medium">
                    {dueNowItem.med.dose} ·{" "}
                    {dueNowItem.med.timingCondition ||
                      (dueNowItem.med.dosingPattern === "with-breakfast"
                        ? t.takeWithBreakfast
                        : dueNowItem.med.dosingPattern === "with-lunch"
                        ? t.takeWithLunch
                        : dueNowItem.med.dosingPattern === "with-dinner"
                        ? t.takeWithDinner
                        : dueNowItem.med.dosingPattern === "night"
                        ? t.takeAtNight
                        : dueNowItem.med.dosingPattern === "evening"
                        ? t.takeInEvening
                        : t.takeInMorning)}
                  </p>
                </div>

                <SpeakerButton
                  name={dueNowItem.med.name}
                  dose={dueNowItem.med.dose}
                  timingCondition={dueNowItem.med.timingCondition}
                  size="lg"
                />
              </div>

              {/* Action Buttons: Yes I took it & Not Yet / Skip */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                {/* "Yes, I took it" Button */}
                <button
                  type="button"
                  onClick={() =>
                    onTakeDose(
                      dueNowItem.med,
                      dueNowItem.time,
                      dueNowItem.matchingAlert?.id
                    )
                  }
                  className="flex-1 min-h-[54px] sm:min-h-[58px] flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl px-6 shadow-xs active:scale-[0.99] transition-all cursor-pointer select-none text-base sm:text-lg"
                >
                  <span
                    className="material-symbols-outlined text-[24px] leading-none"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                  <span>{t.yesTookIt || "✓ Yes, I took it"}</span>
                </button>

                {/* "Not Yet / Skip" Button */}
                <button
                  type="button"
                  onClick={() =>
                    onSkipDose(
                      dueNowItem.med,
                      dueNowItem.time,
                      dueNowItem.matchingAlert?.id
                    )
                  }
                  className="sm:w-44 min-h-[54px] sm:min-h-[58px] flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl px-5 transition-all active:scale-[0.99] cursor-pointer select-none text-base sm:text-lg"
                >
                  <span className="material-symbols-outlined text-[22px] text-slate-500 leading-none">
                    close
                  </span>
                  <span>{t.notYet || "Not yet / Skip"}</span>
                </button>
              </div>
            </article>
          ) : (
            /* All Medicines Confirmed Card */
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-6 sm:p-7 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <span
                  className="material-symbols-outlined text-[28px] leading-none"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check
                </span>
              </div>
              <div className="flex flex-col">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {t.allMedicinesTaken || "All medicines completed for now!"}
                </h2>
                <p className="text-sm sm:text-base text-slate-600 font-medium">
                  {t.doingWonderfully || "You're all set. Keep up the healthy routine!"}
                </p>
              </div>
            </div>
          )}

          {/* Section: Later today & completed */}
          {remainingDoseEntries.length > 0 && (
            <div className="pt-2 flex flex-col gap-3">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {t.laterTodayTaken || "Today's Schedule & Completed"}
              </h2>

              <div className="flex flex-col gap-3">
                {remainingDoseEntries.map((entry, idx) => {
                  const isTaken = entry.status === "taken";
                  const isSkipped = entry.status === "skipped";

                  if (isTaken) {
                    return (
                      <article
                        key={`taken_${entry.med.id}_${entry.time}_${idx}`}
                        className="bg-white/80 border border-slate-200/70 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-3 shadow-2xs hover:shadow-xs transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
                            <span
                              className="material-symbols-outlined text-[20px]"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              check
                            </span>
                          </div>
                          <div>
                            <p className="text-base sm:text-lg text-slate-500 line-through font-semibold">
                              {entry.med.name} · {entry.med.dose}
                            </p>
                            <p className="text-xs sm:text-sm text-slate-400 font-medium">
                              {entry.timeSlotBadge} • {t.taken || "Taken"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="hidden sm:inline-flex text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                            ✓ {t.taken || "Taken"}
                          </span>
                          <SpeakerButton
                            name={entry.med.name}
                            dose={entry.med.dose}
                            timingCondition={entry.med.timingCondition}
                            size="sm"
                          />
                        </div>
                      </article>
                    );
                  }

                  if (isSkipped) {
                    return (
                      <article
                        key={`skipped_${entry.med.id}_${entry.time}_${idx}`}
                        className="bg-amber-50/40 border border-amber-200/60 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-3 shadow-2xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-amber-100/70 text-amber-800 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-[20px]">
                              close
                            </span>
                          </div>
                          <div>
                            <p className="text-base sm:text-lg text-amber-900 line-through font-semibold">
                              {entry.med.name} · {entry.med.dose}
                            </p>
                            <p className="text-xs sm:text-sm text-amber-700/80 font-medium">
                              {entry.timeSlotBadge} • {t.skipped || "Skipped by patient"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onTakeDose(entry.med, entry.time)}
                            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs active:scale-95"
                            title="Take this dose now and resume streak"
                          >
                            <span className="material-symbols-outlined text-[15px]">check</span>
                            <span>Take now</span>
                          </button>
                          <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
                            {t.skipped || "Skipped"}
                          </span>
                          <SpeakerButton
                            name={entry.med.name}
                            dose={entry.med.dose}
                            timingCondition={entry.med.timingCondition}
                            size="sm"
                          />
                        </div>
                      </article>
                    );
                  }

                  // Upcoming Dose Entry
                  return (
                    <article
                      key={`upcoming_${entry.med.id}_${entry.time}_${idx}`}
                      className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                            ⏰ {entry.timeSlotBadge}
                          </span>
                          {onOpenDrugInfo && (
                            <button
                              type="button"
                              onClick={() => onOpenDrugInfo(entry.med.name)}
                              className="text-xs text-slate-500 hover:text-emerald-700 cursor-pointer"
                              title="View information"
                            >
                              ℹ️ Info
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                            {entry.med.name}
                          </h3>
                          <span className="text-sm font-semibold text-slate-500">
                            ({entry.med.dose})
                          </span>
                          <SpeakerButton
                            name={entry.med.name}
                            dose={entry.med.dose}
                            timingCondition={entry.med.timingCondition}
                            size="sm"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() =>
                            onTakeDose(entry.med, entry.time, entry.matchingAlert?.id)
                          }
                          className="px-4 py-2 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 rounded-xl text-sm font-bold shadow-2xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                        >
                          <span className="material-symbols-outlined text-[18px]">check</span>
                          <span>{t.iTookIt || "✓ Took this"}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            onSkipDose(entry.med, entry.time, entry.matchingAlert?.id)
                          }
                          className="px-3 py-2 text-slate-400 hover:text-slate-600 text-xs font-semibold cursor-pointer"
                        >
                          {t.skipDose || "Skip"}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            RIGHT COLUMN (5 cols): Overview, Streak, Guardian & Adherence
           ══════════════════════════════════════════════════════════════════ */}
        <aside className="col-span-1 lg:col-span-5 flex flex-col gap-6">
          {/* Interaction Warnings Callout Card (if conflicts exist) */}
          {detectedInteractions.length > 0 && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 text-rose-900 shadow-xs flex flex-col gap-2.5 animate-fade-in">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-rose-600 text-[22px]">
                  warning
                </span>
                <h3 className="text-base font-bold">
                  {language === "te" ? "మందుల పరస్పర చర్య హెచ్చరిక" : "Medication Interaction Alert"}
                </h3>
              </div>
              {detectedInteractions.slice(0, 2).map((inter) => (
                <div key={inter.id} className="text-sm leading-relaxed border-t border-rose-200/70 pt-2">
                  <p className="font-bold text-rose-950">
                    ⚠️ {inter.medicationA.name} + {inter.medicationB.name}
                  </p>
                  <p className="text-xs text-rose-800 mt-0.5">
                    {inter.rule.description}
                  </p>
                  <p className="text-xs font-semibold text-rose-900 mt-1">
                    Tip: {inter.rule.actionRequired}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Streak & Adherence Card */}
          <article className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-slate-900">
                {t.activeDaysStreak || "Adherence & Routine"}
              </span>
              <span
                suppressHydrationWarning
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  streak > 0
                    ? "bg-amber-50 text-amber-800 border border-amber-200"
                    : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}
              >
                <span>{streak > 0 ? "🔥" : "⚠️"}</span>
                <span suppressHydrationWarning>
                  {streak > 0
                    ? `${streak} ${streak === 1 ? "Day" : "Days"} Streak`
                    : "Streak Reset (0 Days)"}
                </span>
              </span>
            </div>

            {streak === 0 && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium flex items-center gap-2">
                <span>ℹ️</span>
                <span>Streak was reset to 0 because a dose was skipped. Taking your next scheduled dose will continue your streak!</span>
              </div>
            )}

            {/* Monthly Progress Bar */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                <span>{t.monthlyAdherence || "Monthly Adherence"}</span>
                <span className="text-emerald-700 font-bold">{monthlyPercentage}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${monthlyPercentage}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {monthlyTaken} of {monthlyTotal} doses logged on time this month. Keep it up!
              </p>
            </div>
          </article>

          {/* Guardian Safety Status Card */}
          <article className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {t.emergencyGuardianCard || "Guardian Safety"}
                </h3>
              </div>

              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Telegram Active</span>
              </span>
            </div>

            <div className="text-sm text-slate-600 leading-snug">
              <p className="font-semibold text-slate-800">
                Caregiver: {userProfile.guardianRelation || "Father"} ({userProfile.guardianName || "Family"})
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Automatically alerts caregiver if multiple consecutive doses are missed.
              </p>
            </div>

            {onTriggerEmergency && (
              <button
                type="button"
                onClick={onTriggerEmergency}
                className="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer active:scale-[0.99]"
              >
                <span className="material-symbols-outlined text-[18px]">emergency</span>
                <span>{language === "te" ? "అత్యవసర సంరక్షకుల అలర్ట్" : "Trigger Emergency Alert"}</span>
              </button>
            )}
          </article>

          {/* 28-Day Adherence Calendar Matrix */}
          <article className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                28-Day Adherence History
              </h3>
              <span className="text-xs font-semibold text-slate-400">
                Click day for log
              </span>
            </div>

            {/* Weekday letters */}
            <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-bold text-slate-400 mb-1">
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>T</span>
              <span>F</span>
              <span>S</span>
              <span>S</span>
            </div>

            {/* 4 rows of 7 day tiles */}
            <div className="grid grid-cols-7 gap-1.5">
              {matrixDays.map((day) => {
                const isTaken = day.status === "taken";
                const isPartial = day.status === "partial";

                let tileBg = "bg-slate-100 text-slate-500 hover:bg-slate-200";
                if (isTaken) {
                  tileBg = "bg-emerald-500 text-white hover:bg-emerald-600 shadow-2xs";
                } else if (isPartial) {
                  tileBg = "bg-amber-400 text-slate-900 hover:bg-amber-500";
                }

                return (
                  <button
                    key={day.dateKey}
                    type="button"
                    onClick={() =>
                      setSelectedDayLog({
                        dateKey: day.dateKey,
                        dayNumber: day.dayNumber,
                        status: day.status,
                        isToday: day.isToday,
                        logDetails: day.logDetails,
                      })
                    }
                    title={`${day.dateKey}: ${day.status}`}
                    className={`h-9 rounded-lg flex items-center justify-center text-xs font-bold transition-all cursor-pointer select-none ${tileBg} ${
                      day.isToday ? "ring-2 ring-emerald-600 ring-offset-2" : ""
                    }`}
                  >
                    {isTaken ? (
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    ) : isPartial ? (
                      <span className="material-symbols-outlined text-[15px]">schedule</span>
                    ) : (
                      <span>{day.dayNumber}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between text-xs font-medium text-slate-500 pt-2 border-t border-slate-100">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                <span>Taken</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
                <span>Partial / Skip</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-200 inline-block"></span>
                <span>Pending</span>
              </span>
            </div>
          </article>
        </aside>
      </div>

      {/* Timestamped Day Log Modal */}
      {selectedDayLog && (
        <DayLogModal
          item={selectedDayLog}
          onClose={() => setSelectedDayLog(null)}
        />
      )}
    </main>
  );
}
