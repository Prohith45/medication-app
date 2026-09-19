"use client";

import React, { useState } from "react";
import { useTranslation } from "./context/LanguageContext";
import {
  type Medication,
  type MedicationFormData,
  type DetectedInteraction,
  type Frequency,
  type DosingPattern,
  COMMON_MEDICATIONS,
  formatTime12h,
  calculateEndDate,
  getCourseProgress,
} from "./types";
import { INDIAN_DRUG_DETAILS, resolveIndianBrand } from "./data/indianMedicines";
import SpeakerButton from "./SpeakerButton";

interface MedicinesScreenProps {
  medications: Medication[];
  detectedInteractions: DetectedInteraction[];
  conflictingIds: Set<string>;
  onAddMedication: (data: MedicationFormData) => void;
  onDeleteMedication: (id: string) => void;
  onOpenDrugInfo?: (drugName: string) => void;
}

const DURATION_PRESETS: { label: string; value: number | "ongoing" }[] = [
  { label: "Ongoing", value: "ongoing" },
  { label: "3 Days", value: 3 },
  { label: "5 Days (Antibiotic)", value: 5 },
  { label: "7 Days", value: 7 },
  { label: "14 Days", value: 14 },
  { label: "30 Days", value: 30 },
];

export default function MedicinesScreen({
  medications,
  detectedInteractions,
  conflictingIds,
  onAddMedication,
  onDeleteMedication,
  onOpenDrugInfo,
}: MedicinesScreenProps) {
  const { t, language } = useTranslation();

  // Screen sub-views: "list" | "add" | "details"
  const [viewMode, setViewMode] = useState<"list" | "add" | "details">("list");
  const [selectedMed, setSelectedMed] = useState<Medication | null>(null);
  const [searchDrugQuery, setSearchDrugQuery] = useState("");

  // Add Medicine Form State
  const [formName, setFormName] = useState("");
  const [formDose, setFormDose] = useState("1 tablet");
  const [selectedTimes, setSelectedTimes] = useState<string[]>(["08:00"]);
  const [selectedPattern, setSelectedPattern] = useState<DosingPattern>("morning");
  const [selectedFrequency, setSelectedFrequency] = useState<Frequency>("daily");
  const [customTimeInput, setCustomTimeInput] = useState("11:01");

  // Course Duration State
  const [formDurationDays, setFormDurationDays] = useState<number | "ongoing">("ongoing");
  const [isFormCustomDuration, setIsFormCustomDuration] = useState(false);
  const [formCustomDays, setFormCustomDays] = useState("10");
  const [formStartDate, setFormStartDate] = useState(() => new Date().toISOString().split("T")[0]);

  const resetForm = () => {
    setFormName("");
    setFormDose("1 tablet");
    setSelectedTimes(["08:00"]);
    setSelectedPattern("morning");
    setSelectedFrequency("daily");
    setCustomTimeInput("11:01");
    setFormDurationDays("ongoing");
    setIsFormCustomDuration(false);
    setFormCustomDays("10");
    setFormStartDate(new Date().toISOString().split("T")[0]);
  };

  const effectiveFormDuration: number | "ongoing" = isFormCustomDuration
    ? parseInt(formCustomDays, 10) > 0
      ? parseInt(formCustomDays, 10)
      : "ongoing"
    : formDurationDays;

  const formCalculatedEndDate = calculateEndDate(formStartDate, effectiveFormDuration);

  const handleAddCustomTime = (timeToAdd: string) => {
    if (!timeToAdd) return;
    if (!selectedTimes.includes(timeToAdd)) {
      setSelectedTimes((prev) => [...prev, timeToAdd]);
    }
    const hour = parseInt(timeToAdd.split(":")[0], 10);
    const pat: DosingPattern =
      hour < 12 ? "morning" : hour < 17 ? "with-lunch" : hour < 21 ? "evening" : "night";
    setSelectedPattern(pat);
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanName = formName.trim();
    if (!cleanName) return;

    onAddMedication({
      name: cleanName,
      dose: formDose.trim() || "1 tablet",
      frequency: selectedFrequency,
      dosingPattern: selectedPattern,
      times: selectedTimes.length > 0 ? selectedTimes : ["08:00"],
      durationDays: effectiveFormDuration,
      startDate: formStartDate,
      endDate: formCalculatedEndDate,
    });

    resetForm();
    setViewMode("list");
  };

  const toggleTime = (time: string, pattern: DosingPattern) => {
    if (selectedTimes.includes(time)) {
      if (selectedTimes.length > 1) {
        setSelectedTimes((prev) => prev.filter((t) => t !== time));
      }
    } else {
      setSelectedTimes((prev) => [...prev, time]);
      setSelectedPattern(pattern);
    }
  };

  // ── SUB-VIEW: Pill Details ──
  if (viewMode === "details" && selectedMed) {
    const resolved = resolveIndianBrand(selectedMed.name);
    const regionalInfo =
      resolved.details ||
      INDIAN_DRUG_DETAILS[selectedMed.name.toLowerCase().trim()];
    const course = getCourseProgress(selectedMed);

    return (
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6 animate-fade-in">
        {/* Back navigation button */}
        <button
          type="button"
          onClick={() => setViewMode("list")}
          className="self-start px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl shadow-2xs flex items-center gap-2 text-sm font-semibold transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>{t.backToMedicines || "Back to medicines"}</span>
        </button>

        {/* Medicine Identity Card */}
        <section className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col gap-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  {selectedMed.name}
                </h1>
                {/* Course Duration Badge */}
                {course.isOngoing ? (
                  <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-xs font-bold border border-slate-200">
                    🔄 Ongoing
                  </span>
                ) : course.isCompleted ? (
                  <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full text-xs font-bold">
                    ✓ Completed ({course.totalDays}d)
                  </span>
                ) : course.isActive ? (
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-bold">
                    📅 Day {course.currentDay} of {course.totalDays}
                  </span>
                ) : (
                  <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full text-xs font-bold">
                    ⏳ {course.badgeText}
                  </span>
                )}
              </div>
              <p className="text-base text-slate-600 font-medium">
                {selectedMed.dose} ·{" "}
                {selectedMed.times.map((tm) => formatTime12h(tm)).join(", ")}
              </p>
            </div>
            <SpeakerButton
              name={selectedMed.name}
              dose={selectedMed.dose}
              timingCondition={selectedMed.timingCondition}
              size="lg"
            />
          </div>

          {/* Course Timeline Details Box */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 sm:p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-emerald-600 text-[18px]">event_available</span>
                <span>Course Schedule & Duration</span>
              </span>
              <span className={course.isCompleted ? "text-amber-800" : "text-emerald-700"}>
                {course.label}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-white rounded-lg p-2.5 border border-slate-200/80">
                <span className="text-slate-400 block text-[11px]">Start Date</span>
                <span className="font-bold text-slate-800">{selectedMed.startDate || "Today"}</span>
              </div>
              <div className="bg-white rounded-lg p-2.5 border border-slate-200/80">
                <span className="text-slate-400 block text-[11px]">End Date</span>
                <span className="font-bold text-slate-800">
                  {course.isOngoing ? "Ongoing (No end)" : selectedMed.endDate || "—"}
                </span>
              </div>
              <div className="bg-white rounded-lg p-2.5 border border-slate-200/80">
                <span className="text-slate-400 block text-[11px]">Course Type</span>
                <span className="font-bold text-slate-800">
                  {course.isOngoing ? "Chronic Maintenance" : `${course.totalDays} Days Fixed`}
                </span>
              </div>
              <div className="bg-white rounded-lg p-2.5 border border-slate-200/80">
                <span className="text-slate-400 block text-[11px]">Progress</span>
                <span className="font-bold text-emerald-700">
                  {course.isOngoing
                    ? "Continuous"
                    : course.isCompleted
                    ? "100% Completed"
                    : `${course.remainingDays} days left`}
                </span>
              </div>
            </div>

            {/* Course Progress Bar (if fixed course) */}
            {!course.isOngoing && !course.isFuture && (
              <div className="flex flex-col gap-1.5 pt-1">
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      course.isCompleted ? "bg-amber-500" : "bg-emerald-600"
                    }`}
                    style={{
                      width: `${Math.min(100, Math.round((course.currentDay / course.totalDays) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Pill Visual Recognition Box */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 sm:p-5 flex flex-col items-center gap-3">
            <div className="w-full flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700">{t.yourPillMatch || "Visual match"}</span>
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                {t.exactMatch || "Standard Formulation"}
              </span>
            </div>

            <div className="w-full h-28 bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center gap-2 p-3 shadow-2xs">
              <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 flex items-center justify-center font-bold text-sm shadow-2xs">
                {selectedMed.name.slice(0, 3).toUpperCase()}
              </div>
              <span className="text-xs font-bold text-slate-700">
                {selectedMed.name} ({selectedMed.dose})
              </span>
            </div>
          </div>
        </section>

        {/* Information sections */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-slate-900">{t.whatIsThisFor || "Medication Details"}</h2>

          {/* Purpose Card */}
          <article className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-emerald-700">
              <span className="material-symbols-outlined text-[20px]">health_and_safety</span>
              <h3 className="text-base font-bold text-slate-900">{t.whatIsThisFor || "What is it for?"}</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              {regionalInfo?.purpose ||
                `${selectedMed.name} is commonly prescribed for daily maintenance and routine health protection. Consult your doctor for specific indications.`}
            </p>
          </article>

          {/* How it works Card */}
          <article className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-emerald-700">
              <span className="material-symbols-outlined text-[20px]">cardiology</span>
              <h3 className="text-base font-bold text-slate-900">{t.howItWorks || "How it works"}</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              {regionalInfo?.howItWorks ||
                `It works steadily inside your system to stabilize your vitals when taken according to schedule.`}
            </p>
          </article>

          {/* Side effects Card */}
          <article className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-amber-700">
              <span className="material-symbols-outlined text-[20px]">info</span>
              <h3 className="text-base font-bold text-slate-900">{t.sideEffectsSomePeople || "Common notes & precautions"}</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              {regionalInfo?.sideEffects
                ? regionalInfo.sideEffects.join(", ")
                : `Mild drowsiness, dizziness upon standing, or mild stomach upset can occasionally occur. Tell your doctor or pharmacist if anything bothers you.`}
            </p>
          </article>

          {/* Pharmacist Advice Card */}
          {regionalInfo?.timingAdvice && (
            <article className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-5 shadow-xs flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-emerald-800">
                <span className="material-symbols-outlined text-[20px]">medical_services</span>
                <h3 className="text-base font-bold">{t.fromPharmacist || "Pharmacist Advice"}</h3>
              </div>
              <p className="text-sm text-emerald-950 italic font-medium leading-relaxed">
                "{regionalInfo.timingAdvice}"
              </p>
            </article>
          )}
        </section>

        {/* Action buttons */}
        <section className="flex flex-col sm:flex-row gap-3 pt-2">
          {onOpenDrugInfo && (
            <button
              type="button"
              onClick={() => onOpenDrugInfo(selectedMed.name)}
              className="flex-1 py-3 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
              <span>Open 3-Tier Clinical Explainer</span>
            </button>
          )}

          <a
            href="tel:108"
            className="py-3 px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">call</span>
            <span>{t.askPharmacistAboutThis || "Call Pharmacy / Helpline"}</span>
          </a>
        </section>
      </main>
    );
  }

  // ── SUB-VIEW: Add a Medicine Form ──
  if (viewMode === "add") {
    return (
      <main className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6 animate-fade-in">
        {/* Back button */}
        <button
          type="button"
          onClick={() => setViewMode("list")}
          className="self-start px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-2xs transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>{t.cancelGoBack || "Back"}</span>
        </button>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {t.addAMedicine || "Add Medication"}
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            {t.tellUsAboutMedicine || "Specify medicine name, dosage, daily schedule & course duration."}
          </p>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-5">
          {/* Question 1: Name */}
          <section className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col gap-3">
            <label htmlFor="med-name" className="text-base font-bold text-slate-900">
              {t.whatIsItCalled || "Medicine Name"}
            </label>
            <input
              id="med-name"
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Dolo 650, Metformin, Pan-D"
              list="common-meds-list"
              required
              className="w-full px-4 py-3 text-base font-semibold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
            />
            <datalist id="common-meds-list">
              {COMMON_MEDICATIONS.map((med) => (
                <option key={med} value={med} />
              ))}
            </datalist>

            {/* Quick picks */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {["Dolo 650", "Pan-D", "Bisoprolol", "Cetirizine", "Folitrax", "Ecosprin"].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setFormName(preset)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    formName === preset
                      ? "bg-emerald-600 text-white shadow-2xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </section>

          {/* Question 2: Dose */}
          <section className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col gap-3">
            <label htmlFor="med-dose" className="text-base font-bold text-slate-900">
              {t.howMuchDose || "Dosage"}
            </label>
            <input
              id="med-dose"
              type="text"
              value={formDose}
              onChange={(e) => setFormDose(e.target.value)}
              placeholder="e.g. 650 mg, 1 tablet, 1 capsule"
              className="w-full px-4 py-3 text-base font-semibold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
            />
          </section>

          {/* Question 3: Times & Custom Time Section */}
          <section className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <label className="text-base font-bold text-slate-900">
                {t.whatTimeTake || "Daily Times & Schedule"}
              </label>
              <span className="text-xs text-slate-400 font-medium">Pick routine or custom time</span>
            </div>

            {/* Quick Routine Slots */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { time: "08:00", label: "Morning", pattern: "morning" as DosingPattern },
                { time: "13:00", label: "Afternoon", pattern: "with-lunch" as DosingPattern },
                { time: "18:00", label: "Evening", pattern: "evening" as DosingPattern },
                { time: "22:00", label: "Night", pattern: "night" as DosingPattern },
              ].map((slot) => {
                const isSelected = selectedTimes.includes(slot.time);
                return (
                  <button
                    key={slot.time}
                    type="button"
                    onClick={() => toggleTime(slot.time, slot.pattern)}
                    className={`py-3 px-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span>{slot.label}</span>
                    <span className="text-slate-400 font-medium">{formatTime12h(slot.time)}</span>
                  </button>
                );
              })}
            </div>

            {/* Custom Exact Time Picker */}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <label htmlFor="custom-exact-time-input" className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-emerald-600 text-[18px]">access_time</span>
                  <span>{t.customTime || "Or Pick Custom Exact Time"}</span>
                </label>
                <span className="text-xs text-slate-400">e.g., 11:01 AM, 02:30 PM</span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="custom-exact-time-input"
                  type="time"
                  step="60"
                  value={customTimeInput}
                  onChange={(e) => {
                    const newT = e.target.value;
                    setCustomTimeInput(newT);
                    if (newT) {
                      handleAddCustomTime(newT);
                    }
                  }}
                  className="flex-1 px-4 py-2.5 text-base font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all cursor-pointer"
                />

                <button
                  type="button"
                  onClick={() => handleAddCustomTime(customTimeInput)}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer shrink-0 active:scale-95"
                >
                  + Add Time
                </button>
              </div>

              {/* Popular Custom Times Quick Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-xs font-semibold text-slate-400 mr-1">Presets:</span>
                {[
                  { label: "11:01 AM", val: "11:01" },
                  { label: "02:30 PM", val: "14:30" },
                  { label: "05:15 PM", val: "17:15" },
                  { label: "09:45 PM", val: "21:45" },
                  { label: "11:00 PM", val: "23:00" },
                ].map((chip) => (
                  <button
                    key={chip.val}
                    type="button"
                    onClick={() => {
                      setCustomTimeInput(chip.val);
                      handleAddCustomTime(chip.val);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      selectedTimes.includes(chip.val)
                        ? "bg-emerald-600 text-white shadow-2xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Selected Times Badges */}
              <div className="mt-1 p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 mr-1">Scheduled for this medicine:</span>
                {selectedTimes.map((tVal) => (
                  <span
                    key={tVal}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-emerald-800 border border-emerald-200/80 rounded-lg text-xs font-bold shadow-2xs"
                  >
                    <span>⏰ {formatTime12h(tVal)}</span>
                    {selectedTimes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setSelectedTimes((prev) => prev.filter((t) => t !== tVal))}
                        className="text-slate-400 hover:text-rose-600 font-bold ml-1 cursor-pointer"
                        title="Remove scheduled time"
                      >
                        ✕
                      </button>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Question 4: Course Duration & Start Date */}
          <section className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <label className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-emerald-600 text-[20px]">calendar_month</span>
                <span>{language === "te" ? "కోర్సు వ్యవధి (Duration):" : "Course Duration"}</span>
              </label>
              <span className="text-xs text-slate-400 font-medium">
                {effectiveFormDuration === "ongoing" ? "Chronic / Maintenance" : `${effectiveFormDuration} days`}
              </span>
            </div>

            {/* Duration Presets */}
            <div className="flex flex-wrap gap-2">
              {DURATION_PRESETS.map((preset) => {
                const isSelected = !isFormCustomDuration && formDurationDays === preset.value;
                return (
                  <button
                    key={String(preset.value)}
                    type="button"
                    onClick={() => {
                      setIsFormCustomDuration(false);
                      setFormDurationDays(preset.value);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-emerald-600 text-white shadow-2xs"
                        : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setIsFormCustomDuration(true)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isFormCustomDuration
                    ? "bg-emerald-600 text-white shadow-2xs"
                    : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {language === "te" ? "ఇతర రోజులు" : "Custom Days"}
              </button>
            </div>

            {/* Custom Days Input */}
            {isFormCustomDuration && (
              <div className="flex items-center gap-2 pt-1 animate-fade-in">
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={formCustomDays}
                  onChange={(e) => setFormCustomDays(e.target.value)}
                  placeholder="e.g. 10"
                  className="w-28 px-3 py-2 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
                <span className="text-xs text-slate-500 font-medium">
                  {language === "te" ? "రోజుల కోర్సు" : "days course"}
                </span>
              </div>
            )}

            {/* Start Date & Timeline Preview */}
            <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  {language === "te" ? "ప్రారంభ తేదీ (Start Date):" : "Course Start Date"}
                </label>
                <input
                  type="date"
                  value={formStartDate}
                  onChange={(e) => setFormStartDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm font-semibold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all cursor-pointer"
                />
              </div>

              {/* End Date Preview Badge */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3 flex flex-col justify-center">
                <span className="text-[11px] font-semibold text-slate-400">
                  {language === "te" ? "కోర్సు వ్యవధి వివరాలు:" : "Course Timeline Preview:"}
                </span>
                {effectiveFormDuration === "ongoing" ? (
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 mt-0.5">
                    <span>🔄 Ongoing Course</span>
                    <span className="text-slate-400 font-normal">(Chronic maintenance)</span>
                  </span>
                ) : (
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 flex-wrap mt-0.5">
                    <span>📅 Ends: {formCalculatedEndDate || "—"}</span>
                    <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md text-[11px]">
                      {effectiveFormDuration} days total
                    </span>
                  </span>
                )}
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-2">
            <button
              type="submit"
              disabled={!formName.trim()}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold rounded-xl shadow-xs transition-all active:scale-[0.99] cursor-pointer disabled:cursor-not-allowed text-base flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">save</span>
              <span>{t.saveThisMedicine || "Save Medication"}</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode("list")}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 font-semibold rounded-xl text-sm transition-all cursor-pointer"
            >
              {t.cancelGoBack || "Cancel"}
            </button>
          </div>
        </form>
      </main>
    );
  }

  // ── SUB-VIEW: Medication List (Default) ──
  return (
    <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6">
      {/* Title & Add CTA */}
      <section className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
            {t.yourMedications || "Your Medications"}
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-0.5">
            {medications.length} active {medications.length === 1 ? "prescription" : "prescriptions"} on file
          </p>
        </div>

        <button
          type="button"
          onClick={() => setViewMode("add")}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold flex items-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>{t.addAMedicine || "Add Medicine"}</span>
        </button>
      </section>

      {/* ── Instant Formulary Search Bar ── */}
      <section>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (searchDrugQuery.trim() && onOpenDrugInfo) {
              onOpenDrugInfo(searchDrugQuery.trim());
            }
          }}
          className="flex flex-col sm:flex-row items-stretch gap-2 bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-xs"
        >
          <div className="flex-1 flex items-center gap-2 px-3">
            <span className="material-symbols-outlined text-slate-400 text-[22px]">
              search
            </span>
            <input
              type="text"
              value={searchDrugQuery}
              onChange={(e) => setSearchDrugQuery(e.target.value)}
              placeholder="Search any Indian medicine or typo (e.g. pan d, dolo, citirizine)…"
              className="w-full text-sm sm:text-base text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400 font-medium"
            />
          </div>
          <button
            type="submit"
            disabled={!searchDrugQuery.trim()}
            className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-xl font-bold text-xs sm:text-sm shadow-2xs transition-all cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-1.5 shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            <span>Clinical Explainer</span>
          </button>
        </form>
      </section>

      {/* ── DRUG INTERACTIONS SECTION (If detected) ── */}
      {detectedInteractions.length > 0 && (
        <section className="bg-rose-50 border border-rose-200 rounded-2xl p-5 sm:p-6 text-rose-900 flex flex-col gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-rose-600 text-[24px]">
              warning
            </span>
            <h2 className="text-base sm:text-lg font-bold">
              {t.takingTheseTogether || "Important Interaction Notice"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {detectedInteractions.map((inter) => (
              <div key={inter.id} className="bg-white/80 rounded-xl p-4 border border-rose-200/70 flex flex-col gap-1.5 text-xs sm:text-sm">
                <span className="font-bold text-rose-950 text-base">
                  ⚠️ {inter.medicationA.name} + {inter.medicationB.name}
                </span>
                <p className="text-slate-600">{inter.rule.description}</p>
                <p className="font-semibold text-rose-900 mt-1">
                  Action: {inter.rule.actionRequired}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── MEDICATION LIST CARDS ── */}
      {medications.length === 0 ? (
        <section className="bg-white border border-slate-200/80 rounded-2xl p-8 sm:p-12 shadow-xs flex flex-col items-center text-center gap-4 my-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-[32px]">medication</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{t.noMedicationsYet || "No medications added yet"}</h2>
            <p className="text-sm text-slate-500 mt-1">{t.useFormAbove || "Add your daily prescription using the button above."}</p>
          </div>
          <button
            type="button"
            onClick={() => setViewMode("add")}
            className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-xs transition-all cursor-pointer active:scale-95"
          >
            {t.addAMedicine || "Add Medicine"}
          </button>
        </section>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {medications.map((med) => {
            const hasConflict = conflictingIds.has(med.id);
            const course = getCourseProgress(med);

            return (
              <article
                key={med.id}
                className={`bg-white border rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4 ${
                  hasConflict ? "border-rose-300 ring-1 ring-rose-200" : "border-slate-200/80"
                }`}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                          {med.name}
                        </h3>
                        <SpeakerButton
                          name={med.name}
                          dose={med.dose}
                          timingCondition={med.timingCondition}
                          size="sm"
                        />
                      </div>
                      <p className="text-sm font-medium text-slate-500 mt-0.5">
                        {med.dose}
                      </p>
                    </div>

                    {hasConflict && (
                      <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full text-xs font-bold">
                        Conflict
                      </span>
                    )}
                  </div>

                  {/* Course Duration Badge & Times */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* Course Badge */}
                    {course.isOngoing ? (
                      <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-xs font-semibold">
                        🔄 Ongoing
                      </span>
                    ) : course.isCompleted ? (
                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-md text-xs font-bold">
                        ✓ {course.badgeText}
                      </span>
                    ) : course.isActive ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-md text-xs font-bold">
                        📅 {course.badgeText}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-md text-xs font-medium">
                        ⏳ {course.badgeText}
                      </span>
                    )}

                    {/* Scheduled Times */}
                    {med.times.map((time) => (
                      <span key={time} className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md text-xs font-semibold">
                        ⏰ {formatTime12h(time)}
                      </span>
                    ))}
                  </div>

                  {/* Progress Bar for Active / Completed Fixed Courses */}
                  {!course.isOngoing && !course.isFuture && (
                    <div className="flex flex-col gap-1 pt-1">
                      <div className="flex justify-between items-center text-[11px] font-semibold text-slate-500">
                        <span>{course.label}</span>
                        <span>{Math.round((course.currentDay / course.totalDays) * 100)}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            course.isCompleted ? "bg-amber-500" : "bg-emerald-600"
                          }`}
                          style={{
                            width: `${Math.min(100, Math.round((course.currentDay / course.totalDays) * 100))}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Actions (Details / Explainer / Delete) */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMed(med);
                      setViewMode("details");
                    }}
                    className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">visibility</span>
                    <span>Details</span>
                  </button>

                  {onOpenDrugInfo && (
                    <button
                      type="button"
                      onClick={() => onOpenDrugInfo(med.name)}
                      className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                      title="Open 3-Tier Clinical Explainer"
                    >
                      <span className="material-symbols-outlined text-[16px]">menu_book</span>
                      <span>AI Info</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Remove ${med.name} from your schedule?`)) {
                        onDeleteMedication(med.id);
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                    aria-label={`Delete ${med.name}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {/* Disclaimer */}
      <div className="pt-2 text-center text-xs text-slate-400 font-medium">
        <p>{t.appHelpsRemember || "Routine adherence assistant. Consult your physician for medical decisions."}</p>
      </div>
    </main>
  );
}
