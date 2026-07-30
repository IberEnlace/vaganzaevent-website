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
    return NextResponse.json(await createEvent({ ...body, price: Number(body.price) }), { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create event" }, { status: 400 });
  }
}
