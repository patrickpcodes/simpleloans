export interface LoanDetails {
  customerId: string;
  startDate: string; // "yyyy-MM-dd"
  numberOfWeeks: number;
  startingAmount: number;
  interest: number;
  totalToPayBack: number;
  frequency: PaymentFrequency;
  notes: string;
}

import { z } from "zod";
import { PaymentFrequency } from "./PaymentFrequency";

export const loanDetailsSchema = z.object({
  customerId: z.string(),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Use yyyy-MM-dd"),
  numberOfWeeks: z.number().int().positive(),
  startingAmount: z.number().positive(),
  interest: z.number().min(0),
  totalToPayBack: z.number().positive(),
  frequency: z.nativeEnum(PaymentFrequency),
  notes: z.string().optional(),
});

export type LoanDetailsFormValues = z.infer<typeof loanDetailsSchema>;

export function convertFormValuesToLoanDetails(
  formValues: LoanDetailsFormValues
): LoanDetails {
  return {
    customerId: formValues.customerId,
    startDate: formValues.startDate,
    numberOfWeeks: formValues.numberOfWeeks,
    startingAmount: formValues.startingAmount,
    interest: formValues.interest,
    totalToPayBack: formValues.totalToPayBack,
    frequency: formValues.frequency,
    notes: formValues.notes,
  };
}
