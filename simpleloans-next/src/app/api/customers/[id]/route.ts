import { db } from "@/db";
import { customers, loans, payments, emails } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // If you want the number version of the ID:
  const customerId = parseInt(params.id, 10);
  console.log("in delete customers");

  if (!customerId) {
    return Response.json({ error: "Invalid customer ID" }, { status: 400 });
  }

  try {
    // Start a transaction to ensure all deletes succeed or none do
    await db.transaction(async (tx) => {
      // 1. Delete all emails associated with customer's loans
      const customerLoans = await tx
        .select({ id: loans.id })
        .from(loans)
        .where(eq(loans.customerId, customerId));

      const loanIds = customerLoans.map((loan) => loan.id);

      if (loanIds.length > 0) {
        await tx.delete(emails).where(eq(emails.loanId, loanIds[0])); // Using first loan as example
      }

      // // 2. Delete all history records
      // await tx.delete(history).where(and(eq(history.referenceId, customerId), eq(history.type, "Customer"));

      // 3. Delete all payments associated with customer's loans
      for (const loanId of loanIds) {
        await tx.delete(payments).where(eq(payments.loanId, loanId));
      }

      // 4. Delete all loans
      await tx.delete(loans).where(eq(loans.customerId, customerId));

      // 5. Finally, delete the customer
      await tx.delete(customers).where(eq(customers.id, customerId));
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting customer:", error);
    return NextResponse.json(
      { error: "Failed to delete customer" },
      { status: 500 }
    );
  }
}
