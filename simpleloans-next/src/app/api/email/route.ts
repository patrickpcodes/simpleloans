import { NextResponse } from "next/server";

export async function GET() {
  // if (
  //   req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  // ) {
  //   return res.status(401).end("Unauthorized");
  // }
  try {
    console.log("Cron job triggered at:", new Date().toISOString());

    // Call another internal API endpoint
    const response = await fetch(
      "https://simpleloans.vercel.app/api/email/sendTest",
      {
        method: "GET",
      }
    );

    const data = await response.json();
    console.log("Response from other API:", data);
    return NextResponse.json({
      status: 200,
      message: "Cron job executed successfully",
      data,
    });
    // Perform your task logic here
    // res.status(200).json({ message: "Cron job executed successfully", data });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: 500,
      message: "Cron job failed",
      // error: error.message,
    });
    // console.error("Error in cron job:", error);
    // res.status(500).json({ message: "Cron job failed", error: error.message });
  }
}
