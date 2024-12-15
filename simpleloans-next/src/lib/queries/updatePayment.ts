import { generateChanges } from "@/utils/generateChanges";
import { Payment } from "@/zod-schemas/payment";
import { getPayment } from "./getPayment";
import { db } from "@/db";
import { payments, history } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function updatePayment(
  updatedPayment: Payment,
  userEmail: string,
  displayName: string
) {
  if (updatedPayment.id === undefined) {
    throw new Error("Payment ID is required.");
  }
  const existingPaymentData = await getPayment(updatedPayment.id);

  if (!existingPaymentData) {
    throw new Error(`Payment with ID ${updatedPayment.id} not found.`);
  }

  const trackedFields: (keyof Payment)[] = [
    "amountDue",
    "amountPaid",
    "feeAmount",
    "dueDate",
    "paymentDate",
    "paymentMethod",
    "paymentStatus",
    "notes",
  ];
  const existingPayment: Payment = existingPaymentData;

  const changes = generateChanges(
    existingPayment,
    updatedPayment,
    trackedFields
  );

  if (changes.length === 0) {
    return { status: 304, message: "No changes detected." };
  }
  await db.insert(history).values({
    type: "Payment",
    referenceId: updatedPayment.id,
    changes: changes,
    userEmail,
    displayName,
    timestamp: new Date(),
  });

  await db
    .update(payments)
    .set(updatedPayment)
    .where(eq(payments.id, updatedPayment.id));

  const updateHistory = await db
    .select()
    .from(history)
    .where(
      and(
        eq(history.referenceId, updatedPayment.id),
        eq(history.type, "Payment")
      )
    )
    .orderBy(desc(history.timestamp));

  return {
    payment: { ...existingPayment, ...updatedPayment },
    history: updateHistory,
  };
}
