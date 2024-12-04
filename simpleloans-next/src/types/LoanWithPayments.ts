import { Loan } from "@/zod-schemas/loan";
import { Payment } from "@/zod-schemas/payment";

export type LoanWithPayments = {
  loan: Loan;
  payments: Payment[];
};
