"use client";

import React from "react";
import { useTranslation } from "./context/LanguageContext";

export type NavTab = "today" | "medicines" | "progress" | "help";

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { t } = useTranslation();

  const tabs: { id: NavTab; label: string; icon: string }[] = [
    { id: "today", label: t.tabToday || "Today", icon: "calendar_today" },
    { id: "medicines", label: t.tabMedicines || "Medicines", icon: "medication" },
    { id: "progress", label: t.tabProgress || "Progress", icon: "monitoring" },
    { id: "help", label: t.tabHelp || "Caregiver", icon: "help" },
  ];

  return (
    <nav
      aria-label="Main Navigation"
      className="fixed bottom-0 left-0 right-0 w-full z-50 flex lg:hidden justify-around items-center px-2 py-2 border-t border-slate-200 bg-white/95 backdrop-blur-md shadow-lg"
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            aria-current={isActive ? "page" : undefined}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all duration-150 cursor-pointer select-none ${
              isActive
                ? "text-emerald-700 font-bold"
                : "text-slate-500 hover:text-slate-800 font-medium"
            }`}
          >
            <span
              className={`material-symbols-outlined text-[24px] leading-none ${
                isActive ? "text-emerald-600 scale-110" : "text-slate-400"
              }`}
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {tab.icon}
            </span>
            <span className="text-[11px] font-semibold mt-1">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
