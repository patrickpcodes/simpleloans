// pages/api/getCustomers.js
import { db } from "@/db";
import { customers } from "@/db/schema";

export async function GET() {
  try {
    // Fetch all customers from the database
    const allCustomers = await db.select().from(customers);

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
