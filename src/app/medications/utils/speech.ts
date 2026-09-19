/**
 * Web Speech API audio reader for senior and accessibility support.
 * Native text-to-speech with bilingual support for English and Telugu.
 */

export interface SpeechInstructionParams {
  name: string;
  dose: string;
  timingCondition?: string;
  language: "en" | "te";
}

export function speakDoseInstruction({
  name,
  dose,
  timingCondition,
  language,
}: SpeechInstructionParams) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    console.warn("Web Speech Synthesis not supported in this browser.");
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  let textToSpeak = "";

  if (language === "te") {
    // Telugu dosage instructions
    let conditionTe = "నీళ్లతో వేసుకోండి";
    const condLower = (timingCondition || "").toLowerCase();

    if (
      condLower.includes("empty stomach") ||
      condLower.includes("fasting") ||
      condLower.includes("before food")
    ) {
      conditionTe = "భోజనానికి ముందు ఖాళీ కడుపుతో వేసుకోండి";
    } else if (
      condLower.includes("after food") ||
      condLower.includes("breakfast") ||
      condLower.includes("lunch") ||
      condLower.includes("dinner")
    ) {
      conditionTe = "భోజనం తర్వాత వేసుకోండి";
    } else if (condLower.includes("bedtime") || condLower.includes("night")) {
      conditionTe = "రాత్రి పడుకునే ముందు వేసుకోండి";
    }

    const cleanDose = dose
      .replace(/tablet/gi, "టాబ్లెట్")
      .replace(/capsule/gi, "క్యాప్సూల్");

    textToSpeak = `${name} ${cleanDose}, ${conditionTe}.`;
  } else {
    // English dosage instructions
    let timingEn = "with a full glass of water as directed";
    const condLower = (timingCondition || "").toLowerCase();

    if (
      condLower.includes("empty stomach") ||
      condLower.includes("fasting")
    ) {
      timingEn = "thirty minutes before breakfast on an empty stomach";
    } else if (condLower.includes("before food")) {
      timingEn = "before food with water";
    } else if (condLower.includes("after food")) {
      timingEn = "after meals with water";
    } else if (condLower.includes("breakfast")) {
      timingEn = "in the morning with breakfast";
    } else if (condLower.includes("lunch")) {
      timingEn = "in the afternoon with lunch";
    } else if (condLower.includes("bedtime") || condLower.includes("night")) {
      timingEn = "at bedtime with water";
    } else if (timingCondition) {
      timingEn = timingCondition.toLowerCase();
    }

    textToSpeak = `Take ${dose} of ${name} ${timingEn}.`;
  }

  const utterance = new SpeechSynthesisUtterance(textToSpeak);
  utterance.rate = 0.92; // slightly slower for senior auditory clarity
  utterance.pitch = 1.0;

  // Voice selection: prioritize Indian English or native Telugu if available
  const voices = window.speechSynthesis.getVoices();
  if (language === "te") {
    const teVoice = voices.find(
      (v) =>
        v.lang.startsWith("te") ||
        v.lang.includes("te-IN") ||
        v.name.toLowerCase().includes("telugu")
    );
    const inVoice = voices.find(
      (v) => v.lang.includes("en-IN") || v.lang.includes("hi-IN")
    );

    if (teVoice) {
      utterance.voice = teVoice;
      utterance.lang = "te-IN";
    } else if (inVoice) {
      utterance.voice = inVoice;
      utterance.lang = inVoice.lang;
    } else {
      utterance.lang = "en-IN";
    }
  } else {
    const enInVoice = voices.find((v) => v.lang.includes("en-IN"));
    const enVoice = voices.find((v) => v.lang.startsWith("en"));

    if (enInVoice) {
      utterance.voice = enInVoice;
    } else if (enVoice) {
      utterance.voice = enVoice;
    }
    utterance.lang = "en-US";
  }

  window.speechSynthesis.speak(utterance);
}
