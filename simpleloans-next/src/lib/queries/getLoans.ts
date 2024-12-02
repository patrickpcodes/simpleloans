import { db } from "@/db";
import { customers, loans, payments } from "@/db/schema";
import { inArray, asc } from "drizzle-orm";

export async function getAllLoans() {
  try {
    // Fetch all loans
    const allLoans = await db.select().from(loans);

    if (allLoans.length === 0) {
      return []; // Return an empty array if no loans are found
    }

    // Extract all loan IDs and customer IDs
    const loanIds = allLoans.map((loan) => loan.id);
    const customerIds = allLoans.map((loan) => loan.customerId);

    // Fetch all payments for the loans in a single query
    const allPayments = await db
      .select()
      .from(payments)
      .where(inArray(payments.loanId, loanIds))
      .orderBy(asc(payments.dueDate));

    // Fetch all customers in a single query
    const allCustomers = await db
      .select()
      .from(customers)
      .where(inArray(customers.id, customerIds));

    // Map customers by their IDs for quick lookup
    const customerMap = new Map(
      allCustomers.map((customer) => [customer.id, customer])
    );

    // Group payments by loanId
    const paymentsMap = new Map();
    allPayments.forEach((payment) => {
      if (!paymentsMap.has(payment.loanId)) {
        paymentsMap.set(payment.loanId, []);
      }
      paymentsMap.get(payment.loanId).push(payment);
    });

    // Combine data for each loan
    const loansWithDetails = allLoans.map((loan) => {
      const loanPayments = paymentsMap.get(loan.id) || [];
      const customer = customerMap.get(loan.customerId);

      if (!customer) {
        throw new Error(`Customer with ID ${loan.customerId} not found`);
      }

      return {
        loan,
        payments: loanPayments,
        customer,
      };
    });

    return loansWithDetails;
  } catch (error) {
    console.error("Error fetching all loans with details:", error);
    throw new Error("Failed to fetch all loans with details.");
  }
}
