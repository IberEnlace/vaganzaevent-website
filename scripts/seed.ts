import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { events } from "../lib/schema";
import { seedEvents } from "../lib/seed-data";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
const db = drizzle(neon(process.env.DATABASE_URL));
await db.insert(events).values(seedEvents).onConflictDoNothing();
console.log(`Seed completed: ${seedEvents.length} events.`);
