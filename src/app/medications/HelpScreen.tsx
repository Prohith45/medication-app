"use client";

import React, { useState } from "react";
import { useTranslation } from "./context/LanguageContext";
import { type UserProfile, type GuardianRelationship } from "./types/profile";

interface HelpScreenProps {
  userProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onTestAlarm: () => void;
  notifPermission: "granted" | "denied" | "default";
  onRequestNotification: () => void;
}

export default function HelpScreen({
  userProfile,
  onSaveProfile,
  onTestAlarm,
  notifPermission,
  onRequestNotification,
}: HelpScreenProps) {
  const { t, language, setLanguage } = useTranslation();

  // Profile edit state
  const [patientName, setPatientName] = useState(userProfile.patientName);
  const [guardianName, setGuardianName] = useState(userProfile.guardianName);
  const [guardianRelation, setGuardianRelation] = useState<GuardianRelationship>(
    userProfile.guardianRelation
  );
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      patientName: patientName.trim() || "Rohith",
      guardianName: guardianName.trim() || "Family",
      guardianRelation,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8 animate-fade-in">
      {/* ── Page Header ── */}
      <section className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t.emergencyHelp || "Emergency & Support"}
        </h1>
        <p className="text-sm sm:text-base text-slate-500 font-medium">
          Direct caregiver contact, emergency alarms, and profile settings.
        </p>
      </section>

      {/* ── Desktop 2-Column Grid (lg:grid-cols-12) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Urgent Actions, Language & Notifications (lg:col-span-6) */}
        <div className="col-span-1 lg:col-span-6 flex flex-col gap-6">
          {/* Emergency Action Buttons */}
          <section className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col gap-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Immediate Caregiver Actions
            </h2>

            {/* Test Siren & Telegram Escalation */}
            <button
              type="button"
              onClick={onTestAlarm}
              className="w-full py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl px-5 flex items-center justify-center gap-2.5 font-bold text-sm sm:text-base transition-all cursor-pointer active:scale-[0.99]"
            >
              <span className="material-symbols-outlined text-[20px] leading-none text-rose-600">
                warning
              </span>
              <span>
                {t.testAlarmFull || "Test 880Hz Siren & Telegram Alert"}
              </span>
            </button>

            {/* Call Guardian */}
            <a
              href="tel:108"
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-5 flex items-center justify-center gap-2.5 font-bold text-sm sm:text-base shadow-xs transition-all active:scale-[0.99]"
            >
              <span className="material-symbols-outlined text-[20px] leading-none text-white">
                call
              </span>
              <span>
                Call Caregiver ({userProfile.guardianName})
              </span>
            </a>
          </section>

          {/* Language Switcher Section (English / తెలుగు) */}
          <section className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col gap-3">
            <h2 className="text-sm font-bold text-slate-900">
              App Language / భాష
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`py-3 rounded-xl border text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  language === "en"
                    ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <span>English</span>
                {language === "en" && <span className="text-xs">✓</span>}
              </button>
              <button
                type="button"
                onClick={() => setLanguage("te")}
                className={`py-3 rounded-xl border text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  language === "te"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                <span>తెలుగు</span>
                {language === "te" && <span className="text-xs">✓</span>}
              </button>
            </div>
          </section>

          {/* Notifications Status */}
          <section className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <h3 className="text-sm font-bold text-slate-900">
                Device Dose Notifications
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {notifPermission === "granted"
                  ? "Active for scheduled medication times"
                  : notifPermission === "denied"
                  ? "Blocked in browser permissions"
                  : "Enable background dose reminders"}
              </p>
            </div>

            {notifPermission !== "granted" ? (
              <button
                type="button"
                onClick={onRequestNotification}
                className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-xs"
              >
                Enable
              </button>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Active ✓
              </span>
            )}
          </section>

          {/* Safety Disclaimer Box */}
          <div className="bg-amber-50/50 border border-amber-200/70 rounded-2xl p-4 text-xs text-amber-900 font-medium leading-relaxed">
            {t.disclaimerText || "MedAssist AI is designed to support daily adherence routines. In medical emergencies, always call emergency services immediately."}
          </div>
        </div>

        {/* Right Column: Patient & Caregiver Profile (lg:col-span-6) */}
        <div className="col-span-1 lg:col-span-6">
          <section className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs flex flex-col gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Patient & Caregiver Profile
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                These credentials appear in urgent Telegram dispatch alerts when doses are missed.
              </p>
            </div>

            <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4 mt-1">
              {/* Patient Name */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="patient-name" className="text-xs sm:text-sm font-semibold text-slate-700">
                  Patient Name
                </label>
                <input
                  id="patient-name"
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 transition-all"
                  required
                />
              </div>

              {/* Guardian Name */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="guardian-name" className="text-xs sm:text-sm font-semibold text-slate-700">
                  Guardian / Caregiver Name
                </label>
                <input
                  id="guardian-name"
                  type="text"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 transition-all"
                  required
                />
              </div>

              {/* Relationship */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="guardian-relation" className="text-xs sm:text-sm font-semibold text-slate-700">
                  Relationship to Patient
                </label>
                <select
                  id="guardian-relation"
                  value={guardianRelation}
                  onChange={(e) =>
                    setGuardianRelation(e.target.value as GuardianRelationship)
                  }
                  className="w-full px-3.5 py-2.5 text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-900 transition-all cursor-pointer"
                >
                  {[
                    "Father",
                    "Mother",
                    "Son",
                    "Daughter",
                    "Wife",
                    "Husband",
                    "Caregiver",
                  ].map((rel) => (
                    <option key={rel} value={rel}>
                      {rel}
                    </option>
                  ))}
                </select>
              </div>

              {saveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-semibold text-xs sm:text-sm text-center flex items-center justify-center gap-1.5 animate-fade-in">
                  <span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span>
                  <span>Profile details saved successfully</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 mt-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-xs active:scale-[0.99] transition-all cursor-pointer"
              >
                Save Profile Settings
              </button>
            </form>
          </section>
        </div>
      </div>

      <div className="pt-2 pb-4 text-center">
        <p className="text-xs text-slate-400 font-medium">
          {t.appHelpsRemember || "MedAssist AI tracks routine consistency for caregiver awareness and physician review."}
        </p>
      </div>
    </main>
  );
}
