export enum PaymentReminderType {
  Never = "Never",
  DayOf = "DayOf",
  DayBefore = "DayBefore",
  Daily = "Daily",
}

export interface Customer {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  birthday: string; // Date in YYYY-MM-DD format
  notes: string;
  sendBirthdayEmail: boolean; // New Property
  paymentReminderType: PaymentReminderType; // New Property
}

import { History } from "./History";
export interface CustomerWithHistory {
  customer: Customer;
  history: History[];
}

import { z } from "zod";
export const customerSchema = z.object({
  customerName: z.string().min(2),
  phoneNumber: z.number().min(5),
  birthday: z.date().nullable().optional(),
  email: z.string().min(5),
  sendBirthdayEmail: z.boolean().default(false),
  paymentReminderType: z.string(),
  notes: z.string().optional(),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;

export function convertFormValuesToLoanDetails(
  formValues: CustomerFormValues,
  customerId: string
): Customer {
  return {
    id: customerId,
    name: formValues.customerName,
    phoneNumber: formValues.phoneNumber.toString(),
    birthday: formValues.birthday?.toISOString().split("T")[0] || "",
    email: formValues.email,
    sendBirthdayEmail: formValues.sendBirthdayEmail,
    paymentReminderType: formValues.paymentReminderType as PaymentReminderType,
    notes: formValues.notes || "",
  };
}
