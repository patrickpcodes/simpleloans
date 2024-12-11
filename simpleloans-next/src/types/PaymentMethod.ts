export const PAYMENT_METHOD = ["E-Transfer", "Withdrawal"] as const;

export type PaymentMethod = (typeof PAYMENT_METHOD)[number];
