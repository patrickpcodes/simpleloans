import { updatePayment } from "@/lib/queries/updatePayment";

export async function PUT(req) {
  console.log("in payment PUT");
  try {
    const { user, payment } = await req.json();
    console.log("payment", payment);
    console.log("user in api", user);
    if (!payment.id) {
      return new Response(
        JSON.stringify({ error: "Payment ID is required!" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    await updatePayment(payment, user.email, user.name);
    return new Response(
      JSON.stringify({ message: "Payment added successfully!" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error creating payment:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create payment." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
