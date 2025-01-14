export const LOAN_STATUSES = [
  "Active",
  "Collections",
  "Loss",
  "Closed",
] as const;
export type LoanStatus = (typeof LOAN_STATUSES)[number];
