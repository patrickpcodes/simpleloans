import { getNextPayments } from "@/lib/queries/getNextPayments";
import { Email } from "@/types/Email";
import { UpcomingPayment } from "@/types/UpcomingPayment";
import { generateEmailText, sendEmail } from "@/utils/emails";
import { formatDateToDateOnly } from "@/utils/formatDateToDateOnly";
import { groupPayments } from "@/utils/payments";
import { NextResponse } from "next/server";

export async function GET() {
  console.log("In sendDaily");
  console.log("Cron job triggered at:", new Date().toISOString());
  try {
    if (!process.env.MJ_APIKEY_PUBLIC || !process.env.MJ_APIKEY_PRIVATE) {
      throw new Error(
        "Mailjet API keys are missing from environment variables."
      );
    }
    try {
      const rawUpcomingPayments = await getNextPayments();

      // Transform the data to match UpcomingPayment type
      const upcomingPayments: UpcomingPayment[] = rawUpcomingPayments
        .filter((payment) => payment.loan && payment.payment) // Filter out null loans/payments
        .map((payment) => ({
          ...payment,
          lastReminderSent:
            (payment.lastReminderSent &&
              formatDateToDateOnly(payment.lastReminderSent)) ??
            "",
          loan: payment.loan!, // We know it's not null from the filter
          payment: payment.payment!, // We know it's not null from the filter
        }));
      const groupedPayments = groupPayments(upcomingPayments);
      console.log("groupedPayments Today", groupedPayments.today);
      console.log("I am in sendTest about to send the email");
      const now = new Date();
      groupedPayments.today.map(async (today) => {
        const emailText = generateEmailText(
          today.customerName,
          today.payment.amountDue,
          today.payment.dueDate
        );
        const emailToSend: Email = {
          subject: `Reminder for Upcoming Payment : ${formatDateToDateOnly(
            now
          )}`,
          toEmails: [today.customerEmail],
          text: emailText,
          html: "",
        };
        await sendEmail(emailToSend, today.loan.id ?? 0);
      });
      console.log("groupedPayments Tomorrow", groupedPayments.tomorrow);
      groupedPayments.tomorrow.map(async (today) => {
        const emailText = generateEmailText(
          today.customerName,
          today.payment.amountDue,
          today.payment.dueDate
        );
        const emailToSend: Email = {
          subject: `Reminder for Upcoming Payment : ${formatDateToDateOnly(
            now
          )}`,
          toEmails: [today.customerEmail],
          text: emailText,
          html: "",
        };
        await sendEmail(emailToSend, today.loan.id ?? 0);
      });
      return NextResponse.json({
        status: 200,
        message: "Cron job executed successfully",
      });
    } catch (error) {
      console.error("Error fetching upcoming payments:", error);
      return NextResponse.json({
        status: 500,
        message: "Cron job failed, Error fetching upcoming payments",
        //error: error.message,
      });
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error("Error sending email:", e.message);
      return NextResponse.json({
        status: 500,
        message: "Cron job failed, Failed to send email",
        //error: error.message,
      });
    }
  }
}
