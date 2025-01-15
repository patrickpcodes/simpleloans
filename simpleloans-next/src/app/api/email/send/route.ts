import { sendEmail } from "@/utils/emails";

export async function POST(request: Request) {
  const { email, loanId } = await request.json();
  if (!email.subject || !email.toEmails || !email.text) {
    return new Response(
      JSON.stringify({ message: "Missing required fields." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  try {
    await sendEmail(email, loanId);
    return new Response(
      JSON.stringify({ message: "Sent email successfully!" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error("Error sending email:", e.message);
      return new Response(
        JSON.stringify({ message: "Failed to send email.", error: e.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  }
}
