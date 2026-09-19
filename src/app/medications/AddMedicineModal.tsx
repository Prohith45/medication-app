"use client";

import React, { useState } from "react";
import {
  type MedicationFormData,
  type DosingPattern,
  type Frequency,
  COMMON_MEDICATIONS,
  formatTime12h,
  getTimeSlotBadgeLabel,
} from "./types";
import { useTranslation } from "./context/LanguageContext";

interface AddMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: MedicationFormData & { timingCondition: string; initialStatus: "due" | "pending" }) => void;
}

const PRESET_SUGGESTIONS = [
  "Dolo 650",
  "Pan-D",
  "Bisoprolol",
  "Cetirizine",
  "Folitrax",
  "Ecosprin",
  "Combiflam",
];

const TIMING_CONDITIONS = [
  "Morning (Breakfast)",
  "Afternoon (Lunch)",
  "Evening (Snacks)",
  "Night (Bedtime)",
  "Take after food",
  "Take on empty stomach",
];

export default function AddMedicineModal({
  isOpen,
  onClose,
  onAdd,
}: AddMedicineModalProps) {
  const { t, language } = useTranslation();

  const [name, setName] = useState("");
  const [dose, setDose] = useState("650 mg");
  const [exactTime, setExactTime] = useState("11:01");
  const [timingCondition, setTimingCondition] = useState("Morning (Breakfast)");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) return;

    // Calculate initial status based on today's current time
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const [h, m] = exactTime.split(":").map(Number);
    const scheduledMinutes = (h || 0) * 60 + (m || 0);
    const initialStatus: "due" | "pending" = currentMinutes >= scheduledMinutes ? "due" : "pending";

    // Map timing condition to dosing pattern
    let dosingPattern: DosingPattern = "morning";
    if (timingCondition.includes("Lunch") || timingCondition.includes("Afternoon")) {
      dosingPattern = "with-lunch";
    } else if (timingCondition.includes("Evening")) {
      dosingPattern = "evening";
    } else if (timingCondition.includes("Night") || timingCondition.includes("Bedtime")) {
      dosingPattern = "night";
    } else if (timingCondition.includes("after food")) {
      dosingPattern = "after-meals";
    } else if (timingCondition.includes("empty stomach")) {
      dosingPattern = "before-meals";
    }

    onAdd({
      name: cleanName,
      dose: dose.trim() || "1 tablet",
      frequency: "daily" as Frequency,
      dosingPattern,
      times: [exactTime],
      timingCondition,
      initialStatus,
    });

    // Reset & close
    setName("");
    setDose("650 mg");
    setExactTime("11:01");
    setTimingCondition("Morning (Breakfast)");
    onClose();
  };

  const previewBadge = `⏰ ${formatTime12h(exactTime)} • ${getTimeSlotBadgeLabel(exactTime, timingCondition)}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 shadow-xl rounded-2xl max-w-lg w-full p-6 sm:p-7 flex flex-col gap-6 text-slate-900 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">add_circle</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-snug">
                {language === "te" ? "మందును జోడించండి" : "Add Medication"}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {language === "te" ? "ఖచ్చితమైన సమయం & మోతాదు నమోదు" : "Custom time & dosing schedule"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center text-sm font-bold cursor-pointer transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* 1. Medicine Name Input with Autocomplete Suggestions */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="med-modal-name" className="text-sm font-bold text-slate-700 flex items-center justify-between">
              <span>{language === "te" ? "మందు పేరు:" : "Medicine Name"}</span>
              <span className="text-xs text-slate-400 font-normal">Required</span>
            </label>
            <input
              id="med-modal-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Dolo 650, Pan-D, Folitrax"
              list="preset-medicines-list"
              className="w-full px-4 py-3 text-base font-semibold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
            />
            <datalist id="preset-medicines-list">
              {COMMON_MEDICATIONS.map((med) => (
                <option key={med} value={med} />
              ))}
            </datalist>

            {/* Quick-Pick Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {PRESET_SUGGESTIONS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setName(preset)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    name === preset
                      ? "bg-emerald-600 text-white shadow-2xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Dose Input */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="med-modal-dose" className="text-sm font-bold text-slate-700">
              {language === "te" ? "మోతాదు (Dose):" : "Dosage"}
            </label>
            <input
              id="med-modal-dose"
              type="text"
              required
              value={dose}
              onChange={(e) => setDose(e.target.value)}
              placeholder="e.g., 650 mg, 1 tablet, 500 mg"
              className="w-full px-4 py-3 text-base font-semibold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
            />
            {/* Quick Dose Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {["650 mg", "500 mg", "1 tablet", "1 capsule", "2 tablets"].map((dOpt) => (
                <button
                  key={dOpt}
                  type="button"
                  onClick={() => setDose(dOpt)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    dose === dOpt
                      ? "bg-emerald-600 text-white shadow-2xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {dOpt}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Custom Exact Time */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="med-modal-time" className="text-sm font-bold text-slate-700 flex items-center justify-between">
              <span>{language === "te" ? "ఖచ్చితమైన సమయం:" : "Scheduled Time"}</span>
              <span className="text-xs text-slate-400 font-normal">e.g. 11:01 AM</span>
            </label>
            <input
              id="med-modal-time"
              type="time"
              step="60"
              required
              value={exactTime}
              onChange={(e) => setExactTime(e.target.value)}
              className="w-full px-4 py-3 text-base font-semibold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all cursor-pointer"
            />
            {/* Live badge preview */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">
                {language === "te" ? "కార్డుపై ప్రదర్శించే బ్యాడ్జ్:" : "Badge Preview:"}
              </span>
              <span className="bg-amber-50 text-amber-800 border border-amber-200 font-bold px-2.5 py-1 rounded-md">
                {previewBadge}
              </span>
            </div>
          </div>

          {/* 4. Timing Slot / Condition Select Dropdown */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="med-modal-condition" className="text-sm font-bold text-slate-700">
              {language === "te" ? "సమయం స్లాట్ / ఆహార నియమం:" : "Routine Slot / Intake Condition"}
            </label>
            <select
              id="med-modal-condition"
              value={timingCondition}
              onChange={(e) => setTimingCondition(e.target.value)}
              className="w-full px-4 py-3 text-base font-semibold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all cursor-pointer"
            >
              {TIMING_CONDITIONS.map((cond) => (
                <option key={cond} value={cond}>
                  {cond}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 pt-3">
            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-all active:scale-[0.99] cursor-pointer text-base flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">save</span>
              <span>{language === "te" ? "మందును భద్రపరచండి" : "Save Medication"}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 font-semibold rounded-xl text-sm transition-all cursor-pointer"
            >
              {t.cancel || "Cancel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
