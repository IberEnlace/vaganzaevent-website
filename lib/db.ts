import { drizzle } from "drizzle-orm/postgres-js";
import { desc, eq } from "drizzle-orm";
import postgres from "postgres";
import { contactMessages, events, type NewContactMessage, type NewEvent } from "./schema";
import { seedEvents } from "./seed-data";

function database() {
  if (!process.env.DATABASE_URL) return null;
  const client = postgres(process.env.DATABASE_URL, { max: 1, prepare: false, ssl: "require" });
  return drizzle(client);
}

export async function getPublishedEvents() {
  const db = database();
  if (!db) return seedEvents.map((event, index) => ({ ...event, id: index + 1, published: event.published ?? true, featured: event.featured ?? false }));
  try {
    return await db.select().from(events).where(eq(events.published, true)).orderBy(desc(events.featured), events.date);
  } catch (error) {
    const cause = error instanceof Error && "cause" in error ? error.cause : error;
    console.error("Vaganza database query failed:", cause);
    return seedEvents.map((event, index) => ({ ...event, id: index + 1, published: event.published ?? true, featured: event.featured ?? false }));
  }
}

export async function getAllEvents() {
  const db = database();
  if (!db) return seedEvents.map((event, index) => ({ ...event, id: index + 1, published: event.published ?? true, featured: event.featured ?? false }));
  return db.select().from(events).orderBy(events.date);
}

export async function createEvent(data: NewEvent) {
  const db = database();
  if (!db) throw new Error("DATABASE_URL is not configured");
  return (await db.insert(events).values(data).returning())[0];
}

export async function updateEvent(id: number, data: Partial<NewEvent>) {
  const db = database();
  if (!db) throw new Error("DATABASE_URL is not configured");
  return (await db.update(events).set({ ...data, updatedAt: new Date() }).where(eq(events.id, id)).returning())[0];
}

export async function deleteEvent(id: number) {
  const db = database();
  if (!db) throw new Error("DATABASE_URL is not configured");
  await db.delete(events).where(eq(events.id, id));
}

export async function createContactMessage(data: NewContactMessage) {
  const db = database();
  if (!db) return null;
  return (await db.insert(contactMessages).values(data).returning())[0];
}
