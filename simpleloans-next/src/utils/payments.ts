import { Payment } from "@/zod-schemas/payment";

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
    .sort((a, b) => {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    })
    .pop();
}
