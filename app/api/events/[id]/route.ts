import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { deleteEvent, updateEvent } from "@/lib/db";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    return NextResponse.json(await updateEvent(Number((await params).id), { ...body, price: Number(body.price) }));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update event" }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await deleteEvent(Number((await params).id));
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to delete event" }, { status: 400 });
  }
}
