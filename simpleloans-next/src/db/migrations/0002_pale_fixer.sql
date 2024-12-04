ALTER TABLE "customers" ALTER COLUMN "birthdate" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "history" ALTER COLUMN "timestamp" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "amount_paid" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "fee_amount" SET NOT NULL;