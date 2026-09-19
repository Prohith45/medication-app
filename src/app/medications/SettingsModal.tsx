"use client";

import React, { useState } from "react";
import {
  type UserProfile,
  GUARDIAN_RELATIONSHIPS,
  type GuardianRelationship,
} from "./types/profile";
import { useTranslation } from "./context/LanguageContext";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onClearAllMedications: () => void;
  onResetToSampleMedications: () => void;
  medicationCount: number;
}

export default function SettingsModal({
  isOpen,
  onClose,
  userProfile,
  onSaveProfile,
  onClearAllMedications,
  onResetToSampleMedications,
  medicationCount,
}: SettingsModalProps) {
  const { t, language } = useTranslation();

  const [patientName, setPatientName] = useState(userProfile.patientName);
  const [guardianName, setGuardianName] = useState(userProfile.guardianName);
  const [guardianRelation, setGuardianRelation] = useState<GuardianRelationship>(
    userProfile.guardianRelation
  );
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (!isOpen) return null;

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      patientName: patientName.trim() || "Rohith",
      guardianName: guardianName.trim() || "Family",
      guardianRelation,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleClearClick = () => {
    if (!showClearConfirm) {
      setShowClearConfirm(true);
      return;
    }
    onClearAllMedications();
    setShowClearConfirm(false);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200/80 rounded-3xl max-w-lg w-full p-6 sm:p-8 flex flex-col gap-6 text-slate-900 shadow-xl my-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[24px]">settings</span>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                {t.settings || "Settings"}
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-500">
                {language === "te" ? "ప్రొఫైల్ & మందుల నిర్వహణ" : "Profile & Medication Management"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-sm font-bold cursor-pointer transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Section 1: Patient & Caretaker Edit */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-[22px]">
              person_edit
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {t.editProfile || "Edit Profile & Caregiver"}
            </h3>
          </div>

          <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
            {/* Patient Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="settings-patient-name" className="text-xs sm:text-sm font-semibold text-slate-700">
                {t.patientNameLabel || "Patient Name"}
              </label>
              <input
                id="settings-patient-name"
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. Rohith"
                className="w-full px-3.5 py-2.5 text-sm sm:text-base font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>

            {/* Caretaker / Guardian Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="settings-guardian-name" className="text-xs sm:text-sm font-semibold text-slate-700">
                {t.guardianNameLabel || "Caregiver / Guardian Name"}
              </label>
              <input
                id="settings-guardian-name"
                type="text"
                required
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                placeholder="e.g. Family, Dr. Rao"
                className="w-full px-3.5 py-2.5 text-sm sm:text-base font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>

            {/* Relationship */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="settings-relation" className="text-xs sm:text-sm font-semibold text-slate-700">
                {t.relationshipLabel || "Relationship"}
              </label>
              <select
                id="settings-relation"
                value={guardianRelation}
                onChange={(e) =>
                  setGuardianRelation(e.target.value as GuardianRelationship)
                }
                className="w-full px-3.5 py-2.5 text-sm sm:text-base font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer"
              >
                {GUARDIAN_RELATIONSHIPS.map((rel) => (
                  <option key={rel} value={rel}>
                    {rel}
                  </option>
                ))}
              </select>
            </div>

            {/* Save Profile Button */}
            <button
              type="submit"
              className="w-full py-3 mt-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm sm:text-base font-semibold rounded-xl shadow-xs active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">save</span>
              <span>{t.saveProfile || "Save Profile"}</span>
            </button>

            {savedSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-fade-in">
                <span className="material-symbols-outlined text-emerald-600 text-[20px]">check_circle</span>
                <span>{t.profileSaved || "Profile saved successfully!"}</span>
              </div>
            )}
          </form>
        </section>

        <div className="w-full h-px bg-slate-100" />

        {/* Section 2: Reset / Clear All Medications */}
        <section className="bg-slate-50/70 border border-slate-200/70 rounded-2xl p-4 sm:p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-rose-600 text-[20px]">
                delete_sweep
              </span>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                {t.clearAllMedicines || "Clear All Medications"}
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
              {medicationCount} {medicationCount === 1 ? "medicine" : "medicines"}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
            {t.clearAllConfirm ||
              "Are you sure you want to clear all medications? This will remove all items from your active schedule."}
          </p>

          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <button
              type="button"
              onClick={handleClearClick}
              className={`flex-1 py-2.5 px-3 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                showClearConfirm
                  ? "bg-rose-600 text-white shadow-xs hover:bg-rose-700 animate-pulse"
                  : "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/70"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
              <span>
                {showClearConfirm
                  ? language === "te"
                    ? "ఖచ్చితంగా తొలగించండి (Confirm)"
                    : "Confirm Clear All"
                  : language === "te"
                  ? "అన్నీ తొలగించండి (Clear All)"
                  : "Clear All Medicines"}
              </span>
            </button>

            {showClearConfirm && (
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="py-2.5 px-3 bg-white border border-slate-200 rounded-xl font-semibold text-xs sm:text-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                onResetToSampleMedications();
                onClose();
              }}
              className="py-2.5 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[18px] text-slate-500">restart_alt</span>
              <span>{t.resetDefaults || "Sample Meds"}</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
