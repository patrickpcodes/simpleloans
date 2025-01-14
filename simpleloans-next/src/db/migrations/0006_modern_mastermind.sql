ALTER TABLE "email" RENAME TO "emails";--> statement-breakpoint
ALTER TABLE "emails" DROP CONSTRAINT "email_loan_id_loans_id_fk";
--> statement-breakpoint
ALTER TABLE "loans" ADD COLUMN "extension_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "emails" ADD CONSTRAINT "emails_loan_id_loans_id_fk" FOREIGN KEY ("loan_id") REFERENCES "public"."loans"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "public"."loans" ALTER COLUMN "loan_status" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."loan_status_enum";--> statement-breakpoint
CREATE TYPE "public"."loan_status_enum" AS ENUM('Active', 'Collections', 'Loss', 'Closed');--> statement-breakpoint
ALTER TABLE "public"."loans" ALTER COLUMN "loan_status" SET DATA TYPE "public"."loan_status_enum" USING "loan_status"::"public"."loan_status_enum";