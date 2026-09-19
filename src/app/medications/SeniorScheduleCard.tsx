"use client";

import { Pill, Check, Trash2 } from "lucide-react";
import {
  type Medication,
  formatTime12h,
} from "./types";
import { useTranslation } from "./context/LanguageContext";
import { type TranslationDictionary } from "./data/translations";

interface SeniorScheduleCardProps {
  medication: Medication;
  onTook: (med: Medication) => void;
  onDelete: (id: string) => void;
}

/** Map dosing patterns to large, clear intake instructions in selected language */
function intakeInstruction(pattern: string, t: TranslationDictionary): string {
  switch (pattern) {
    case "morning":
      return t.takeInMorning;
    case "afternoon":
      return t.takeInAfternoon;
    case "evening":
      return t.takeInEvening;
    case "night":
      return t.takeAtNight;
    case "with-breakfast":
      return t.takeWithBreakfast;
    case "with-lunch":
      return t.takeWithLunch;
    case "with-dinner":
      return t.takeWithDinner;
    case "before-meals":
      return t.beforeMeals;
    case "after-meals":
      return t.afterFood;
    default:
      return t.asDirected;
  }
}

export default function SeniorScheduleCard({
  medication,
  onTook,
  onDelete,
}: SeniorScheduleCardProps) {
  const { name, dose, dosingPattern, times } = medication;
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-md p-6">
      {/* Pill icon + drug name */}
      <div className="flex items-center gap-4 mb-4">
        <div className="shrink-0 p-3 bg-blue-100 rounded-xl border-2 border-blue-300">
          <Pill className="w-8 h-8 text-blue-700" />
        </div>
        <div>
          <h3 className="text-[22px] font-bold text-slate-900 leading-tight">
            {name}
          </h3>
          <p className="text-lg font-semibold text-blue-800 mt-0.5">{dose}</p>
        </div>
      </div>

      {/* Large clear intake instruction */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-xl px-4 py-3 mb-4">
        <p className="text-base sm:text-lg font-extrabold text-amber-900 tracking-wide">
          📋 {intakeInstruction(dosingPattern, t)}
        </p>
      </div>

      {/* Scheduled times (large) */}
      <div className="flex flex-wrap gap-3 mb-5">
        {times.map((tTime) => (
          <span
            key={tTime}
            className="text-lg font-bold text-slate-800 bg-slate-100 border-2 border-slate-300 px-4 py-2 rounded-xl"
          >
            🕐 {formatTime12h(tTime)}
          </span>
        ))}
      </div>

      {/* Large action buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => onTook(medication)}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-lg font-bold rounded-xl border-2 border-emerald-700 transition shadow-md cursor-pointer min-h-[56px]"
        >
          <Check className="w-6 h-6 shrink-0" strokeWidth={3} />
          <span>{t.tookDose}</span>
        </button>
        <button
          onClick={() => onDelete(medication.id)}
          className="flex items-center justify-center px-4 py-4 bg-white hover:bg-red-50 text-red-600 rounded-xl border-2 border-red-300 transition cursor-pointer min-h-[56px]"
          aria-label="Remove medication"
        >
          <Trash2 className="w-6 h-6" />
        </button>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-slate-400 mt-3 text-center leading-relaxed">
        {t.educationalRoutineOnly}
      </p>
    </div>
  );
}
