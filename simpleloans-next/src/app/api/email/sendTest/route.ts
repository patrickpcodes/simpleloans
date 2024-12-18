import { Client, SendEmailV3, LibraryResponse } from "node-mailjet";

export async function GET() {
  try {
    if (!process.env.MJ_APIKEY_PUBLIC || !process.env.MJ_APIKEY_PRIVATE) {
      throw new Error(
        "Mailjet API keys are missing from environment variables."
      );
    }

    const mailjet = new Client({
      apiKey: process.env.MJ_APIKEY_PUBLIC,
      apiSecret: process.env.MJ_APIKEY_PRIVATE,
    });

    const now = new Date();
    const data: SendEmailV3.Body = {
      FromEmail: "info@patrickpetropoulos.com",
      FromName: "Mailjet Pilot",
      Subject: `Your email flight plan! ${now.toISOString()}`,
      "Text-part":
        "Dear passenger, welcome to Mailjet! May the delivery force be with you!",
      "Html-part":
        '<h3>Dear passenger, welcome to <a href="https://www.mailjet.com/">Mailjet</a>!<br />May the delivery force be with you!',
      Recipients: [{ Email: "robobat91@gmail.com" }],
    };

    console.log("Sending email data:", data);
    const result: LibraryResponse<SendEmailV3.Response> = await mailjet
      .post("send", { version: "v3" })
      .request(data);

    console.log("Email sent successfully:", JSON.stringify(result.body));

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
