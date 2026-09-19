"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { type DoseAlert, formatTime12h } from "./types";
import {
  startAlarm,
  stopAlarm,
  fireOSNotification,
  sendTelegramEscalation,
} from "./utils/alarmSystem";
import { type UserProfile } from "./types/profile";
import { useTranslation } from "./context/LanguageContext";

interface AlarmOverlayProps {
  alert: DoseAlert | null;
  onConfirm: (alert: DoseAlert) => void;
  escalationTimeoutSec?: number;
  userProfile?: UserProfile;
}

export default function AlarmOverlay({
  alert,
  onConfirm,
  escalationTimeoutSec = 20,
  userProfile,
}: AlarmOverlayProps) {
  const { t, language } = useTranslation();
  const [countdown, setCountdown] = useState(escalationTimeoutSec);
  const [escalated, setEscalated] = useState(false);
  const [escalating, setEscalating] = useState(false);
  const [visible, setVisible] = useState(false);
  const attemptRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // When a new alert arrives, start the alarm sequence
  useEffect(() => {
    if (!alert) {
      setVisible(false);
      setEscalated(false);
      setCountdown(escalationTimeoutSec);
      attemptRef.current = 0;
      return;
    }

    // Activate overlay
    setVisible(true);
    setEscalated(false);
    setCountdown(escalationTimeoutSec);
    attemptRef.current += 1;

    // Fire OS notification
    fireOSNotification(
      alert.medicationName,
      alert.dose,
      formatTime12h(alert.scheduledTime)
    );

    // Start audio alarm
    startAlarm();

    // Start countdown timer
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      stopAlarm();
    };
  }, [alert, escalationTimeoutSec]);

  // When countdown reaches 0, trigger Telegram escalation
  useEffect(() => {
    if (countdown === 0 && alert && !escalated && !escalating) {
      handleEscalate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown]);

  const handleEscalate = useCallback(async () => {
    if (!alert || escalating) return;
    setEscalating(true);
    stopAlarm();

    await sendTelegramEscalation({
      drugName: alert.medicationName,
      dose: alert.dose,
      scheduledTime: formatTime12h(alert.scheduledTime),
      attemptCount: attemptRef.current,
      patientName: userProfile?.patientName || "Rohith",
      guardianName: userProfile?.guardianName || "Father",
      guardianRelation: userProfile?.guardianRelation || "Family Caregiver",
    });

    setEscalated(true);
    setEscalating(false);
  }, [alert, escalating, userProfile]);

  const handleConfirm = useCallback(() => {
    stopAlarm();
    if (timerRef.current) clearInterval(timerRef.current);
    if (!alert) return;
    setVisible(false);
    onConfirm(alert);
  }, [alert, onConfirm]);

  if (!visible || !alert) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Urgency Header */}
        <div className="bg-rose-50 border-b border-rose-100 px-6 py-5 text-center flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-xs animate-bounce">
            <span className="material-symbols-outlined text-[28px]">
              notifications_active
            </span>
          </div>
          <h2 className="text-lg font-bold text-rose-950">
            {t.timeToTake || "Scheduled Medication Due"}
          </h2>
        </div>

        {/* Drug Details */}
        <div className="p-6 text-center flex flex-col gap-3">
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {alert.medicationName}
            </p>
            <p className="text-base font-semibold text-emerald-700 mt-0.5">
              {alert.dose}
            </p>
            <p className="text-xs text-slate-400 font-medium mt-1">
              {t.scheduledTime || "Scheduled Time"}: {formatTime12h(alert.scheduledTime)}
            </p>
          </div>

          {/* Countdown Bar */}
          {!escalated && (
            <div className="mt-2 flex flex-col gap-2">
              <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full self-center text-xs font-semibold text-amber-900">
                <span className="material-symbols-outlined text-[16px] text-amber-700">
                  volume_up
                </span>
                <span>
                  {t.guardianAlertIn || "Telegram alert in"} {countdown}s
                </span>
              </div>

              {/* Clean progress bar */}
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full transition-all duration-1000 ease-linear"
                  style={{
                    width: `${((escalationTimeoutSec - countdown) / escalationTimeoutSec) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Escalated banner */}
          {escalated && (
            <div className="mt-2 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 font-semibold flex items-center justify-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-emerald-700">
                send
              </span>
              <span>
                {language === "te"
                  ? `${t.guardianNotified || "సంరక్షకులకు సమాచారం పంపబడింది"} (${userProfile?.guardianRelation || "Father"}).`
                  : `Guardian (${userProfile?.guardianRelation || "Father"}) notified via Telegram.`}
              </span>
            </div>
          )}

          {escalating && (
            <div className="text-xs text-slate-500 font-medium">
              {language === "te" ? "సమాచారం పంపబడుతోంది..." : "Notifying caregiver..."}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="px-6 pb-6 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer text-base"
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
            <span>{t.tookDose || "✓ I Took This Dose"}</span>
          </button>

          {!escalated && (
            <button
              type="button"
              onClick={handleEscalate}
              disabled={escalating}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl text-xs transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">volume_off</span>
              <span>{t.silenceAndNotify || "Silence Alarm & Alert Guardian"}</span>
            </button>
          )}
        </div>

        {/* Disclaimer */}
        <div className="px-6 py-2.5 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-400">
          {t.educationalRoutineOnly || "Routine support reminder only"}
        </div>
      </div>
    </div>
  );
}
