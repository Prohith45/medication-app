# 💊 Senior-Friendly Medication Tracker & Adherence App

A modern, accessible, senior-friendly medication adherence and tracking web application built with **Next.js 16**, **React 19**, and **Tailwind CSS**.

---

## ✨ Features

- **👴 Senior-Centric UX:** High contrast, legible typography, oversized touch targets, audio assistance, and clear visual cues designed specifically for older adults.
- **🌐 Multi-Language Support:** Instant switching between English, Hindi (हिंदी), Telugu (తెలుగు), Tamil (தமிழ்), and Malayalam (മലയാളം).
- **🔊 Voice Guidance (TTS):** Spoken schedule announcements and instructions using the Web Speech API.
- **📚 3-Tier Clinical Drug Intelligence:**
  1. **Tier 1 (Instant Local):** Built-in Regional Indian Drug Formulary (PMBJP & verified brands with typo-tolerant fuzzy matching).
  2. **Tier 2 (OpenFDA):** Real-time queries to the official US OpenFDA drug label database.
  3. **Tier 3 (AI Fallback):** Zero-failure fallback powered by Google Gemini AI for structured clinical summaries (purpose, mechanism of action, side effects).
- **⚠️ Drug-Drug Interaction Checker:** Automatic warning alerts for potential adverse drug combinations.
- **🚨 Smart Alarm System & Caregiver Alerts:** In-app audible alarms and automatic Telegram alerts sent to family members/caregivers if scheduled medications are missed.
- **📊 Adherence Tracking & Calendar:** Weekly strips, streak counters, daily logs, and compliance analytics.

---

## 🚀 Getting Started

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (version 18.x or later recommended)
- npm, pnpm, or yarn

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Prohith45/medication-app.git
cd medication-app
npm install
```

### 3. Environment Variables

Create a `.env.local` file by copying the sample template:

```bash
cp .env.example .env.local
```

Configure the following variables in `.env.local`:

```env
# Google Gemini API Key (for clinical AI fallback summaries)
GEMINI_API_KEY=your_gemini_api_key_here

# Telegram Caregiver Alerts (optional)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_CHAT_ID=your_telegram_chat_id_here
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router, Turbopack)
- **UI & Styling:** React 19, Tailwind CSS v4, Lucide React icons
- **AI & Integrations:** `@google/genai` (Google Gemini), OpenFDA REST API, Telegram Bot API
- **Audio:** Web Speech Synthesis API, Web Audio API synth tones
