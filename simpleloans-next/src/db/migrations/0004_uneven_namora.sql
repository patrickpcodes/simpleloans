CREATE TYPE "public"."loan_status_enum" AS ENUM('Active', 'Paid', 'Renewed');--> statement-breakpoint
CREATE TYPE "public"."payment_method_enum" AS ENUM('E-Transfer', 'Withdrawal');--> statement-breakpoint
ALTER TABLE "loans" ADD COLUMN "loan_status" "loan_status_enum" NOT NULL;--> statement-breakpoint
ALTER TABLE "loans" ADD COLUMN "default_payment_method" "payment_method_enum" NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "payment_method" "payment_method_enum" NOT NULL;