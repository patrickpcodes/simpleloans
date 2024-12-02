import { selectLoanSchemaType } from "@/zod-schemas/loan";
import { selectPaymentSchemaType } from "@/zod-schemas/payment";

type Payment = selectPaymentSchemaType;
type Loan = selectLoanSchemaType;

export function generatePayments(loan: Loan): Payment[] {
  console.log("Generating payments for loan", loan);
  const payments: Payment[] = [];
  const paymentAmount =
    parseFloat(loan.initialDueAmount) / loan.numberOfPayments;
  const currentDate = new Date(loan.firstPaymentDate);
  console.log("Loan Payment Frequency", loan.paymentFrequency);
  const daysToAdd = (() => {
    switch (loan.paymentFrequency) {
      case "Weekly":
        return 7;
      case "Bi-Weekly":
        return 14;
      case "Monthly":
        return 30;
      default:
        throw new Error("Invalid payment frequency");
    }
  })();

  let totalPaidSoFar = 0;

  for (let i = 0; i < loan.numberOfPayments; i++) {
    let amountDue;

    if (i === loan.numberOfPayments - 1) {
      // Last payment: Adjust the amount to account for any rounding errors
      amountDue = +(parseFloat(loan.initialDueAmount) - totalPaidSoFar).toFixed(
        2
      );
    } else {
      amountDue = +paymentAmount.toFixed(2);
    }

    totalPaidSoFar += amountDue;

    const payment: Payment = {
      loanId: loan.id,
      dueDate: new Date(currentDate),
      paymentDate: null,
      amountDue: amountDue.toString(),
      amountPaid: "0",
      feeAmount: "0",
      paymentStatus: "Pending",
      notes: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    payments.push(payment);

    currentDate.setDate(currentDate.getDate() + daysToAdd);
  }

  return payments;
}
