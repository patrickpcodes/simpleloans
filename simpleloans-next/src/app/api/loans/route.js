import { db } from "@/db";
import { loans, payments } from "@/db/schema";
import { getAllLoans } from "@/lib/queries/getLoans";
import { generatePayments } from "@/lib/queries/generatePayments";

export async function GET() {
  try {
    // Fetch all customers from the database
    const allLoanDetails = await getAllLoans();
    console.log("allLoanDetails", allLoanDetails);
    // Return the data as a JSON response
    return new Response(JSON.stringify(allLoanDetails), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch customers." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
export async function POST(req) {
  console.log("GOt POST");
  try {
    const data = await req.json();
    if (!data.customerId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    const loanToInsert = {
      customerId: data.customerId,
      numberOfPayments: data.numberOfPayments,
      paymentFrequency: data.paymentFrequency,
      initialBorrowedAmount: data.initialBorrowedAmount,
      initialDueAmount: data.initialDueAmount,
      firstPaymentDate: data.firstPaymentDate,
      notes: data.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const newLoan = await db
      .insert(loans)
      .values(loanToInsert)
      .returning({ id: loans.id });
    console.log("newLoan", newLoan);

    // loanToCreate.id = newLoan; // Store the loan ID for payments

    const paymentList = generatePayments(loanToInsert); // Generate payments for the loan
    console.log("paymentList", paymentList);

    await db.insert(payments).values(paymentList); // Insert payments in bulk
    return new Response(JSON.stringify(newLoan), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating customer:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create customer." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
