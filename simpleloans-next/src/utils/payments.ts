import { Payment } from "@/zod-schemas/payment";
import { PaymentFrequency } from "@/types/LoanPaymentFrequency";

export function getTotalFees(payments: Payment[]): number {
  return payments.reduce(
    (acc, payment) => acc + parseFloat(payment.feeAmount),
    0
  );
}

export function getTotalRemaining(payments: Payment[]): number {
  return getTotalToBePaid(payments) - getTotalPaid(payments);
}

export function getTotalToBePaid(payments: Payment[]): number {
  return payments.reduce(
    (acc, payment) =>
      acc + parseFloat(payment.amountDue) + parseFloat(payment.feeAmount),
    0
  );
}

export function getTotalPaid(payments: Payment[]): number {
  return payments.reduce(
    (acc, payment) => acc + parseFloat(payment.amountPaid),
    0
  );
}

export function getTotalToBePaidForPendingPayments(
  payments: Payment[]
): number {
  console.log("payments", JSON.stringify(payments));
  console.log("paymentCOunt", payments.length);
  return payments
    .filter((payment) => payment.paymentStatus === "Pending")
    .reduce(
      (acc, payment) =>
        acc + parseFloat(payment.amountDue) + parseFloat(payment.feeAmount),
      0
    );
}

export function getNextPendingPayment(
  payments: Payment[]
): Payment | undefined {
  const nextPayment = payments
    .filter((payment) => payment.paymentStatus === "Pending")
    .sort((a, b) => {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    })[0];
  return nextPayment;
}

export function getLastPayment(payments: Payment[]): Payment | undefined {
  return payments
    .slice()
    .sort((a, b) => {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    })
    .slice(-1)[0];
}

export function getNextPaymentDate(
  currentDate: Date,
  frequency: PaymentFrequency
): Date {
  const nextDate = new Date(currentDate);

  switch (frequency) {
    case "Weekly":
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case "Bi-Weekly":
      nextDate.setDate(nextDate.getDate() + 14);
      break;
    case "Monthly":
      nextDate.setDate(nextDate.getDate() + 30);
      break;
    default:
      throw new Error("Invalid payment frequency");
  }

  return nextDate;
}
