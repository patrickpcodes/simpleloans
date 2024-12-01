import { db } from "@/db";
import { customers, loans, payments } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export async function getLoan(loanId: number) {
  try {
    // Query to fetch the loan by loanId
    const loan = await db
      .select()
      .from(loans)
      .where(eq(loans.id, loanId))
      .limit(1);

    if (loan.length === 0) {
      return null; // Return null if no loan is found
    }

    const loanData = loan[0];

    // Get the payments for the loan
    const loanPayments = await db
      .select()
      .from(payments)
      .where(eq(payments.loanId, loanId))
      .orderBy(asc(payments.dueDate));

    // Query to fetch the associated customer by customerId
    const customer = await db
      .select()
      .from(customers)
      .where(eq(customers.id, loanData.customerId))
      .limit(1);

    if (customer.length === 0) {
      throw new Error(`Customer with ID ${loanData.customerId} not found`);
    }

    const customerData = customer[0];

    // Return the loan and customer as separate objects
    return {
      loan: loanData,
      payments: loanPayments,
      customer: customerData,
    };
  } catch (error) {
    console.error("Error fetching loan with customer:", error);
    throw new Error("Failed to fetch loan with customer.");
  }
}
