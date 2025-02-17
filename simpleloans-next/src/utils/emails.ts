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
  console.log("vercel url", process.env.VERCEL_URL);
  console.log("sending email from url", BASE_URL);
  console.log("sending email, email data", email);
  try {
    const response = await fetch(`${BASE_URL}/api/email/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, loanId }),
    });

    // Add response validation
    if (!response.ok) {
      const text = await response.text(); // Get the raw response text
      console.error("Email API Error Response:", {
        status: response.status,
        statusText: response.statusText,
        body: text,
      });
      throw new Error(
        `Email API error: ${response.status} ${response.statusText}`
      );
    }

    // Try to parse JSON response safely
    let data;
    try {
      data = await response.json();
    } catch (e) {
      console.error("Failed to parse JSON response:", await response.text());
      console.log("error", e);
      throw new Error("Invalid JSON response from email API");
    }

    // Validate the response data
    if (!data || typeof data !== "object") {
      throw new Error("Invalid response format from email API");
    }

    return data;
  } catch (error) {
    console.error("Send Email Error:", error);
    throw error; // Re-throw to handle it in the calling function
  }
}
