"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CustomerDetail } from "@/types/CustomerDetail";
import { MultiCustomerDisplay } from "@/components/customer/MultiCustomerDisplay";

export default function Seed() {
  const [customerList, setCustomers] = useState<CustomerDetail[]>([]);
  const [shouldRefresh, setShouldRefresh] = useState(false); // State to trigger re-fetch
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Function to fetch all customers
  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/customers", {
        method: "GET", // Ensure the method is GET
      });
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
    setIsLoading(false);
  };

  // Fetch customers on initial load and when `shouldRefresh` changes
  useEffect(() => {
    fetchCustomers();
    if (shouldRefresh) {
      setShouldRefresh(false); // Reset refresh state after fetching
    }
  }, [shouldRefresh]);

  const handleRowClick = (id: number) => {
    router.push(`/customers/form?customerId=${id}`);
  };

  return (
    <div>
      <h2>Customer Page</h2>
      <Button onClick={() => router.push("/customers/form")}>
        Create New Customer
      </Button>
      {isLoading && <p>Loading...</p>}
      {customerList.length > 0 && (
        <MultiCustomerDisplay
          customerDetails={customerList}
          onRowClick={handleRowClick}
        />
      )}
      {/* {customerList.length > 0 && (
        <CustomerTableView
          customers={customerList}
          onRowClick={handleRowClick}
        />
      )} */}
    </div>
  );
}
