"use client";

import { useState, useEffect } from "react";
import { User, Users, X, Check, HeartHandshake, ShieldAlert } from "lucide-react";
import {
  type UserProfile,
  type GuardianRelationship,
  GUARDIAN_RELATIONSHIPS,
} from "./types/profile";

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (updatedProfile: UserProfile) => void;
}

export default function ProfileSettingsModal({
  isOpen,
  onClose,
  profile,
  onSave,
}: ProfileSettingsModalProps) {
  const [patientName, setPatientName] = useState(profile.patientName);
  const [guardianName, setGuardianName] = useState(profile.guardianName);
  const [guardianRelation, setGuardianRelation] = useState<GuardianRelationship>(
    profile.guardianRelation
  );
  const [savedBadge, setSavedBadge] = useState(false);

  // Sync state when modal opens or profile prop changes
  useEffect(() => {
    if (isOpen) {
      setPatientName(profile.patientName);
      setGuardianName(profile.guardianName);
      setGuardianRelation(profile.guardianRelation);
      setSavedBadge(false);
    }
  }, [isOpen, profile]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      patientName: patientName.trim() || "Rohith",
      guardianName: guardianName.trim() || "Family",
      guardianRelation,
    };
    onSave(updated);
    setSavedBadge(true);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-slide-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 flex items-center justify-between text-white">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-white/20 rounded-xl">
                <HeartHandshake className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Patient &amp; Guardian Profile</h3>
                <p className="text-xs text-blue-100">
                  Caregiver escalation &amp; emergency contact settings
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/20 transition cursor-pointer text-white/80 hover:text-white"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Patient Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" />
                Patient Name
              </label>
              <input
                type="text"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. Rohith"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium text-slate-800 placeholder-slate-400"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                The name of the individual taking the medications.
              </p>
            </div>

            {/* Guardian Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                Guardian / Caregiver Name
              </label>
              <input
                type="text"
                required
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                placeholder="e.g. Anand"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium text-slate-800 placeholder-slate-400"
              />
            </div>

            {/* Guardian Relationship */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5 text-purple-600" />
                Guardian Relationship
              </label>
              <select
                value={guardianRelation}
                onChange={(e) =>
                  setGuardianRelation(e.target.value as GuardianRelationship)
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium text-slate-800 cursor-pointer"
              >
                {GUARDIAN_RELATIONSHIPS.map((rel) => (
                  <option key={rel} value={rel}>
                    {rel}
                  </option>
                ))}
              </select>
            </div>

            {/* Escalation Preview Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                <span>Telegram Alert Preview</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                If an alarm is ignored, Telegram will alert{" "}
                <span className="font-bold text-indigo-700">
                  {guardianRelation} ({guardianName || "Family"})
                </span>{" "}
                to check on{" "}
                <span className="font-bold text-blue-700">
                  {patientName || "Rohith"}
                </span>
                .
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold rounded-xl transition shadow-md cursor-pointer"
              >
                {savedBadge ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save Profile</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
