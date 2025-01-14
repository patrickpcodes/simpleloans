import { db } from "@/db";
import * as schema from "@/db/schema";
import { formatDateToYYYYMMDD } from "@/utils/formatDateToDateOnly";
import { getNextPaymentDate } from "@/utils/payments";
import { eq } from "drizzle-orm";
import { z } from "zod";

const extendPaymentSchema = z.object({
  loanId: z.number(),
  userId: z.string(),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { loanId, userId } = extendPaymentSchema.parse(json);
    console.log(userId);
    // 1. Get loan and payments
    const loan = await db
      .select()
      .from(schema.loans)
      .where(eq(schema.loans.id, loanId))
      .limit(1);

    const payments = await db
      .select()
      .from(schema.payments)
      .where(eq(schema.payments.loanId, loanId));

    if (!loan[0]) {
      return Response.json({ error: "Loan not found" }, { status: 404 });
    }

    if (!loan) {
      return Response.json({ error: "Loan not found" }, { status: 404 });
    }

    // 2. Calculate required amount
    const totalPaid = payments.reduce(
      (sum, payment) =>
        sum + (payment.amountPaid ? Number(payment.amountPaid) : 0),
      0
    );

    const totalPending = payments.reduce(
      (sum, payment) =>
        payment.paymentStatus === "Pending"
          ? sum + Number(payment.amountDue)
          : sum,
      0
    );

    const totalRequired =
      Number(loan[0].initialDueAmount) +
      payments.reduce(
        (sum, payment) =>
          sum + (payment.feeAmount ? Number(payment.feeAmount) : 0),
        0
      );

    const shortfall = totalRequired - (totalPaid + totalPending);

    if (shortfall <= 0) {
      return Response.json(
        { error: "Loan does not require extension" },
        { status: 400 }
      );
    }

    // 3. Get last payment date
    const sortedPayments = [...payments].sort(
      (a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
    );
    const lastPayment = sortedPayments[0];

    const nextPaymentDate = getNextPaymentDate(
      new Date(lastPayment.dueDate),
      loan[0].paymentFrequency
    );

    // 5. Create new payment
    const [newPayment] = await db
      .insert(schema.payments)
      .values({
        loanId: loanId,
        dueDate: formatDateToYYYYMMDD(nextPaymentDate),
        paymentDate: null,
        amountDue: shortfall.toString(),
        amountPaid: "0",
        feeAmount: "0",
        paymentStatus: "Pending",
        paymentMethod: loan[0].defaultPaymentMethod,
        notes: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // 6. Update loan extension count
    await db
      .update(schema.loans)
      .set({
        extensionCount: (loan[0].extensionCount || 0) + 1,
      })
      .where(eq(schema.loans.id, loanId));

    // // 7. Add history record
    // await db.insert(schema.history).values({
    //   type: "Loan",
    //   referenceId: loanId,
    //   changes: {}
    //   actionType: "PAYMENT_EXTENSION",
    //   description: `Loan extended with additional payment of $${shortfall.toFixed(
    //     2
    //   )} due on ${nextPaymentDate.toLocaleDateString()}`,
    //   createdBy: userId,
    // });

    return Response.json(
      {
        message: "Payment extended successfully",
        payment: newPayment,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error extending payment:", error);
    return Response.json(
      { error: "Failed to extend payment" },
      { status: 500 }
    );
  }
}
