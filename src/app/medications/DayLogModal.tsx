"use client";

import React from "react";
import { useTranslation } from "./context/LanguageContext";

export interface DayLogModalItem {
  dayNumber: number;
  dateKey?: string;
  dateIso?: string;
  status: "taken" | "partial" | "pending" | "today";
  isToday?: boolean;
  logDetails?: string[];
}

interface DayLogModalProps {
  day?: DayLogModalItem | null;
  item?: DayLogModalItem | null;
  onClose: () => void;
}

export default function DayLogModal({ day, item, onClose }: DayLogModalProps) {
  const { language } = useTranslation();
  const currentDay = day || item;

  if (!currentDay) return null;

  const isTaken = currentDay.status === "taken";
  const isPartial = currentDay.status === "partial";
  const isToday = currentDay.isToday ?? currentDay.dayNumber === 28;
  const dateString = currentDay.dateKey || currentDay.dateIso || new Date().toISOString().split("T")[0];

  const formattedDate = new Intl.DateTimeFormat(language === "te" ? "te-IN" : "en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateString + "T00:00:00"));

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 shadow-xl rounded-2xl max-w-md w-full p-6 flex flex-col gap-5 text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base shadow-2xs ${
                isTaken
                  ? "bg-emerald-600 text-white"
                  : isPartial
                  ? "bg-amber-100 text-amber-900 border border-amber-200"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              #{currentDay.dayNumber}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-snug">
                {isToday
                  ? language === "te" ? "ఈ రోజు లాగ్ (Day 28)" : "Today's Log (Day 28)"
                  : `Day ${currentDay.dayNumber} Summary`}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {formattedDate}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center text-sm font-bold cursor-pointer transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Status Banner */}
        <div
          className={`px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium ${
            isTaken
              ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
              : isPartial
              ? "bg-amber-50 text-amber-900 border border-amber-200"
              : "bg-slate-100 text-slate-800 border border-slate-200"
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">
            {isTaken ? "check_circle" : isPartial ? "schedule" : "pending_actions"}
          </span>
          <div>
            <p className="font-bold">
              {isTaken
                ? language === "te" ? "పూర్తిగా తీసుకోబడింది (All Taken)" : "All Doses Taken"
                : isPartial
                ? language === "te" ? "పాక్షికంగా తీసుకోబడింది (Partial)" : "Partial Intake / Skipped"
                : language === "te" ? "పెండింగ్‌లో ఉంది" : "Pending Scheduled Doses"}
            </p>
            <p className="text-xs opacity-80 mt-0.5">
              {isTaken
                ? "100% adherence recorded on this calendar day."
                : isPartial
                ? "At least one dose was skipped or taken late."
                : "Active day awaiting dose confirmation."}
            </p>
          </div>
        </div>

        {/* Log Entries List */}
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {language === "te" ? "మందుల వివరాలు" : "Dose Activity Records"}
          </h4>

          {currentDay.logDetails && currentDay.logDetails.length > 0 ? (
            <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
              {currentDay.logDetails.map((log, index) => {
                const isSkippedEntry = log.toLowerCase().includes("skipped");
                return (
                  <div
                    key={index}
                    className={`p-3 rounded-xl text-xs sm:text-sm font-medium border flex items-center gap-2.5 ${
                      isSkippedEntry
                        ? "bg-amber-50/50 border-amber-200 text-amber-900"
                        : "bg-slate-50 border-slate-200 text-slate-800"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px] text-slate-400">
                      {isSkippedEntry ? "cancel" : "check"}
                    </span>
                    <span>{log}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No activity logs recorded for this day.</p>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition-all cursor-pointer"
        >
          Close Summary
        </button>
      </div>
    </div>
  );
}
