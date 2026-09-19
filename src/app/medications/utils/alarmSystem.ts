/**
 * Alarm System — Web Audio siren + OS Notification engine
 *
 * Provides:
 *  - startAlarm(): continuous two-tone siren via Web Audio API
 *  - stopAlarm(): silences the siren
 *  - fireOSNotification(): native browser notification
 *  - unlockAudio(): must be called once on user gesture to allow playback
 *  - sendTelegramEscalation(): POST to /api/telegram-alert
 */

// ─── Audio Context Singleton ────────────────────────────────────────

let audioCtx: AudioContext | null = null;
let oscillator: OscillatorNode | null = null;
let gainNode: GainNode | null = null;
let sirenInterval: ReturnType<typeof setInterval> | null = null;
let isPlaying = false;

/**
 * Must be called once on a user interaction (click/tap) to unlock
 * the AudioContext for browsers that require a user gesture.
 */
export function unlockAudio(): void {
  if (typeof window === "undefined") return;
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}

/**
 * Start a continuous two-tone siren alarm that loops until stopped.
 */
export function startAlarm(): void {
  if (typeof window === "undefined" || isPlaying) return;

  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  // Create oscillator with two-tone siren
  oscillator = audioCtx.createOscillator();
  gainNode = audioCtx.createGain();

  oscillator.type = "square";
  oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
  gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  oscillator.start();
  isPlaying = true;

  // Alternate between two frequencies for siren effect
  let high = true;
  sirenInterval = setInterval(() => {
    if (oscillator && audioCtx) {
      oscillator.frequency.setValueAtTime(
        high ? 660 : 880, // E5 ↔ A5
        audioCtx.currentTime
      );
      high = !high;
    }
  }, 400);
}

/**
 * Stop the alarm siren and clean up audio nodes.
 */
export function stopAlarm(): void {
  if (sirenInterval) {
    clearInterval(sirenInterval);
    sirenInterval = null;
  }
  if (oscillator) {
    try {
      oscillator.stop();
      oscillator.disconnect();
    } catch {
      // already stopped
    }
    oscillator = null;
  }
  if (gainNode) {
    gainNode.disconnect();
    gainNode = null;
  }
  isPlaying = false;
}

/**
 * Fire a native OS desktop notification.
 */
export function fireOSNotification(
  drugName: string,
  dose: string,
  scheduledTime: string
): void {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  try {
    new Notification(`🚨 Dose Due: ${drugName}`, {
      body: `Take ${dose} now (${scheduledTime}). Tap to confirm.`,
      requireInteraction: true,
      tag: `med-alarm-${drugName}`, // prevents duplicate notifications
      icon: "/favicon.ico",
    });
  } catch {
    // Notification API may not be available in some contexts
  }
}

/**
 * Send escalation alert to caregiver via Telegram.
 */
export async function sendTelegramEscalation(params: {
  drugName: string;
  dose: string;
  scheduledTime: string;
  attemptCount: number;
  patientName?: string;
  guardianName?: string;
  guardianRelation?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/telegram-alert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("[alarmSystem] Telegram escalation failed:", err);
    return { success: false, error: "Network error" };
  }
}
