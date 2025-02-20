import { db } from "@/db";
import { emails } from "@/db/schema";
import { Email } from "@/types/Email";
import { Client, SendEmailV3, LibraryResponse } from "node-mailjet";

async function sendEmail(email: Email, loanId: number) {
  if (!process.env.MJ_APIKEY_PUBLIC || !process.env.MJ_APIKEY_PRIVATE) {
    throw new Error("Mailjet API keys are missing from environment variables.");
  }
  console.log("in send email api endpoint");
  const emailToSend: Email = {
    subject: email.subject,
    toEmails: email.toEmails,
    text: email.text,
    html: email.html,
  };
  const mailjet = new Client({
    apiKey: process.env.MJ_APIKEY_PUBLIC,
    apiSecret: process.env.MJ_APIKEY_PRIVATE,
  });
  const bccEmails = ["patrickpetropoulos@gmail.com"]; //, "stevenkawar@hotmail.com"];
  const bccEmailString = bccEmails.map((email) => `<${email}>`).join(", ");
  // const recipientList = emailToSend.toEmails.map((emailIn) => ({
  //   Email: emailIn,
  // }));
  //TODO Remove this
  emailToSend.toEmails = ["patrickpetropoulos@protonmail.com"];
  const to = emailToSend.toEmails.map((emailIn) => `<${emailIn}>`).join(", ");
  console.log(to);
  const data: SendEmailV3.Body = {
    FromEmail: "info@simpleloans500.com",
    FromName: "SimpleLoans",
    Subject: email.subject,
    "Text-part": email.text,
    "Html-part": email.html || "",
    //FIXME
    To: to,
    Bcc: bccEmailString,
  };
  console.log("Sending email data:", data);
  const result: LibraryResponse<SendEmailV3.Response> = await mailjet
    .post("send", { version: "v3" })
    .request(data);

  console.log("Email sent successfully:", JSON.stringify(result.body));

  //create email in db

  const newEmail = await db
    .insert(emails)
    .values({
      loanId: loanId,
      subject: email.subject,
      emailText: email.text,
      emailHtml: email.html || null,
      to: email.toEmails.join(","),
      bcc: bccEmailString,
      sent: true,
    })
    .returning({ id: emails.id });
  console.log("newEmail", newEmail);
  return result.body;
}

export async function POST(request: Request) {
  const { email, loanId } = await request.json();
  if (!email.subject || !email.toEmails || !email.text) {
    return new Response(
      JSON.stringify({ message: "Missing required fields." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  try {
    const response = await sendEmail(email, loanId);
    return new Response(
      JSON.stringify({
        message: "Sent email successfully!",
        response: response,
      })
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
