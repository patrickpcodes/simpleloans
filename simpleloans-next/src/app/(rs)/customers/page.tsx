"use client";

import { useEffect, useState } from "react";
import { customers } from "@/db/schema";
import type { InferSelectModel } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { CustomerTableView } from "@/components/CustomerTableView";
import { useRouter } from "next/navigation";

type Customer = InferSelectModel<typeof customers>;
export default function Seed() {
  const [customerList, setCustomers] = useState<Customer[]>([]);
  const [shouldRefresh, setShouldRefresh] = useState(false); // State to trigger re-fetch
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Function to fetch all customers
  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/getCustomers", {
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

  return (
    <div>
      <h2>Customer Page</h2>
      <Button onClick={() => router.push("/customers/create")}>
        Create New Customer
      </Button>
      {isLoading && <p>Loading...</p>}
      {customerList.length > 0 && (
        <CustomerTableView customers={customerList} />
      )}
    </div>
  );
}
