import { LoanWithPayments } from "@/types/LoanWithPayments";

export function hasActiveLoan(loansWithPayments: LoanWithPayments[]): boolean {
  return loansWithPayments.length > 0;
}

export function getNextPaymentDate(
  loansWithPayments: LoanWithPayments[]
): Date {
  //From active loan, get the earliest payment with status Pending
  const activeLoan = loansWithPayments[0];

  // get pending with the earliest date
  const pendingPayments = activeLoan.payments.filter(
    (payment) => payment.paymentStatus === "Pending"
  );
  if (pendingPayments.length === 0) {
    //TODO FIX THIS
    return new Date();
  }
  //get minimum date
  return pendingPayments.reduce((min, payment) =>
    payment.dueDate < min.dueDate ? payment : min
  ).dueDate;
}
export function getNextPaymentAmount(
  loansWithPayments: LoanWithPayments[]
): string {
  //From active loan, get the earliest payment with status Pending
  const activeLoan = loansWithPayments[0];

  // get pending with the earliest date
  const pendingPayments = activeLoan.payments.filter(
    (payment) => payment.paymentStatus === "Pending"
  );
  if (pendingPayments.length === 0) {
    return "";
  }
  //get minimum date
  return pendingPayments[0].amountDue;
}
