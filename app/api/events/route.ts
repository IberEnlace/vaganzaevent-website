import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { createEvent, getAllEvents } from "@/lib/db";

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await getAllEvents());
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const data = {
      titleEn: String(body.titleEn ?? ""),
      titlePt: String(body.titlePt ?? ""),
      descriptionEn: String(body.descriptionEn ?? ""),
      descriptionPt: String(body.descriptionPt ?? ""),
      date: String(body.date ?? ""),
      time: String(body.time ?? ""),
      venue: String(body.venue ?? ""),
      price: Number(body.price),
      image: String(body.image ?? ""),
      published: Boolean(body.published),
      featured: Boolean(body.featured)
    };
    return NextResponse.json(await createEvent(data), { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create event" }, { status: 400 });
  }
}
