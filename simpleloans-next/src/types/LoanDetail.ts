import { Loan } from "@/zod-schemas/loan";
import { Customer } from "./Customer";
import { Payment } from "@/zod-schemas/payment";

export type LoanDetail = {
  loan: Loan;
  payments: Payment[];
  customer: Customer;
};
