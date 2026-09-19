"use client";

import { Flame, TrendingUp, CalendarCheck } from "lucide-react";
import WeeklyStrip from "./WeeklyStrip";
import { type DayEntry } from "./useAdherence";

interface ComplianceCardProps {
  streak: number;
  monthlyTaken: number;
  monthlyTotal: number;
  monthlyPercentage: number;
  weekStrip: DayEntry[];
}

function percentColor(pct: number): string {
  if (pct >= 90) return "text-emerald-600";
  if (pct >= 70) return "text-amber-600";
  return "text-rose-600";
}

function barColor(pct: number): string {
  if (pct >= 90) return "bg-emerald-500";
  if (pct >= 70) return "bg-amber-500";
  return "bg-rose-500";
}

export default function ComplianceCard({
  streak,
  monthlyTaken,
  monthlyTotal,
  monthlyPercentage,
  weekStrip,
}: ComplianceCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* ── Top row: Streak + Compliance % ── */}
      <div className="px-5 py-4 flex flex-wrap items-center gap-5">
        {/* Streak */}
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-orange-50 rounded-xl">
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900 leading-none tabular-nums">
              {streak}
            </p>
            <p className="text-[11px] text-slate-500 font-medium">
              Day Streak
            </p>
          </div>
        </div>

        <div className="h-10 w-px bg-slate-200 hidden sm:block" />

        {/* Compliance Percentage */}
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 rounded-xl">
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p
              className={`text-2xl font-extrabold leading-none tabular-nums ${percentColor(
                monthlyPercentage
              )}`}
            >
              {monthlyPercentage}%
            </p>
            <p className="text-[11px] text-slate-500 font-medium">
              Compliance
            </p>
          </div>
        </div>

        <div className="h-10 w-px bg-slate-200 hidden sm:block" />

        {/* Monthly summary + progress bar */}
        <div className="flex-1 min-w-[160px]">
          <div className="flex items-center gap-1.5 mb-1.5">
            <CalendarCheck className="w-3.5 h-3.5 text-slate-400" />
            <p className="text-xs text-slate-600">
              You took{" "}
              <span className="font-bold text-slate-800">{monthlyTaken}</span>{" "}
              of{" "}
              <span className="font-bold text-slate-800">{monthlyTotal}</span>{" "}
              scheduled doses this month
            </p>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${barColor(
                monthlyPercentage
              )}`}
              style={{ width: `${monthlyPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Weekly Strip ── */}
      <div className="px-5 py-3 bg-slate-50/60 border-t border-slate-100">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          This Week
        </p>
        <WeeklyStrip days={weekStrip} />
      </div>
    </div>
  );
}
