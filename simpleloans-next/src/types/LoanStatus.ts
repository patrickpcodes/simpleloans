export const LOAN_STATUSES = ["Active", "Paid", "Renewed"] as const;
export type LoanStatus = (typeof LOAN_STATUSES)[number];
