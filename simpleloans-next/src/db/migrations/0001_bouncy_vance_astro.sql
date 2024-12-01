CREATE TABLE IF NOT EXISTS "history" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"reference_id" integer NOT NULL,
	"changes" jsonb NOT NULL,
	"user_email" varchar NOT NULL,
	"display_name" varchar NOT NULL,
	"timestamp" timestamp DEFAULT now()
);
