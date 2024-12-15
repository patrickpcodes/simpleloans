import { Loan } from "@/zod-schemas/loan";
import { Payment } from "@/zod-schemas/payment";

export type UpcomingPayment = {
  customerId: number;
  customerName: string;
  loan: Loan;
  payment: Payment;
  //   nextPaymentDueDate: string;
  //   nextPaymentDueAmount: number;
};
