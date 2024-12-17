export default async function handler(req, res) {
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

    // Perform your task logic here
    res.status(200).json({ message: "Cron job executed successfully", data });
  } catch (error) {
    console.error("Error in cron job:", error);
    res.status(500).json({ message: "Cron job failed", error: error.message });
  }
}
