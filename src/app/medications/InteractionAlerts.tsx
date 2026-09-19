"use client";

import { AlertOctagon, AlertTriangle, ShieldAlert, Pill } from "lucide-react";
import { type DetectedInteraction } from "./types";

interface InteractionAlertsProps {
  interactions: DetectedInteraction[];
}

export default function InteractionAlerts({ interactions }: InteractionAlertsProps) {
  if (!interactions || interactions.length === 0) return null;

  return (
    <section className="space-y-4 animate-slide-in" aria-label="Drug interaction alerts">
      <div className="flex items-center gap-2 px-1">
        <ShieldAlert className="w-5 h-5 text-rose-600" />
        <h2 className="text-base font-bold text-slate-800">
          Potential Drug Interactions Detected ({interactions.length})
        </h2>
      </div>

      <div className="space-y-3">
        {interactions.map((interaction) => {
          const isHigh = interaction.rule.severity === "high";

          return (
            <div
              key={interaction.id}
              className={`rounded-2xl border p-4 sm:p-5 transition-all shadow-sm ${
                isHigh
                  ? "bg-rose-50 border-rose-300 text-rose-950"
                  : "bg-amber-50 border-amber-300 text-amber-950"
              }`}
            >
              {/* Header: Severity Badge + Conflict Pair */}
              <div className="flex flex-wrap items-start justify-between gap-2.5 mb-2.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-full ${
                      isHigh
                        ? "bg-rose-600 text-white shadow-xs"
                        : "bg-amber-600 text-white shadow-xs"
                    }`}
                  >
                    {isHigh ? (
                      <AlertOctagon className="w-3.5 h-3.5" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5" />
                    )}
                    {isHigh ? "High Severity Conflict" : "Moderate Severity Conflict"}
                  </span>

                  {/* Conflicting Pair Chip */}
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/80 border border-slate-200/80 text-xs font-bold text-slate-900 shadow-xs">
                    <Pill className="w-3 h-3 text-slate-500" />
                    {interaction.medicationA.name} + {interaction.medicationB.name}
                  </span>
                </div>

                <span className="text-xs font-semibold opacity-75">
                  {interaction.rule.title}
                </span>
              </div>

              {/* Biological Risk Description */}
              <p className="text-sm leading-relaxed mb-3 font-medium">
                {interaction.rule.description}
              </p>

              {/* Action Recommendation */}
              <div className="bg-white/70 rounded-xl p-3 border border-white/60 mb-3 text-xs leading-relaxed">
                <strong className="font-semibold block mb-0.5">Clinical Recommendation:</strong>
                <span className="opacity-90">{interaction.rule.actionRequired}</span>
              </div>

              {/* Prominent Mandatory Safety Disclaimer */}
              <div
                className={`text-[11px] font-medium leading-relaxed px-3 py-2 rounded-lg border ${
                  isHigh
                    ? "bg-rose-100/70 border-rose-200 text-rose-900"
                    : "bg-amber-100/70 border-amber-200 text-amber-900"
                }`}
              >
                ⚠️ <strong>Clinical Notice:</strong> Consult your pharmacist or doctor before taking these medications together. Do not modify your dosages on your own.
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
