import { db } from "@/db";
import { payments } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getPayment(paymentId: number) {
  try {
    // Query to fetch the loan by loanId
    const payment = await db
      .select()
      .from(payments)
      .where(eq(payments.id, paymentId))
      .limit(1);
    if (payment.length === 0) {
      return null; // Return null if no loan is found
    }
    return payment[0];
  } catch (error) {
    console.error("Error fetching payment with id:", error);
  }
}
