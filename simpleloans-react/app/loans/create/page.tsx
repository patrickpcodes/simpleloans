"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import customersData from "../../../data/customers.json";

interface Customer {
  id: number;
  name: string;
}

const LoanCreate: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [numberOfWeeks, setNumberOfWeeks] = useState<number>(0);
  const [frequency, setFrequency] = useState<string>("weekly");
  const [amount, setAmount] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const customerId = searchParams.get("customerId");

  useEffect(() => {
    setCustomers(customersData);
    if (customerId) {
      setSelectedCustomer(parseInt(customerId));
    }
  }, [customerId]);

  const handleSave = () => {
    // Save logic here
    console.log("Loan created:", {
      selectedCustomer,
      startDate,
      numberOfWeeks,
      frequency,
      amount,
      interestRate,
    });
    router.push("/customers");
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Create New Loan</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Customer
        </label>
        <select
          name="customer"
          value={selectedCustomer ?? ""}
          onChange={(e) => setSelectedCustomer(parseInt(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Start Date
        </label>
        <input
          type="date"
          name="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Number of Weeks
        </label>
        <input
          type="number"
          name="numberOfWeeks"
          value={numberOfWeeks}
          onChange={(e) => setNumberOfWeeks(parseInt(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Frequency
        </label>
        <input
          type="text"
          name="frequency"
          value={frequency}
          readOnly
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Amount
        </label>
        <input
          type="number"
          name="amount"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Interest Rate (%)
        </label>
        <input
          type="number"
          name="interestRate"
          value={interestRate}
          onChange={(e) => setInterestRate(parseFloat(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <Button onClick={handleSave}>Save</Button>
    </div>
  );
};

export default LoanCreate;
