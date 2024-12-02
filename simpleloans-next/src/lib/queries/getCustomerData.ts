import { db } from "@/db";
import { customers, loans, payments } from "@/db/schema";
import { CustomerDetail } from "@/types/CustomerDetail";
import { Loan } from "@/types/Loan";
import { eq } from "drizzle-orm";
import { LoanWithPayments } from "@/types/LoanWithPayments";
import { inArray, asc } from "drizzle-orm";

export async function getCustomerData(id?: number): Promise<CustomerDetail[]> {
  try {
    // Step 1: Fetch all customers
    const allCustomers = await db
      .select()
      .from(customers)
      .where(id ? eq(customers.id, id) : undefined);

    if (allCustomers.length === 0) {
      return []; // Return an empty array if no customers are found
    }

    // Step 2: Extract all customer IDs
    const customerIds = allCustomers.map((customer) => customer.id);

    // Step 3: Fetch all loans for the customers in a single query
    const allLoans = await db
      .select()
      .from(loans)
      .where(inArray(loans.customerId, customerIds));

    // Extract all loan IDs
    const loanIds = allLoans.map((loan) => loan.id);

    // Step 4: Fetch all payments for the loans in a single query
    const allPayments = await db
      .select()
      .from(payments)
      .where(inArray(payments.loanId, loanIds))
      .orderBy(asc(payments.dueDate));

    // Step 5: Group loans by customerId and payments by loanId
    const loansByCustomerId = new Map();
    allLoans.forEach((loan) => {
      if (!loansByCustomerId.has(loan.customerId)) {
        loansByCustomerId.set(loan.customerId, []);
      }
      loansByCustomerId.get(loan.customerId).push(loan);
    });

    const paymentsByLoanId = new Map();
    allPayments.forEach((payment) => {
      if (!paymentsByLoanId.has(payment.loanId)) {
        paymentsByLoanId.set(payment.loanId, []);
      }
      paymentsByLoanId.get(payment.loanId).push(payment);
    });

    // Step 6: Combine the data
    const customersWithDetails: CustomerDetail[] = allCustomers.map(
      (customer) => {
        const customerLoans = loansByCustomerId.get(customer.id) || [];
        const loansWithPayments: LoanWithPayments[] = customerLoans.map(
          (loan: Loan) => ({
            loan,
            payments: paymentsByLoanId.get(loan.id) || [],
          })
        );

        return {
          customer,
          loansWithPayments,
        };
      }
    );

    return customersWithDetails;
  } catch (error) {
    console.error("Error fetching all customer data:", error);
    throw new Error("Failed to fetch all customer data.");
  }
}
