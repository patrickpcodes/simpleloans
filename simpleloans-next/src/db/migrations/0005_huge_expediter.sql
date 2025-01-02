CREATE TABLE IF NOT EXISTS "email" (
	"id" serial PRIMARY KEY NOT NULL,
	"loan_id" integer,
	"subject" varchar NOT NULL,
	"email_text" text NOT NULL,
	"email_html" text,
	"to" text NOT NULL,
	"cc" text,
	"bcc" text,
	"sent" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "email" ADD CONSTRAINT "email_loan_id_loans_id_fk" FOREIGN KEY ("loan_id") REFERENCES "public"."loans"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
