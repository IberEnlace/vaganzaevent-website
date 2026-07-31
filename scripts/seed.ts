import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { events } from "../lib/schema";
import { seedEvents } from "../lib/seed-data";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
const client = postgres(process.env.DATABASE_URL, { max: 1, prepare: false, ssl: "require" });
const db = drizzle(client);
await db.insert(events).values(seedEvents).onConflictDoNothing();
await client.end();
console.log(`Seed completed: ${seedEvents.length} events.`);
