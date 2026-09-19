"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Plus,
  Clock,
  X,
  Pill,
  Search,
} from "lucide-react";
import {
  type MedicationFormData,
  type Frequency,
  type DosingPattern,
  COMMON_MEDICATIONS,
  FREQUENCY_LABELS,
  DOSING_PATTERN_LABELS,
} from "./types";

interface MedicationFormProps {
  onAdd: (data: MedicationFormData) => void;
  editingData?: MedicationFormData | null;
  onCancelEdit?: () => void;
}

const DEFAULT_FORM: MedicationFormData = {
  name: "",
  dose: "",
  frequency: "daily",
  dosingPattern: "morning",
  times: ["08:00"],
};

export default function MedicationForm({
  onAdd,
  editingData,
  onCancelEdit,
}: MedicationFormProps) {
  const [form, setForm] = useState<MedicationFormData>(
    editingData ?? DEFAULT_FORM
  );
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);

  // Sync if editingData changes
  useEffect(() => {
    if (editingData) setForm(editingData);
  }, [editingData]);

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleNameChange = (value: string) => {
    setForm((f) => ({ ...f, name: value }));
    if (value.trim().length > 0) {
      const filtered = COMMON_MEDICATIONS.filter((m) =>
        m.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    setActiveSuggestion(-1);
  };

  const selectSuggestion = (name: string) => {
    setForm((f) => ({ ...f, name }));
    setShowSuggestions(false);
    setActiveSuggestion(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestion((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestion((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeSuggestion >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[activeSuggestion]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const addTime = () => {
    setForm((f) => ({ ...f, times: [...f.times, "12:00"] }));
  };

  const removeTime = (index: number) => {
    setForm((f) => ({
      ...f,
      times: f.times.filter((_, i) => i !== index),
    }));
  };

  const updateTime = (index: number, value: string) => {
    setForm((f) => ({
      ...f,
      times: f.times.map((t, i) => (i === index ? value : t)),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.dose.trim() || form.times.length === 0)
      return;
    onAdd(form);
    setForm(DEFAULT_FORM);
  };

  const isEditing = !!editingData;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-5"
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-2">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Pill className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-lg font-semibold text-slate-800">
          {isEditing ? "Edit Medication" : "Add Medication"}
        </h2>
      </div>

      {/* ── Drug name with autocomplete ── */}
      <div className="relative">
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Medication Name
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search medication…"
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            onFocus={() => {
              if (form.name.trim().length > 0 && suggestions.length > 0)
                setShowSuggestions(true);
            }}
            onKeyDown={handleKeyDown}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition"
            autoComplete="off"
            required
          />
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && (
          <ul
            ref={suggestionsRef}
            className="absolute z-20 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto"
          >
            {suggestions.map((s, i) => (
              <li
                key={s}
                className={`px-4 py-2.5 text-sm cursor-pointer transition ${
                  i === activeSuggestion
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
                onMouseDown={() => selectSuggestion(s)}
                onMouseEnter={() => setActiveSuggestion(i)}
              >
                <Pill className="inline w-3.5 h-3.5 mr-2 text-slate-400" />
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ── Dose + Frequency row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Dose
          </label>
          <input
            type="text"
            placeholder="e.g. 100mg"
            value={form.dose}
            onChange={(e) => setForm((f) => ({ ...f, dose: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Frequency
          </label>
          <select
            value={form.frequency}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                frequency: e.target.value as Frequency,
              }))
            }
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition appearance-none"
          >
            {Object.entries(FREQUENCY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Dosing Pattern ── */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Dosing Pattern
        </label>
        <select
          value={form.dosingPattern}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              dosingPattern: e.target.value as DosingPattern,
            }))
          }
          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition appearance-none"
        >
          {Object.entries(DOSING_PATTERN_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* ── Dose Times ── */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-sm font-medium text-slate-700">
            Dose Times
          </label>
          <button
            type="button"
            onClick={addTime}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition"
          >
            <Plus className="w-3.5 h-3.5" /> Add time
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.times.map((time, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 bg-slate-100 rounded-lg px-3 py-1.5 border border-slate-200"
            >
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <input
                type="time"
                value={time}
                onChange={(e) => updateTime(i, e.target.value)}
                className="bg-transparent text-sm text-slate-700 focus:outline-none"
              />
              {form.times.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTime(i)}
                  className="text-slate-400 hover:text-red-500 transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Submit ── */}
      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {isEditing ? "Update Medication" : "Add Medication"}
        </button>
        {isEditing && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition font-medium cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
