import { Email } from "@/types/Email";
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

const BASE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function sendEmail(email: Email, loanId: number) {
  console.log("sending email from url", BASE_URL);
  const response = await fetch(`${BASE_URL}/api/email/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, loanId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to send email");
  }

  return response.json();
}
