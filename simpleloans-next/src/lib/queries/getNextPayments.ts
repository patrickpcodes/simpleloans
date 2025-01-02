import { db } from "@/db"; // Assuming this is your Drizzle DB instance
import { customers, emails, loans, payments } from "@/db/schema";
import { eq, asc, and, sql } from "drizzle-orm";

export const getNextPayments = async () => {
  const results = await db
    .select({
      customerId: customers.id,
      customerName: customers.name,
      customerEmail: customers.email,
      lastReminderSent: emails.createdAt,
      loan: loans,
      payment: payments,
      //   nextPaymentDueDate: payments.dueDate,
      //   nextPaymentDueAmount: payments.amountDue,
    })
    .from(customers)
    .leftJoin(loans, eq(loans.customerId, customers.id))
    // .leftJoin(payments, eq(payments.loanId, loans.id))
    .leftJoin(
      payments,
      and(
        eq(payments.loanId, loans.id),
        eq(
          payments.dueDate,
          sql`(
              SELECT MIN(p2.due_date)
              FROM payments p2
              WHERE p2.loan_id = loans.id
                AND p2.payment_status = 'Pending'
            )`
        )
      )
    )
    .leftJoin(
      emails,
      and(
        eq(emails.loanId, loans.id),
        eq(
          emails.createdAt,
          sql`(
            SELECT MAX(e2.created_at)
            FROM emails e2
            WHERE e2.loan_id = loans.id
          )`
        )
      )
    )
    .where(
      and(eq(loans.loanStatus, "Active"), eq(payments.paymentStatus, "Pending"))
    )
    .groupBy(customers.id, loans.id, payments.id, emails.createdAt)
    .orderBy(asc(payments.dueDate))
    .execute();
  // console.log("getNextPayment", results);
  return results;
};
