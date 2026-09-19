import { NextRequest, NextResponse } from "next/server";

// ─── POST /api/telegram-alert ───────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      drugName,
      dose,
      scheduledTime,
      attemptCount,
      patientName,
      guardianName,
      guardianRelation,
      message: customMessage,
    } = body as {
      drugName?: string;
      dose?: string;
      scheduledTime?: string;
      attemptCount?: number;
      patientName?: string;
      guardianName?: string;
      guardianRelation?: string;
      message?: string;
    };

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return NextResponse.json(
        { error: "Telegram credentials not configured. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in .env.local" },
        { status: 500 }
      );
    }

    const patient = patientName || "Rohith";
    const gName = guardianName || "Family";
    const gRelation = guardianRelation || "Father";
    const attempts = attemptCount ?? 1;

    let message = customMessage;
    if (!message) {
      message = [
        "🚨 *URGENT: MEDICATION MISSED*",
        "",
        `👤 *Patient:* ${patient}`,
        `🔔 *Alert For:* ${gRelation} (${gName})`,
        `💊 *Medication:* ${drugName || "Prescribed Medicine"} - ${dose || "1 dose"}`,
        `⏰ *Scheduled Time:* ${scheduledTime || "Now"}`,
        `⚠️ *Status:* Unresponsive to alarms (Attempt #${attempts}).`,
        "",
        `Please call ${patient} or check in immediately.`,
      ].join("\n");
    }

    const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;

    const telegramRes = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    if (!telegramRes.ok) {
      const errBody = await telegramRes.text();
      console.error("[telegram-alert] Telegram API error:", errBody);
      return NextResponse.json(
        { error: `Telegram API returned ${telegramRes.status}` },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[telegram-alert] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
