"use client";

import { Globe } from "lucide-react";
import { useTranslation } from "./context/LanguageContext";

interface LanguageToggleProps {
  seniorMode?: boolean;
}

export default function LanguageToggle({ seniorMode = false }: LanguageToggleProps) {
  const { language, setLanguage } = useTranslation();

  return (
    <div
      className={`inline-flex items-center rounded-full transition-all ${
        seniorMode
          ? "p-1.5 bg-blue-50 border-2 border-blue-600 shadow-sm"
          : "p-1 bg-slate-100 border border-slate-200"
      }`}
      role="group"
      aria-label="Language selection"
    >
      <div className="pl-2 pr-1.5 text-slate-400 hidden sm:flex items-center">
        <Globe className={seniorMode ? "w-5 h-5 text-blue-700" : "w-3.5 h-3.5 text-slate-500"} />
      </div>

      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`rounded-full transition font-bold cursor-pointer ${
          seniorMode
            ? `px-3.5 py-2 text-base ${
                language === "en"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-700 hover:bg-blue-100"
              }`
            : `px-2.5 py-1 text-xs ${
                language === "en"
                  ? "bg-white text-blue-700 shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`
        }`}
        aria-pressed={language === "en"}
      >
        English
      </button>

      <span className={`text-slate-300 select-none ${seniorMode ? "text-lg font-bold px-1" : "text-xs px-0.5"}`}>
        |
      </span>

      <button
        type="button"
        onClick={() => setLanguage("te")}
        className={`rounded-full transition font-bold cursor-pointer ${
          seniorMode
            ? `px-3.5 py-2 text-base ${
                language === "te"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-700 hover:bg-blue-100"
              }`
            : `px-2.5 py-1 text-xs ${
                language === "te"
                  ? "bg-white text-blue-700 shadow-xs border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`
        }`}
        aria-pressed={language === "te"}
      >
        తెలుగు
      </button>
    </div>
  );
}
