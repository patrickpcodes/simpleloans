export const PAYMENT_STATUSES = [
  "Pending",
  "Paid",
  "Partially Paid",
  "Missed",
] as const;

export type PaymentStatuses = (typeof PAYMENT_STATUSES)[number];
