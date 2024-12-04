"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LoanDetail } from "@/types/LoanDetail";
import { MultiLoanDisplay } from "@/components/loan/MultiLoanDisplay";

export default function Seed() {
  const [loanDetails, setLoanDetails] = useState<LoanDetail[]>([]);
  const [shouldRefresh, setShouldRefresh] = useState(false); // State to trigger re-fetch
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Function to fetch all customers
  const fetchLoans = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/loans", {
        method: "GET", // Ensure the method is GET
      });
      const data = await response.json();
      console.log(data);
      setLoanDetails(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
    setIsLoading(false);
  };

  // Fetch customers on initial load and when `shouldRefresh` changes
  useEffect(() => {
    fetchLoans();
    if (shouldRefresh) {
      setShouldRefresh(false); // Reset refresh state after fetching
    }
  }, [shouldRefresh]);

  const handleRowClick = (id: number | undefined) => {
    if (!id) return;
    router.push(`/loans/form?loanId=${id}`);
  };

  return (
    <div>
      <h2>Loan Page</h2>
      <Button onClick={() => router.push("/loans/form")}>
        Create New Loan
      </Button>
      {isLoading && <p>Loading...</p>}
      <div className="h-px bg-gray-300 w-full my-4"></div>
      {loanDetails.length > 0 && (
        <MultiLoanDisplay
          loanDetails={loanDetails}
          onRowClick={handleRowClick}
        />
      )}
    </div>
  );
}
