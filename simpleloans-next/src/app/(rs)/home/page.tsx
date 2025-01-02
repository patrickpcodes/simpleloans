"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { UpcomingPayment } from "@/types/UpcomingPayment";
import { PaymentActionTable } from "@/components/PaymentActionTable";

// export const metadata = {
//   title: "Home",
// };

export default function Home() {
  const router = useRouter();
  const [shouldRefresh, setShouldRefresh] = useState(false); // State to trigger re-fetch
  const [upcomingPayments, setUpcomingPayments] = useState<UpcomingPayment[]>(
    []
  );
  const fetchReport = async () => {
    const response = await fetch("/api/reports/export");
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "customers.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } else {
      console.error("Failed to download customers CSV");
    }
  };
  const fetchPaymentData = async () => {
    try {
      const response = await fetch("/api/payments/upcoming", {
        method: "GET", // Ensure the method is GET
      });
      const data = await response.json();
      console.log("data", data);
      setUpcomingPayments(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };
  useEffect(() => {
    fetchPaymentData();
    if (shouldRefresh) {
      setShouldRefresh(false); // Reset refresh state after fetching
    }
  }, [shouldRefresh]);
  return (
    <div>
      <h2>Home Page</h2>
      <div>
        <Button onClick={() => router.push("/customers")}>Customers</Button>
        <Button onClick={() => router.push("/loans")}>Loans</Button>
      </div>
      {/* <div>
        <Button onClick={() => fetchReport()}>Customer Report</Button>
      </div> */}
      <h3>Upcoming Payments</h3>
      {upcomingPayments.length > 0 ? (
        <PaymentActionTable upcomingPayments={upcomingPayments} />
      ) : (
        <p>No upcoming payments</p>
      )}
    </div>
  );
}
