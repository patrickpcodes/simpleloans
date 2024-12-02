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
  const seedData = async () => {
    console.log("seed");
    try {
      const response = await fetch("/api/seed", {
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
  const deleteData = async () => {
    try {
      const response = await fetch("/api/seed", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete data.");
      }

      //   const result = await response.json();
      setShouldRefresh(true); // Trigger re-fetch of customers
      // setSuccess(result.message);
    } finally {
      // catch (err: any) {
      // setError(err.message);
      // }
      //   setLoading(false);
    }
  };
  // Function to fetch all customers
  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/customers", {
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
      <Button onClick={seedData}>Seed Customers</Button>
      <Button variant="destructive" onClick={deleteData}>
        Delete Data
      </Button>
      {message && <p>{message}</p>}
      {customerList && (
        <CustomerTableView
          customers={customerList}
          onRowClick={() => console.log("Clicked to Generate")}
        />
      )}
    </div>
  );
}
