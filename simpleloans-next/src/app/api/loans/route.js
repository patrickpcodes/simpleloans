import { db } from "@/db";
import { loans, payments } from "@/db/schema";
import { getAllLoans } from "@/lib/queries/getLoans";
import { generatePayments } from "@/lib/queries/generatePayments";
import { updateLoan } from "@/lib/queries/updateLoan";

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
      loanStatus: data.loanStatus,
      defaultPaymentMethod: data.defaultPaymentMethod,
      firstPaymentDate: data.firstPaymentDate,
      notes: data.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const newLoan = await db.insert(loans).values(loanToInsert).returning();
    console.log("newLoan", newLoan);

    // loanToInsert.id = newLoan; // Store the loan ID for payments

    const paymentList = generatePayments(newLoan[0]); // Generate payments for the loan
    console.log("paymentList", paymentList);

    await db.insert(payments).values(paymentList); // Insert payments in bulk
    return new Response(JSON.stringify(newLoan), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating loan:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create customer." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
export async function PUT(req) {
  console.log("in loan PUT");
  try {
    const data = await req.json();
    console.log("in loan PUT", data);
    if (!data.id) {
      return new Response(
        JSON.stringify({ error: "Loan ID is required for updates." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    const result = await updateLoan(data, "p@p.com", "Patrick");

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating loan:", error);
    return new Response(JSON.stringify({ error: "Failed to update loan." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
