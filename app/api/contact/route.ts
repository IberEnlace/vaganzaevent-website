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

    if (!name || !emailPattern.test(email) || message.length < 10) {
      return NextResponse.json({ error: "Please complete all fields." }, { status: 400 });
    }

    await createContactMessage({ name, email, message, language });

    if (process.env.RESEND_API_KEY) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM_EMAIL ?? "Vaganza Website <website@vaganzaevent.com>",
          to: ["hello@vaganzaevent.com"],
          reply_to: email,
          subject: `New Vaganza enquiry from ${name}`,
          text: `Name: ${name}\nEmail: ${email}\nLanguage: ${language}\n\n${message}`
        })
      });

      if (!response.ok) throw new Error("Email delivery failed");
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to send your message." }, { status: 500 });
  }
}
