import { Customer } from "./Customer";
import { Loan } from "./Loan";
import { Payment } from "./Payment";

export type LoanDetail = {
  loan: Loan;
  payments: Payment[];
  customer: Customer;
};
