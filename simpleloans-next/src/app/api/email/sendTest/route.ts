import { Client, SendEmailV3, LibraryResponse } from "node-mailjet";

export async function GET() {
  try {
    const mailjet = new Client({
      apiKey: process.env.MJ_APIKEY_PUBLIC!,
      apiSecret: process.env.MJ_APIKEY_PRIVATE!,
    });
    // const email = "patrickpetropoulos@gmail.com";
    // Get the current Date and Time
    const now = new Date();
    (async () => {
      const data: SendEmailV3.Body = {
        FromEmail: "info@patrickpetropoulos.com",
        FromName: "Mailjet Pilot",
        Subject: "Your email flight plan! " + now.toISOString(),
        "Text-part":
          "Dear passenger, welcome to Mailjet! May the delivery force be with you!",
        "Html-part":
          '<h3>Dear passenger, welcome to <a href="https://www.mailjet.com/">Mailjet</a>!<br />May the delivery force be with you!',
        Recipients: [{ Email: "robobat91@gmail.com" }],
        // Messages: [
        //   {
        //     From: {
        //       Email: "patrickpetropoulos@gmail.com",
        //     },
        //     To: [
        //       {
        //         Email: "robobat91@gmail.com",
        //       },
        //     ],
        //     // TemplateErrorReporting: {
        //     //   Email: "patrickpetropoulos@protonmail.com",
        //     //   Name: "Reporter",
        //     // },
        //     Subject: "Your email flight plan!",
        //     HTMLPart:
        //       "<h3>Dear passenger, welcome to Mailjet!</h3><br />May the delivery force be with you!",
        //     TextPart:
        //       "Dear passenger, welcome to Mailjet! May the delivery force be with you!",
        //   },
        // ],
      };
      console.log("sending email data", data);
      const result: LibraryResponse<SendEmailV3.Response> = await mailjet
        .post("send", { version: "v3" })
        .request(data);
      console.log("result body stringified", JSON.stringify(result.body));
      //   const { Status } = result.body.Messages[0];
      //   console.log("status", Status);
      console.log("result body", result.body);
    })();
    console.log("mj api key public", process.env.MJ_APIKEY_PUBLIC);
    return new Response(
      JSON.stringify({
        message: `Sent email successfully!`,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    console.error("Error sending email", e);
  }
}
