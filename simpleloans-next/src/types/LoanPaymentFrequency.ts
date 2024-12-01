export const LOAN_PAYMENT_FREQUENCIES = [
  "Weekly",
  "Bi-Weekly",
  "Monthly",
] as const;

export type PaymentFrequency = (typeof LOAN_PAYMENT_FREQUENCIES)[number];
