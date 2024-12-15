"use client";
import { Button } from "@/components/ui/button";

// export const metadata = {
//   title: "Home",
// };

export default function Dowload() {
  const fetchReport = async () => {
    const response = await fetch("/api/reports/export");
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "reports.zip");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } else {
      console.error("Failed to download customers CSV");
    }
  };
  return (
    <div>
      <h2>Download Reports Page</h2>
      <div>
        <Button onClick={() => fetchReport()}>Download CSV Report</Button>
      </div>
    </div>
  );
}
