"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Seed() {
  // const [loanList, setLoans] = useState<Loan[]>([]);
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
      // setLoans(data);
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

  // const handleRowClick = (id: number) => {
  //   router.push(`/loans/form?loanId=${id}`);
  // };

  return (
    <div>
      <h2>Loan Page</h2>
      <Button onClick={() => router.push("/loans/form")}>
        Create New Loan
      </Button>
      {isLoading && <p>Loading...</p>}
      {/* {customerList.length > 0 && (
        <CustomerTableView
          customers={customerList}
          onRowClick={handleRowClick}
        />
      )} */}
    </div>
  );
}
