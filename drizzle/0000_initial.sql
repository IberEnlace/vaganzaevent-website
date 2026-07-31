CREATE TABLE IF NOT EXISTS "events" (
  "id" serial PRIMARY KEY NOT NULL,
  "title_en" text NOT NULL,
  "title_pt" text NOT NULL,
  "description_en" text NOT NULL,
  "description_pt" text NOT NULL,
  "date" text NOT NULL,
  "time" text NOT NULL,
  "venue" text NOT NULL,
  "price" integer NOT NULL,
  "image" text NOT NULL,
  "published" boolean DEFAULT true NOT NULL,
  "featured" boolean DEFAULT false NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "contact_messages" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "email" text NOT NULL,
  "message" text NOT NULL,
  "language" text DEFAULT 'en' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
