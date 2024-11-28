"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Customer } from "@/types/Customer";

// Fetch customers from the API
const fetchCustomers = async (): Promise<Customer[]> => {
  const response = await fetch("https://localhost:7238/api/customers"); // Update the URL if your API is hosted elsewhere
  if (!response.ok) {
    throw new Error("Failed to fetch customers");
  }
  const customers = await response.json();

  // Ensure dates are in YYYY-MM-DD format
  return customers.map((customer: Customer) => ({
    ...customer,
    birthday: customer.birthday.split("T")[0], // Strip time if present
  }));
};

const CustomerTable: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setLoading(true);
        const data = await fetchCustomers();
        setCustomers(data);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching customers.");
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  const handleRowClick = (id: string) => {
    router.push(`/customers/${id}`);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Customer Management</h1>
      {loading ? (
        <p>Loading customers...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Birthday</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow
                key={customer.id}
                onClick={() => handleRowClick(customer.id)}
                className="cursor-pointer"
              >
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.phoneNumber}</TableCell>
                <TableCell>{customer.birthday}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.notes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default CustomerTable;
