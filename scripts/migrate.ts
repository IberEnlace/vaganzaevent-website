import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import postgres from "postgres";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
const sql = postgres(process.env.DATABASE_URL, { max: 1, prepare: false, ssl: "require" });
const migration = await readFile(resolve("drizzle/0000_initial.sql"), "utf8");
await sql.unsafe(migration);
await sql.end();
console.log("Migration completed.");
