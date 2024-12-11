import { getNextPayments } from "@/lib/queries/getNextPayments";

export async function GET() {
  try {
    const upcomingPayments = await getNextPayments();
    return new Response(JSON.stringify(upcomingPayments), {
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
