import postgres from "postgres";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function client() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");
  return postgres(process.env.DATABASE_URL, { max: 1, prepare: false, ssl: "require" });
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const sql = client();
    const rows = await sql<{ data: Buffer; content_type: string }[]>`
      select data, content_type from event_images where id = ${id} limit 1
    `;
    await sql.end();

    const image = rows[0];
    if (!image) return NextResponse.json({ error: "Image not found." }, { status: 404 });

    return new Response(image.data, {
      headers: {
        "Content-Type": image.content_type,
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    });
  } catch (error) {
    console.error("Image delivery failed:", error);
    return NextResponse.json({ error: "Image not found." }, { status: 404 });
  }
}
