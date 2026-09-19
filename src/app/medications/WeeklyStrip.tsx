"use client";

import { Check, X, Minus } from "lucide-react";
import { type DayEntry } from "./useAdherence";

interface WeeklyStripProps {
  days: DayEntry[];
}

export default function WeeklyStrip({ days }: WeeklyStripProps) {
  if (days.length === 0) return null;

  return (
    <div className="flex items-end justify-between gap-1 sm:gap-2">
      {days.map((day) => (
        <div key={day.date} className="flex flex-col items-center gap-1 flex-1">
          {/* Weekday label */}
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">
            {day.label}
          </span>

          {/* Day badge */}
          <div
            className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center border-2 transition-all ${badgeStyle(
              day
            )}`}
          >
            {badgeIcon(day)}
          </div>

          {/* Day number */}
          <span
            className={`text-[10px] font-semibold ${
              day.isToday ? "text-blue-600" : "text-slate-500"
            }`}
          >
            {day.day}
          </span>
        </div>
      ))}
    </div>
  );
}

function badgeStyle(day: DayEntry): string {
  if (day.status === "all-taken") {
    return "bg-emerald-500 border-emerald-600 text-white shadow-sm";
  }
  if (day.status === "partial") {
    return "bg-amber-100 border-amber-300 text-amber-700";
  }
  if (day.status === "missed") {
    return "bg-rose-100 border-rose-300 text-rose-600";
  }
  if (day.isToday) {
    return "bg-blue-50 border-blue-400 text-blue-600 ring-2 ring-blue-200";
  }
  // future or none
  return "bg-slate-50 border-slate-200 text-slate-400";
}

function badgeIcon(day: DayEntry) {
  if (day.status === "all-taken") {
    return <Check className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={3} />;
  }
  if (day.status === "partial") {
    return <Minus className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={3} />;
  }
  if (day.status === "missed") {
    return <X className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={3} />;
  }
  // none / future / today
  return (
    <span className="text-xs font-bold">{day.isToday ? "•" : ""}</span>
  );
}
