import { db } from "@/db";
import { customers, loans } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getLoansByCustomerId(customerId: number) {
  try {
    // Query to fetch the loan by loanId
    const loanList = await db
      .select()
      .from(loans)
      .where(eq(loans.customerId, customerId));

    // Return the loan and customer as separate objects
    return loanList;
  } catch (error) {
    console.error("Error fetching loan with customer:", error);
    throw new Error("Failed to fetch loan with customer.");
  }
}
