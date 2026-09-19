"use client";

import { Bell, Check, SkipForward, Clock } from "lucide-react";
import { type DoseAlert, formatTime12h } from "./types";
import { useTranslation } from "./context/LanguageContext";

interface AlertBannerProps {
  alerts: DoseAlert[];
  onConfirm: (alert: DoseAlert) => void;
  onSkip: (alert: DoseAlert) => void;
}

export default function AlertBanner({
  alerts,
  onConfirm,
  onSkip,
}: AlertBannerProps) {
  const { t } = useTranslation();

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-4 sm:p-5 shadow-md animate-slide-in"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Icon + info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="shrink-0 p-2.5 bg-red-100 rounded-xl animate-pulse-ring">
                <Bell className="w-5 h-5 text-red-600" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-red-800">
                  {t.reminderTitle}
                </p>
                <p className="text-base font-bold text-slate-900 truncate">
                  {alert.medicationName}{" "}
                  <span className="font-medium text-slate-600">
                    {alert.dose}
                  </span>
                </p>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3" />
                  {t.scheduledFor} {formatTime12h(alert.scheduledTime)}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => onConfirm(alert)}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition shadow-sm cursor-pointer"
              >
                <Check className="w-4 h-4" />
                {t.confirmDose}
              </button>
              <button
                onClick={() => onSkip(alert)}
                className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 text-slate-600 text-sm font-medium rounded-lg border border-slate-300 transition cursor-pointer"
              >
                <SkipForward className="w-4 h-4" />
                {t.skipDose}
              </button>
            </div>
          </div>

          {/* Safety disclaimer */}
          <p className="mt-2 text-[10px] text-red-500/70 leading-relaxed">
            {t.educationalRoutineOnly}
          </p>
        </div>
      ))}
    </div>
  );
}
