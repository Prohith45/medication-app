"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import TopBar from "./TopBar";
import BottomNav, { type NavTab } from "./BottomNav";
import TodayScreen from "./TodayScreen";
import MedicinesScreen from "./MedicinesScreen";
import ProgressScreen from "./ProgressScreen";
import HelpScreen from "./HelpScreen";
import AlarmOverlay from "./AlarmOverlay";
import DrugInfoDrawer from "./DrugInfoDrawer";
import AddMedicineModal from "./AddMedicineModal";
import SettingsModal from "./SettingsModal";
import { LanguageProvider, useTranslation } from "./context/LanguageContext";
import { useReminders } from "./useReminders";
import { useAdherence } from "./useAdherence";
import { unlockAudio } from "./utils/alarmSystem";
import {
  type UserProfile,
  DEFAULT_USER_PROFILE,
  PROFILE_STORAGE_KEY,
} from "./types/profile";
import {
  detectInteractions,
  getConflictingMedicationIds,
} from "./services/interactionChecker";
import {
  type Medication,
  type MedicationFormData,
  type DoseAlert,
  type AdherenceRecord,
} from "./types";

const MEDICATIONS_STORAGE_KEY = "medassist_medications_list";
const ADHERENCE_STORAGE_KEY = "medassist_adherence_log";
const STREAK_STORAGE_KEY = "medassist_current_streak";

// Initial reference medications matching the Reassuring Clarity design mockups
const DEFAULT_SAMPLE_MEDICATIONS: Medication[] = [
  {
    id: "med_dolo",
    name: "Dolo 650",
    dose: "650 mg",
    frequency: "daily",
    dosingPattern: "morning",
    times: ["08:00"],
    timingCondition: "Morning (Breakfast)",
    createdAt: new Date().toISOString(),
  },
  {
    id: "med_metformin",
    name: "Metformin",
    dose: "500 mg",
    frequency: "daily",
    dosingPattern: "with-lunch",
    times: ["13:00"],
    timingCondition: "Afternoon (Lunch)",
    createdAt: new Date().toISOString(),
  },
  {
    id: "med_folitrax",
    name: "Folitrax",
    dose: "10 mg",
    frequency: "daily",
    dosingPattern: "evening",
    times: ["18:00"],
    timingCondition: "Evening (Snacks)",
    createdAt: new Date().toISOString(),
  },
  {
    id: "med_atorvastatin",
    name: "Atorvastatin",
    dose: "20 mg",
    frequency: "daily",
    dosingPattern: "night",
    times: ["21:15"],
    timingCondition: "Night (Bedtime)",
    createdAt: new Date().toISOString(),
  },
];

function generateId(): string {
  return `med_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

type NotificationPermissionType = "granted" | "denied" | "default";

function MedicationsDashboard() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<NavTab>("today");
  const [seniorMode, setSeniorMode] = useState(false);
  const [infoDrugName, setInfoDrugName] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // ── Patient & Guardian Profile ──────────────────────────────────
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.patientName && parsed.guardianRelation) {
          setUserProfile(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to load user profile from localStorage", e);
    }
  }, []);

  const handleSaveProfile = (updated: UserProfile) => {
    setUserProfile(updated);
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Failed to save user profile to localStorage", e);
    }
  };

  // ── Medications State ───────────────────────────────────────────
  const [medications, setMedications] = useState<Medication[]>(DEFAULT_SAMPLE_MEDICATIONS);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(MEDICATIONS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMedications(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to load medications from localStorage", e);
    }
  }, []);

  const persistMedications = (updated: Medication[]) => {
    setMedications(updated);
    try {
      localStorage.setItem(MEDICATIONS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Failed to save medications to localStorage", e);
    }
  };

  const handleAddMedication = (
    data: MedicationFormData & { timingCondition?: string; initialStatus?: "due" | "pending" }
  ) => {
    const newMed: Medication = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newMed, ...medications];
    persistMedications(updated);

    // If initial status was due, immediately register an alert for user interaction
    if (data.initialStatus === "due") {
      const alert: DoseAlert = {
        id: `alert_${Date.now()}`,
        medicationId: newMed.id,
        medicationName: newMed.name,
        dose: newMed.dose,
        scheduledTime: newMed.times?.[0] || "08:00",
        firedAt: new Date().toISOString(),
      };
      handleAlert(alert);
    }
  };

  const handleDeleteMedication = (id: string) => {
    persistMedications(medications.filter((m) => m.id !== id));
  };

  const handleClearAllMedications = () => {
    persistMedications([]);
    setActiveAlerts([]);
    setActiveAlarm(null);
    persistStreak(0);
  };

  const handleResetToSampleMedications = () => {
    persistMedications(DEFAULT_SAMPLE_MEDICATIONS);
    persistStreak(10);
  };

  // ── Dynamic Streak State ────────────────────────────────────────
  const [streak, setStreak] = useState<number>(10);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STREAK_STORAGE_KEY);
      if (saved !== null) {
        const val = parseInt(saved, 10);
        if (!isNaN(val)) setStreak(val);
      }
    } catch (e) {
      console.warn("Failed to load streak from localStorage", e);
    }
  }, []);

  const persistStreak = (updater: number | ((prev: number) => number)) => {
    setStreak((prev) => {
      const nextVal = typeof updater === "function" ? updater(prev) : updater;
      try {
        localStorage.setItem(STREAK_STORAGE_KEY, String(nextVal));
      } catch (e) {
        console.warn("Failed to save streak to localStorage", e);
      }
      return nextVal;
    });
  };

  // ── Adherence Log State ─────────────────────────────────────────
  const [adherenceLog, setAdherenceLog] = useState<AdherenceRecord[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(ADHERENCE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setAdherenceLog(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to load adherence log from localStorage", e);
    }
  }, []);

  const persistAdherence = (updated: AdherenceRecord[]) => {
    setAdherenceLog(updated);
    try {
      localStorage.setItem(ADHERENCE_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Failed to save adherence log to localStorage", e);
    }
  };

  const compliance = useAdherence(adherenceLog);

  // ── Missed Dose Tracking & Auto-Telegram ──────────────────────────
  const [missedDoseCount, setMissedDoseCount] = useState(0);
  const [autoAlertSent, setAutoAlertSent] = useState(false);

  // ── Active Alerts & Siren Alarm Overlay ─────────────────────────
  const [activeAlerts, setActiveAlerts] = useState<DoseAlert[]>([]);
  const [activeAlarm, setActiveAlarm] = useState<DoseAlert | null>(null);
  const [alarmEscalationSec, setAlarmEscalationSec] = useState<number>(20);

  const handleAlert = useCallback((alert: DoseAlert) => {
    unlockAudio();
    setActiveAlerts((prev) => {
      if (
        prev.some(
          (a) =>
            a.medicationId === alert.medicationId &&
            a.scheduledTime === alert.scheduledTime
        )
      ) {
        return prev;
      }
      return [alert, ...prev];
    });
    setActiveAlarm(alert);
  }, []);

  const dismissAlert = (alertId?: string) => {
    if (!alertId) return;
    setActiveAlerts((prev) => prev.filter((a) => a.id !== alertId));
    if (activeAlarm?.id === alertId) {
      setActiveAlarm(null);
      setAlarmEscalationSec(20);
    }
  };

  // Record a dose as Taken (Increments streak immediately)
  const handleTakeDose = useCallback(
    (med: Medication, scheduledTime: string, alertId?: string) => {
      unlockAudio();
      const now = new Date();
      const record: AdherenceRecord = {
        id: `adh_${Date.now()}`,
        medicationId: med.id,
        medicationName: med.name,
        date: now.toISOString().slice(0, 10),
        time: scheduledTime,
        status: "taken",
        respondedAt: now.toISOString(),
      };
      persistAdherence([record, ...adherenceLog]);
      persistStreak((prev) => prev + 1); // Dynamic +1 immediate streak increment
      dismissAlert(alertId);
      if (activeAlarm?.id === alertId) {
        setActiveAlarm(null);
      }
    },
    [adherenceLog, activeAlarm]
  );

  // Skip / Not Yet — records skipped status, resets streak to 0, auto-escalates at 2+
  const handleSkipDose = useCallback(
    (med: Medication, scheduledTime: string, alertId?: string) => {
      const now = new Date();
      const record: AdherenceRecord = {
        id: `adh_${Date.now()}`,
        medicationId: med.id,
        medicationName: med.name,
        date: now.toISOString().slice(0, 10),
        time: scheduledTime,
        status: "skipped",
        respondedAt: now.toISOString(),
      };
      persistAdherence([record, ...adherenceLog]);
      persistStreak(0); // Streak resets to 0 if medicine is skipped!
      dismissAlert(alertId);
      if (activeAlarm?.id === alertId) {
        setActiveAlarm(null);
      }

      const newMissedCount = missedDoseCount + 1;
      setMissedDoseCount(newMissedCount);

      // Auto-escalate to Telegram if 2+ doses skipped
      if (newMissedCount >= 2 && !autoAlertSent) {
        setAutoAlertSent(true);
        fetch("/api/telegram-alert", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            patientName: userProfile.patientName,
            guardianName: userProfile.guardianName,
            guardianRelation: userProfile.guardianRelation,
            message: `⚠️ AUTO-ALERT: ${userProfile.patientName} has skipped ${newMissedCount} doses today. Last skipped: ${med.name} (${scheduledTime}). Immediate attention required.`,
          }),
        }).catch((err) => console.warn("Auto-escalation failed:", err));
      }
    },
    [adherenceLog, activeAlarm, missedDoseCount, autoAlertSent, userProfile]
  );

  // Background reminder scheduler
  useReminders({
    medications,
    onAlert: handleAlert,
  });

  // Test Siren & Telegram Escalation
  const testGuardianEscalation = useCallback(
    (timeoutSec: number = 20) => {
      setAlarmEscalationSec(timeoutSec);
      unlockAudio();
      const targetMed = medications[0] || DEFAULT_SAMPLE_MEDICATIONS[0];
      const alert: DoseAlert = {
        id: `alert_test_${Date.now()}`,
        medicationId: targetMed.id,
        medicationName: targetMed.name,
        dose: targetMed.dose,
        scheduledTime: targetMed.times?.[0] || "08:00",
        firedAt: new Date().toISOString(),
      };
      handleAlert(alert);
    },
    [medications, handleAlert]
  );

  // Emergency manual trigger — sounds siren & dispatches telegram alert
  const triggerEmergencyAlert = useCallback(() => {
    unlockAudio();
    testGuardianEscalation(20);
    fetch("/api/telegram-alert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientName: userProfile.patientName,
        guardianName: userProfile.guardianName,
        guardianRelation: userProfile.guardianRelation,
        message: `🚨 EMERGENCY ALERT: ${userProfile.patientName} has triggered an urgent emergency alarm from MedAssist AI! Please call or check in immediately.`,
      }),
    }).catch((err) => console.warn("Emergency alert failed:", err));
  }, [testGuardianEscalation, userProfile]);

  // ── Device OS Notification Permissions ─────────────────────────
  const [notifPermission, setNotifPermission] =
    useState<NotificationPermissionType>("default");

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotifPermission(Notification.permission as NotificationPermissionType);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    const perm = await Notification.requestPermission();
    setNotifPermission(perm as NotificationPermissionType);
  };

  // ── Pairwise Drug Interactions ──────────────────────────────────
  const detectedInteractions = useMemo(
    () => detectInteractions(medications),
    [medications]
  );
  const conflictingIds = useMemo(
    () => getConflictingMedicationIds(detectedInteractions),
    [detectedInteractions]
  );

  return (
    <div
      className={`min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center selection:bg-emerald-100 selection:text-emerald-900 pb-24 lg:pb-0 ${
        seniorMode ? "text-lg" : ""
      }`}
    >
      {/* ── Responsive Container ── */}
      <div className="w-full min-h-screen flex flex-col bg-slate-50 relative">
        {/* Modern Top Header Navigation Bar */}
        <TopBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          userProfile={userProfile}
          onEmergencyClick={triggerEmergencyAlert}
          onSettingsClick={() => setIsSettingsOpen(true)}
          onOpenAddMedicine={() => setIsAddModalOpen(true)}
        />

        {/* Dynamic Screen View based on Active Tab */}
        <div className="flex-1 w-full">
          {activeTab === "today" && (
            <TodayScreen
              medications={medications}
              adherenceLog={adherenceLog}
              activeAlerts={activeAlerts}
              streak={streak}
              monthlyPercentage={compliance.monthlyPercentage}
              monthlyTaken={compliance.monthlyTaken}
              monthlyTotal={compliance.monthlyTotal}
              userProfile={userProfile}
              seniorMode={seniorMode}
              missedDoseCount={missedDoseCount}
              autoAlertSent={autoAlertSent}
              detectedInteractions={detectedInteractions}
              onTakeDose={handleTakeDose}
              onSkipDose={handleSkipDose}
              onOpenAddMedicine={() => setIsAddModalOpen(true)}
              onTestAlarm={testGuardianEscalation}
              onTriggerEmergency={triggerEmergencyAlert}
              onOpenDrugInfo={(drug) => setInfoDrugName(drug)}
            />
          )}

          {activeTab === "medicines" && (
            <MedicinesScreen
              medications={medications}
              detectedInteractions={detectedInteractions}
              conflictingIds={conflictingIds}
              onAddMedication={handleAddMedication}
              onDeleteMedication={handleDeleteMedication}
              onOpenDrugInfo={(drug) => setInfoDrugName(drug)}
            />
          )}

          {activeTab === "progress" && (
            <ProgressScreen
              streak={streak}
              monthlyPercentage={compliance.monthlyPercentage}
              monthlyTaken={compliance.monthlyTaken}
              monthlyTotal={compliance.monthlyTotal}
              adherenceLog={adherenceLog}
            />
          )}

          {activeTab === "help" && (
            <HelpScreen
              userProfile={userProfile}
              onSaveProfile={handleSaveProfile}
              onTestAlarm={testGuardianEscalation}
              notifPermission={notifPermission}
              onRequestNotification={requestNotificationPermission}
            />
          )}
        </div>

        {/* Mobile Navigation Bar: Shown ONLY on mobile (< 1024px) */}
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Custom Medicine Logging Modal */}
        <AddMedicineModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddMedication}
        />

        {/* Settings Modal (Edit Profile & Caregiver + Clear All / Reset Meds) */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          userProfile={userProfile}
          onSaveProfile={handleSaveProfile}
          onClearAllMedications={handleClearAllMedications}
          onResetToSampleMedications={handleResetToSampleMedications}
          medicationCount={medications.length}
        />

        {/* Drug Info Drawer (3-Tier Clinical Explainer with Typo-Tolerance) */}
        <DrugInfoDrawer
          drugName={infoDrugName}
          onClose={() => setInfoDrugName(null)}
        />

        {/* Siren Alarm Full-screen Overlay with Telegram Escalation */}
        <AlarmOverlay
          alert={activeAlarm}
          userProfile={userProfile}
          onConfirm={(alert) => {
            const med =
              medications.find((m) => m.id === alert.medicationId) ||
              DEFAULT_SAMPLE_MEDICATIONS[0];
            handleTakeDose(med, alert.scheduledTime, alert.id);
            setAlarmEscalationSec(20);
          }}
          escalationTimeoutSec={alarmEscalationSec}
        />

        {/* ── Subtle Modern Footer Disclaimer ── */}
        <footer className="w-full border-t border-slate-200 bg-white/70 py-4 px-4 text-center mt-auto">
          <p className="text-xs text-slate-400 font-medium max-w-4xl mx-auto">
            {t.disclaimerText || "Routine adherence assistant. Always consult your healthcare provider before modifying medical treatments."}
          </p>
        </footer>
      </div>
    </div>
  );
}

export default function MedicationsPage() {
  return (
    <LanguageProvider>
      <MedicationsDashboard />
    </LanguageProvider>
  );
}
