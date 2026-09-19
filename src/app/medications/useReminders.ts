"use client";

import { useEffect, useRef, useCallback } from "react";
import { type Medication, type DoseAlert, formatTime12h } from "./types";

// ─── Helpers ────────────────────────────────────────────────────────

function generateAlertId(): string {
  return `alert_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Get current local time as "HH:MM" (24h, zero‑padded) */
function nowHHMM(): string {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, "0")}:${d
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
}

// ─── Browser Notification Helper ────────────────────────────────────

function sendBrowserNotification(med: Medication, time: string) {
  if (
    typeof window === "undefined" ||
    !("Notification" in window) ||
    Notification.permission !== "granted"
  )
    return;

  try {
    new Notification("💊 Medication Reminder", {
      body: `Time to take ${med.name} ${med.dose} — ${formatTime12h(time)}`,
      icon: "/favicon.ico",
      tag: `med-${med.id}-${time}`, // prevents duplicate OS toasts
    });
  } catch {
    // Safari / some environments throw on `new Notification` – fail silently
  }
}

// ─── Hook ───────────────────────────────────────────────────────────

interface UseRemindersOptions {
  medications: Medication[];
  onAlert: (alert: DoseAlert) => void;
}

/**
 * Polls every 30 s, compares `nowHHMM()` against every medication's
 * `times[]`, and fires `onAlert` + a browser notification when there's
 * a match. A `firedSet` ref prevents duplicate alerts within the same
 * minute.
 *
 * Also exposes `simulateAlert` for the hackathon demo button.
 */
export function useReminders({ medications, onAlert }: UseRemindersOptions) {
  // "medId:HH:MM" keys we already fired this minute window
  const firedRef = useRef<Set<string>>(new Set());

  // ── Core check ──────────────────────────────────────────────────
  const checkReminders = useCallback(() => {
    const currentTime = nowHHMM();

    medications.forEach((med) => {
      med.times.forEach((t) => {
        const key = `${med.id}:${t}:${currentTime}`;

        // Only fire if current time matches AND we haven't alerted yet
        if (t === currentTime && !firedRef.current.has(key)) {
          firedRef.current.add(key);

          const alert: DoseAlert = {
            id: generateAlertId(),
            medicationId: med.id,
            medicationName: med.name,
            dose: med.dose,
            scheduledTime: t,
            firedAt: new Date().toISOString(),
          };

          onAlert(alert);
          sendBrowserNotification(med, t);
        }
      });
    });
  }, [medications, onAlert]);

  // ── Polling interval (30 s) ─────────────────────────────────────
  useEffect(() => {
    // Run once immediately on mount / dependency change
    checkReminders();

    const id = setInterval(checkReminders, 30_000);

    return () => clearInterval(id);
  }, [checkReminders]);

  // ── Clear stale keys every 2 minutes ────────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      // Only keep keys whose time matches current minute
      const now = nowHHMM();
      firedRef.current.forEach((key) => {
        const parts = key.split(":");
        const keyMinute = `${parts[1]}:${parts[2]}`;
        if (keyMinute !== now) firedRef.current.delete(key);
      });
    }, 120_000);

    return () => clearInterval(id);
  }, []);

  // ── Simulate (for hackathon demo) ───────────────────────────────
  const simulateAlert = useCallback(() => {
    if (medications.length === 0) return;

    const med = medications[0]; // first pending medication
    const time = med.times[0] ?? nowHHMM();

    const alert: DoseAlert = {
      id: generateAlertId(),
      medicationId: med.id,
      medicationName: med.name,
      dose: med.dose,
      scheduledTime: time,
      firedAt: new Date().toISOString(),
    };

    onAlert(alert);
    sendBrowserNotification(med, time);
  }, [medications, onAlert]);

  return { simulateAlert };
}
