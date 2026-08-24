import { isAuthenticated } from "@/lib/auth";
import postgres from "postgres";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 3 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function client() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");
  return postgres(process.env.DATABASE_URL, { max: 1, prepare: false, ssl: "require" });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) return NextResponse.json({ error: "Please choose an image." }, { status: 400 });
    if (!ALLOWED_TYPES.has(file.type)) return NextResponse.json({ error: "Use a JPG, PNG, WebP or GIF image." }, { status: 400 });
    if (file.size > MAX_FILE_SIZE) return NextResponse.json({ error: "Image must be smaller than 3 MB." }, { status: 400 });

    const sql = client();
    await sql`
      create table if not exists event_images (
        id text primary key,
        content_type text not null,
        data bytea not null,
        created_at timestamptz not null default now()
      )
    `;

    const id = crypto.randomUUID();
    const bytes = Buffer.from(await file.arrayBuffer());
    await sql`insert into event_images (id, content_type, data) values (${id}, ${file.type}, ${bytes})`;
    await sql.end();

    return NextResponse.json({ url: `/api/uploads/${id}` }, { status: 201 });
  } catch (error) {
    console.error("Image upload failed:", error);
    return NextResponse.json({ error: "Image upload failed." }, { status: 500 });
  }
}
