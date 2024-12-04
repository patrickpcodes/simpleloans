import { getLoan } from "./getLoan";
import { generateChanges } from "@/utils/generateChanges";
import { db } from "@/db";
import { loans, history } from "@/db/schema";
import { desc, eq, and } from "drizzle-orm";
import { Loan } from "@/zod-schemas/loan";

export async function updateLoan(
  updatedLoan: Loan,
  userEmail: string,
  displayName: string
) {
  if (updatedLoan.id === undefined) {
    throw new Error("Loan ID is required.");
  }
  const existingLoanData = await getLoan(updatedLoan.id);

  if (!existingLoanData) {
    throw new Error(`Loan with ID ${updatedLoan.id} not found.`);
  }

  const trackedFields: (keyof Loan)[] = ["notes"];
  const existingLoan: Loan = existingLoanData.loan;

  const changes = generateChanges(existingLoan, updatedLoan, trackedFields);

  if (changes.length === 0) {
    return { status: 304, message: "No changes detected." };
  }
  await db.insert(history).values({
    type: "Loan",
    referenceId: updatedLoan.id,
    changes: changes,
    userEmail,
    displayName,
    timestamp: new Date(),
  });

  await db.update(loans).set(updatedLoan).where(eq(loans.id, updatedLoan.id));

  const updateHistory = await db
    .select()
    .from(history)
    .where(
      and(eq(history.referenceId, updatedLoan.id), eq(history.type, "Loan"))
    )
    .orderBy(desc(history.timestamp));

  return {
    loan: { ...existingLoan, ...updatedLoan },
    history: updateHistory,
  };
}
