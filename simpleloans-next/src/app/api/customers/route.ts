import { db } from "@/db";
import { customers, emails, loans, payments } from "@/db/schema";
import { getCustomerData } from "@/lib/queries/getCustomerData";
// import { getNextPayments } from "@/lib/queries/getNextPayments";
import { updateCustomer } from "@/lib/queries/updateCustomer";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch all customers from the database
    const allCustomers = await getCustomerData();
    // const testing = await getNextPayments();
    // console.log("allCustomers", allCustomers);
    // Return the data as a JSON response
    return new Response(JSON.stringify(allCustomers), {
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

// POST: Create a new customer
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    console.log("in customer POST", data);
    // Validate input
    if (!data.name || !data.email || !data.phone || !data.birthdate) {
      return new Response(
        JSON.stringify({ error: "Missing required fields." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    // TODO Add in history
    const newCustomer = await db
      .insert(customers)
      .values({
        name: data.name,
        email: data.email,
        phone: data.phone,
        birthdate: data.birthdate,
        references: data.references || null,
        notes: data.notes || null,
        canSendSpecialEmails: data.canSendSpecialEmails ?? false,
        active: data.active ?? true,
      })
      .returning({ id: customers.id });

    return new Response(JSON.stringify(newCustomer), {
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

// PUT: Update an existing customer
export async function PUT(req: NextRequest) {
  console.log("in customer PUT");
  try {
    const { user, customer } = await req.json();
    console.log("in customer PUT", customer);

    // Validate input
    if (!customer.id) {
      return new Response(
        JSON.stringify({ error: "Customer ID is required for updates." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    const result = await updateCustomer(customer, user.email, user.name);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating customer:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update customer." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
export async function DELETE(request: NextRequest) {
  const body = await request.json();
  const customerId = body.customerId;

  if (!customerId) {
    return NextResponse.json({ error: "Invalid customer ID" }, { status: 400 });
  }
  console.log("in delete customers");

  if (!customerId) {
    return Response.json({ error: "Invalid customer ID" }, { status: 400 });
  }

  try {
    // 1. Get all loans for this customer
    const customerLoans = await db
      .select({ id: loans.id })
      .from(loans)
      .where(eq(loans.customerId, customerId));

    const loanIds = customerLoans.map((loan) => loan.id);

    // 2. Delete all emails associated with customer's loans
    if (loanIds.length > 0) {
      for (const loanId of loanIds) {
        await db.delete(emails).where(eq(emails.loanId, loanId));
      }
    }

    // 3. Delete all history records
    // await db.delete(histories).where(eq(histories.customerId, customerId));

    // 4. Delete all payments associated with customer's loans
    for (const loanId of loanIds) {
      await db.delete(payments).where(eq(payments.loanId, loanId));
    }

    // 5. Delete all loans
    await db.delete(loans).where(eq(loans.customerId, customerId));

    // 6. Finally, delete the customer
    await db.delete(customers).where(eq(customers.id, customerId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting customer:", error);
    return Response.json(
      { error: "Failed to delete customer" },
      { status: 500 }
    );
  }
}
