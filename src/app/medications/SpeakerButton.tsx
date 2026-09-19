"use client";

import React, { useState } from "react";
import { speakDoseInstruction } from "./utils/speech";
import { useTranslation } from "./context/LanguageContext";

interface SpeakerButtonProps {
  name: string;
  dose: string;
  timingCondition?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function SpeakerButton({
  name,
  dose,
  timingCondition,
  className = "",
  size = "md",
}: SpeakerButtonProps) {
  const { language } = useTranslation();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSpeaking(true);
    speakDoseInstruction({
      name,
      dose,
      timingCondition,
      language,
    });
    setTimeout(() => setIsSpeaking(false), 2500);
  };

  const dimensions =
    size === "lg"
      ? "w-11 h-11 min-w-[44px] min-h-[44px]"
      : size === "sm"
      ? "w-9 h-9 min-w-[36px] min-h-[36px]"
      : "w-10 h-10 min-w-[40px] min-h-[40px]";

  const iconSize =
    size === "lg" ? "text-[24px]" : size === "sm" ? "text-[18px]" : "text-[20px]";

  return (
    <button
      type="button"
      onClick={handleSpeak}
      title={
        language === "te"
          ? "మందుల వివరాలను గట్టిగా వినండి (Audio Read)"
          : "Listen to dose instructions aloud"
      }
      aria-label={`Listen to ${name} dose instructions`}
      className={`inline-flex items-center justify-center rounded-xl transition-all duration-150 cursor-pointer select-none active:scale-95 ${dimensions} ${
        isSpeaking
          ? "bg-emerald-100 text-emerald-800 border border-emerald-300 ring-2 ring-emerald-400 animate-pulse"
          : "bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200/80 shadow-2xs"
      } ${className}`}
    >
      <span
        className={`material-symbols-outlined leading-none ${iconSize}`}
        style={isSpeaking ? { fontVariationSettings: "'FILL' 1" } : undefined}
      >
        {isSpeaking ? "volume_up" : "volume_down_alt"}
      </span>
    </button>
  );
}
