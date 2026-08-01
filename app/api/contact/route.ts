import { NextResponse } from "next/server";
import { createContactMessage } from "@/lib/db";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim().slice(0, 120);
    const email = String(body.email ?? "").trim().slice(0, 254);
    const message = String(body.message ?? "").trim().slice(0, 5000);
    const language = body.language === "pt" ? "pt" : "en";
    const website = String(body.website ?? "").trim();

    // Bots commonly fill hidden fields. Return success without sending anything.
    if (website) return NextResponse.json({ ok: true });

    if (!name || !emailPattern.test(email) || message.length < 10) {
      return NextResponse.json({ error: "Please complete all fields." }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("Vaganza contact form: RESEND_API_KEY is not configured");
      return NextResponse.json({ error: "Email delivery is not configured." }, { status: 503 });
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL ?? "Vaganza Website <website@vaganzaevent.com>",
        to: [process.env.CONTACT_TO_EMAIL ?? "hello@vaganzaevent.com"],
        reply_to: email,
        subject: `New Vaganza enquiry from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nLanguage: ${language}\n\n${message}`
      })
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("Vaganza contact email failed:", response.status, detail);
      throw new Error("Email delivery failed");
    }

    // Email delivery is the primary action. Keep the database copy best-effort.
    try {
      await createContactMessage({ name, email, message, language });
    } catch (error) {
      console.error("Vaganza contact database save failed:", error);
    }

    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Vaganza contact form failed:", error);
    return NextResponse.json({ error: "Unable to send your message." }, { status: 500 });
  }
}
