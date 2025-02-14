import { getNextPayments } from "@/lib/queries/getNextPayments";
import { Email } from "@/types/Email";
import { UpcomingPayment } from "@/types/UpcomingPayment";
import { generateEmailText, sendEmail } from "@/utils/emails";
import { formatDateToDateOnly } from "@/utils/formatDateToDateOnly";
import { groupPayments } from "@/utils/payments";

export async function GET() {
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
      console.log("groupedPayments", groupedPayments);
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
      return new Response(
        JSON.stringify({ message: "Sent email successfully!" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("Error fetching upcoming payments:", error);
    }

    // const mailjet = new Client({
    //   apiKey: process.env.MJ_APIKEY_PUBLIC,
    //   apiSecret: process.env.MJ_APIKEY_PRIVATE,
    // });

    // const data: SendEmailV3.Body = {
    //   FromEmail: "info@patrickpetropoulos.com",
    //   FromName: "Mailjet Pilot",
    //   Subject: `Your email flight plan! ${now.toISOString()}`,
    //   "Text-part":
    //     "Dear passenger, welcome to Mailjet! May the delivery force be with you!",
    //   "Html-part":
    //     '<h3>Dear passenger, welcome to <a href="https://www.mailjet.com/">Mailjet</a>!<br />May the delivery force be with you!',
    //   Recipients: [{ Email: "robobat91@gmail.com" }],
    // };

    // console.log("Sending email data:", data);
    // const result: LibraryResponse<SendEmailV3.Response> = await mailjet
    //   .post("send", { version: "v3" })
    //   .request(data);

    // console.log("Email sent successfully:", JSON.stringify(result.body));
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
