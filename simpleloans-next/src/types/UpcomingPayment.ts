import { Payment } from "@/zod-schemas/payment";

export type UpcomingPayment = {
  customerId: number;
  customerName: string;
  loanId: number;
  payment: Payment;
  //   nextPaymentDueDate: string;
  //   nextPaymentDueAmount: number;
};
