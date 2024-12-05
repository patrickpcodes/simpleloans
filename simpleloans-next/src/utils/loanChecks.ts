import { LoanWithPayments } from "@/types/LoanWithPayments";
import { Payment } from "@/zod-schemas/payment";

export function hasActiveLoan(loansWithPayments: LoanWithPayments[]): boolean {
  // TODO fix active loan check
  return loansWithPayments.length > 0;
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

/**
 * Get the next payment date for pending payments.
 * @param payments - List of payments for a loan.
 * @returns The next payment date as a string, or null if no pending payments.
 */
export function getNextPaymentDateForPendingPayments(
  payments: Payment[]
): string | null {
  // Filter for pending payments
  const pendingPayments = payments.filter(
    (payment) => payment.paymentStatus === "Pending"
  );

  // Sort pending payments by due date in ascending order
  const sortedPendingPayments = pendingPayments.sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  // Return the due date of the first pending payment, or null if none exist
  return sortedPendingPayments.length > 0
    ? sortedPendingPayments[0].dueDate
    : null;
}
