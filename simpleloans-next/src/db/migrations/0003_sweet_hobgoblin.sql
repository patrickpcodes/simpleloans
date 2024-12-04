ALTER TABLE "loans" ALTER COLUMN "first_payment_date" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "due_date" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "payment_date" SET DATA TYPE varchar;