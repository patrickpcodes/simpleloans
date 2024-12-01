import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { loans } from "@/db/schema";
import { LOAN_PAYMENT_FREQUENCIES } from "@/types/LoanPaymentFrequency";
import { z } from "zod";

export const insertLoanSchema = createInsertSchema(loans, {
  customerId: (schema) => schema.customerId.min(1, "Customer ID is required"),
  numberOfPayments: (schema) =>
    schema.numberOfPayments.min(1, "Number of Payments is required"),
  paymentFrequency: (schema) =>
    z
      .enum(LOAN_PAYMENT_FREQUENCIES)
      .refine((value) => LOAN_PAYMENT_FREQUENCIES.includes(value), {
        message: "Invalid payment frequency",
      }),
  initialBorrowedAmount: (schema) =>
    schema.initialBorrowedAmount.min(1, "Initial Borrowed Amount is required"),
  initialDueAmount: (schema) =>
    schema.initialDueAmount.min(1, "Initial Due Amount is required"),
});

export const selectLoanSchema = createSelectSchema(loans);

export type insertLoanSchemaType = typeof insertLoanSchema._type;

export type selectLoanSchemaType = typeof selectLoanSchema._type;
