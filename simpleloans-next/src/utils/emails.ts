import { db } from "@/db";
import { emails } from "@/db/schema";
import { Email } from "@/types/Email";
import { Client, SendEmailV3, LibraryResponse } from "node-mailjet";
import { formatDateStringToMonthDayYear } from "./formatDateToDateOnly";
import { formatStringToDollar } from "./formatStringToDollar";

export function generateEmailText(
  name: string,
  dueAmount: string,
  dueDate: string
): string {
  return `Good morning ${name},\nJust a reminder that a payment of ${formatStringToDollar(
    dueAmount
  )} is due to be made on ${formatDateStringToMonthDayYear(
    dueDate
  )} by e-transfer to info@simpleloans500.com. Please ensure this payment arrangement is respected, in order to avoid a required $65 missed payment fee, as per stated in your contract. Also, please ensure that the payment is made in the morning as Collection follow-ups are done around noon.\nThank you and have a great day`;
}
export function generateEmailHtml(
  name: string,
  dueAmount: string,
  dueDate: string
): string {
  return `<p>Good morning ${name},</p><p>Just a reminder that a payment of ${formatStringToDollar(
    dueAmount
  )} is due to be made on ${formatDateStringToMonthDayYear(
    dueDate
  )} by e-transfer to info@simpleloans500.com. Please ensure this payment arrangement is respected, in order to avoid a required $65 missed payment fee, as per stated in your contract. Also, please ensure that the payment is made in the morning as Collection follow-ups are done around noon.</p><p>Thank you and have a great day</p>`;
}

export async function sendEmail(email: Email, loanId: number) {
  if (!process.env.MJ_APIKEY_PUBLIC || !process.env.MJ_APIKEY_PRIVATE) {
    throw new Error("Mailjet API keys are missing from environment variables.");
  }
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
  // const recipientList = emailToSend.toEmails.map((emailIn) => ({
  //   Email: emailIn,
  // }));
  const to = emailToSend.toEmails.map((emailIn) => `<${emailIn}>`).join(", ");
  console.log(to);
  const data: SendEmailV3.Body = {
    FromEmail: "info@patrickpetropoulos.com",
    FromName: "SimpleLoans",
    Subject: email.subject,
    "Text-part": email.text,
    "Html-part": email.html || "",
    //FIXME
    To: "patrickpetropoulos@protonmail.com",
    Bcc: "<patrickpetropoulos@gmail.com>, <stevenkawar@hotmail.com>",
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
      sent: true,
    })
    .returning({ id: emails.id });
  console.log("newEmail", newEmail);
}
