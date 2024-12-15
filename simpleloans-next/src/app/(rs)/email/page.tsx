"use client";
import { Button } from "@/components/ui/button";
// export const metadata = {
//   title: "Home",
// };

export default function Email() {
  const sendEmail = async () => {
    const response = await fetch("/api/email/sendTest");
    if (response.ok) {
      console.log("Email sent");
    } else {
      console.error("Failed to send email");
    }
  };

  return (
    <div>
      <h2>Send Email</h2>
      <div>
        <Button onClick={() => sendEmail()}>Email</Button>
      </div>
    </div>
  );
}
