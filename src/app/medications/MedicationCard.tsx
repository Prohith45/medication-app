"use client";

import {
  Pencil,
  Trash2,
  Clock,
  CalendarDays,
  Pill,
  BookOpen,
  AlertTriangle,
} from "lucide-react";
import {
  type Medication,
  FREQUENCY_LABELS,
  DOSING_PATTERN_LABELS,
  formatTime12h,
} from "./types";

interface MedicationCardProps {
  medication: Medication;
  onEdit: (medication: Medication) => void;
  onDelete: (id: string) => void;
  onInfo: (drugName: string) => void;
  hasConflict?: boolean;
}


/** Colour mapping for frequency badges */
function frequencyColor(f: string) {
  switch (f) {
    case "daily":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "weekly":
      return "bg-violet-50 text-violet-700 border-violet-200";
    case "as-needed":
      return "bg-amber-50 text-amber-700 border-amber-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
}

export default function MedicationCard({
  medication,
  onEdit,
  onDelete,
  onInfo,
  hasConflict = false,
}: MedicationCardProps) {
  const { id, name, dose, frequency, dosingPattern, times } = medication;

  return (
    <div
      className={`group rounded-2xl border shadow-sm hover:shadow-md transition-shadow p-5 ${
        hasConflict
          ? "bg-rose-50/30 border-rose-300 ring-1 ring-rose-200"
          : "bg-white border-slate-200"
      }`}
    >
      {/* Top row: name + actions */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <div className={`p-2 rounded-lg ${hasConflict ? "bg-rose-100" : "bg-blue-50"}`}>
              <Pill className={`w-5 h-5 ${hasConflict ? "text-rose-600" : "text-blue-600"}`} />
            </div>
            {hasConflict && (
              <div className="absolute -top-1.5 -right-1.5 p-0.5 bg-rose-500 rounded-full animate-pulse">
                <AlertTriangle className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-800 truncate text-base">
              {name}
            </h3>
            <span className="inline-block mt-0.5 text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {dose}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onInfo(name)}
            className="p-1.5 rounded-lg hover:bg-violet-50 text-slate-400 hover:text-violet-600 transition cursor-pointer"
            aria-label="Drug information"
          >
            <BookOpen className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(medication)}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition cursor-pointer"
            aria-label="Edit medication"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(id)}
            className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition cursor-pointer"
            aria-label="Delete medication"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tags row */}
      <div className="flex flex-wrap items-center gap-2 mt-4">
        {/* Frequency badge */}
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full border ${frequencyColor(
            frequency
          )}`}
        >
          <CalendarDays className="inline w-3 h-3 mr-1 -mt-0.5" />
          {FREQUENCY_LABELS[frequency]}
        </span>

        {/* Dosing pattern badge */}
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-50 text-slate-600 border border-slate-200">
          {DOSING_PATTERN_LABELS[dosingPattern]}
        </span>
      </div>

      {/* Scheduled times */}
      <div className="mt-4 flex flex-wrap gap-2">
        {times.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200"
          >
            <Clock className="w-3 h-3 text-slate-400" />
            {formatTime12h(t)}
          </span>
        ))}
      </div>
    </div>
  );
}
