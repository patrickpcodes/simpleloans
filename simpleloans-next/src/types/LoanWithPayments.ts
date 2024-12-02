import { Loan } from "./Loan";
import { Payment } from "./Payment";

export type LoanWithPayments = {
  loan: Loan;
  payments: Payment[];
};
