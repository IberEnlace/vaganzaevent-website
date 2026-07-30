import { neon } from "@neondatabase/serverless";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
const sql = neon(process.env.DATABASE_URL);
const migration = await readFile(resolve("drizzle/0000_initial.sql"), "utf8");
await sql.query(migration);
console.log("Migration completed.");
