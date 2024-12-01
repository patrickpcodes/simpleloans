"use client";
import { useEffect, useState } from "react";
import { customers } from "@/db/schema";
import type { InferSelectModel } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { CustomerTableView } from "@/components/CustomerTableView";

type Customer = InferSelectModel<typeof customers>;
export default function Seed() {
  const [customerList, setCustomers] = useState<Customer[]>([]);
  const [message, setMessage] = useState("");
  const [shouldRefresh, setShouldRefresh] = useState(false); // State to trigger re-fetch

  // Function to seed customers
  const seedCustomers = async () => {
    try {
      const response = await fetch("/api/seedCustomers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setShouldRefresh(true); // Trigger re-fetch of customers
      } else {
        setMessage(data.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Failed to seed customers");
    }
  };

  // Function to fetch all customers
  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/getCustomers", {
        method: "GET", // Ensure the method is GET
      });
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
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
      <h2>Seed Page</h2>
      <Button onClick={seedCustomers}>Seed Customers</Button>
      {message && <p>{message}</p>}
      {customerList && <CustomerTableView customers={customerList} />}
    </div>
  );
}
