import { Payment } from "@/zod-schemas/payment";
import { PaymentFrequency } from "@/types/LoanPaymentFrequency";
import { UpcomingPayment } from "@/types/UpcomingPayment";
import { formatDateToYYYYMMDD } from "./formatDateToDateOnly";

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

export function groupPayments(upcomingPayments: UpcomingPayment[]) {
  const groupedPayments = upcomingPayments.reduce(
    (acc, payment) => {
      const dueDate = new Date(payment.payment.dueDate);
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      const today = formatDateToYYYYMMDD(todayDate);
      const tomorrowDate = new Date(todayDate);
      tomorrowDate.setDate(tomorrowDate.getDate() + 1);
      const tomorrow = formatDateToYYYYMMDD(tomorrowDate);
      // console.log("dueDate", payment.payment.dueDate);
      // console.log("today", today);
      // console.log("tomorrow", tomorrow);
      if (payment.payment.dueDate === today) {
        acc.today.push(payment);
      } else if (dueDate < todayDate) {
        acc.pastDue.push(payment);
      } else if (payment.payment.dueDate === tomorrow) {
        acc.tomorrow.push(payment);
      } else {
        acc.future.push(payment);
      }
      return acc;
    },
    {
      pastDue: [] as typeof upcomingPayments,
      today: [] as typeof upcomingPayments,
      tomorrow: [] as typeof upcomingPayments,
      future: [] as typeof upcomingPayments,
    }
  );
  return groupedPayments;
}
