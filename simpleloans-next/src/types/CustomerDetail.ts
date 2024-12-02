import { Customer } from "./Customer";
import { LoanWithPayments } from "./LoanWithPayments";

export type CustomerDetail = {
  customer: Customer;
  loansWithPayments: LoanWithPayments[];
};
