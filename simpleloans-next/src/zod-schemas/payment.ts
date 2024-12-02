import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { payments } from "@/db/schema";
import { PAYMENT_STATUSES } from "@/types/PaymentStatus";
import { z } from "zod";

export const insertPaymentSchema = createInsertSchema(payments, {
  loanId: (schema) => schema.loanId.min(1, "Loan ID is required"),
  amountDue: (schema) => schema.amountDue.min(1, "Amount is required"),
  paymentStatus: () =>
    z
      .enum(PAYMENT_STATUSES)
      .refine((value) => PAYMENT_STATUSES.includes(value), {
        message: "Invalid payment status",
      }),
});

export const selectPaymentSchema = createSelectSchema(payments);

export type insertPaymentSchemaType = typeof insertPaymentSchema._type;

export type selectPaymentSchemaType = typeof selectPaymentSchema._type;
