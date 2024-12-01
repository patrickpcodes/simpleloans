import { db } from "@/db";
import { payments, loans } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getPaymentsByLoanId(loanId: number) {
  try {
    // Query to fetch the loan by loanId
    const paymentList = await db
      .select()
      .from(payments)
      .where(eq(payments.loanId, loanId));

    // Return the loan and customer as separate objects
    return paymentList;
  } catch (error) {
    console.error("Error fetching payments from loan", error);
    throw new Error("Failed to fetch loan with customer.");
  }
}
