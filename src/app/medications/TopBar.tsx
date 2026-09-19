"use client";

import React from "react";
import { useTranslation } from "./context/LanguageContext";
import { type NavTab } from "./BottomNav";
import { type UserProfile } from "./types/profile";

interface TopBarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  userProfile: UserProfile;
  seniorMode?: boolean;
  onToggleSeniorMode?: () => void;
  onEmergencyClick?: () => void;
  onSettingsClick?: () => void;
  onOpenAddMedicine?: () => void;
}

export default function TopBar({
  activeTab,
  onTabChange,
  userProfile,
  onEmergencyClick,
  onSettingsClick,
  onOpenAddMedicine,
}: TopBarProps) {
  const { t, language, setLanguage } = useTranslation();

  const navItems: { id: NavTab; label: string; icon: string }[] = [
    { id: "today", label: t.tabToday || "Today", icon: "calendar_today" },
    { id: "medicines", label: t.tabMedicines || "Medicines", icon: "medication" },
    { id: "progress", label: t.tabProgress || "Progress", icon: "monitoring" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between gap-3 sm:gap-6">
        {/* Brand Logo, App Name & Patient Profile */}
        <div
          onClick={() => onTabChange("today")}
          className="flex items-center gap-3 cursor-pointer shrink-0 select-none group"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs group-hover:bg-emerald-700 transition-colors">
            <span
              className="material-symbols-outlined text-[24px] sm:text-[26px] text-white leading-none"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              medication
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight">
              {t.appTitle || "MedAssist"}
            </span>
            <span className="text-xs sm:text-sm font-medium text-slate-500 leading-none mt-0.5">
              👤 {userProfile.patientName || "Rohith"} (Caregiver: {userProfile.guardianRelation || "Father"})
            </span>
          </div>
        </div>

        {/* Center Navigation Pills (Desktop) */}
        <nav
          aria-label="Desktop Navigation"
          className="hidden md:flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/60"
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-all duration-150 cursor-pointer select-none ${
                  isActive
                    ? "bg-white text-emerald-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[18px] leading-none ${
                    isActive ? "text-emerald-600" : "text-slate-400"
                  }`}
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Language Switch, Emergency, Add Medicine & Settings */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Language Toggle: Clean Segmented Switch */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/70">
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                language === "en"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage("te")}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                language === "te"
                  ? "bg-white text-emerald-700 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              తెలుగు
            </button>
          </div>

          {/* Settings Button */}
          {onSettingsClick && (
            <button
              type="button"
              onClick={onSettingsClick}
              className="p-2 sm:px-2.5 sm:py-1.5 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl flex items-center gap-1 text-xs font-semibold transition-all cursor-pointer"
              title={t.settings || "Settings"}
              aria-label="Open Settings"
            >
              <span className="material-symbols-outlined text-[19px] leading-none">settings</span>
            </button>
          )}

          {/* Emergency Alert Button */}
          <button
            type="button"
            onClick={onEmergencyClick}
            className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer active:scale-95"
            aria-label="Trigger Emergency Caregiver Alert"
          >
            <span className="material-symbols-outlined text-rose-600 text-[18px] leading-none">
              emergency
            </span>
            <span className="hidden sm:inline font-bold">
              {language === "te" ? "అత్యవసర అలర్ట్" : "Emergency Alert"}
            </span>
          </button>

          {/* Prominent Add Medicine Button */}
          {onOpenAddMedicine && (
            <button
              type="button"
              onClick={onOpenAddMedicine}
              className="px-3.5 sm:px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center gap-1.5 text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer active:scale-95"
              aria-label="Add new medication"
            >
              <span className="material-symbols-outlined text-white text-[18px] leading-none">
                add
              </span>
              <span className="font-bold whitespace-nowrap">
                {language === "te" ? "మందు జోడించండి" : "Add Medicine"}
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
