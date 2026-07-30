import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  titleEn: text("title_en").notNull(),
  titlePt: text("title_pt").notNull(),
  descriptionEn: text("description_en").notNull(),
  descriptionPt: text("description_pt").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  venue: text("venue").notNull(),
  price: integer("price").notNull(),
  image: text("image").notNull(),
  published: boolean("published").notNull().default(true),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});

export type EventRecord = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
