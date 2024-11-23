"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import customersData from "../../../data/customers.json";
import { formatCurrency } from "@/lib/utils";
import { Customer } from "@/types/Customer";
import { Payment } from "@/types/Payment";
import { useTitle } from "@/app/layout";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";

const LoanCreate: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<string>("2024-11-04");
  const [numberOfWeeks, setNumberOfWeeks] = useState<number>(8);
  const [frequency, setFrequency] = useState<string>("Bi-Weekly");
  const [loanAmount, setAmount] = useState<number>(1000);
  const [interestRate, setInterestRate] = useState<number>(0);
  const [totalToPayBack, setTotalToPayBack] = useState<number>(0);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const customerId = searchParams.get("customerId");
  const { setTitle } = useTitle();

  const frequencyOptions = ["Weekly", "Bi-Weekly", "Monthly"];
  const { toast } = useToast();
  setTitle("Create New Loan");

  useEffect(() => {
    setCustomers(customersData);
    if (customerId) {
      setSelectedCustomer(parseInt(customerId));
    }
  }, [customerId]);

  const handleInterestRateBlur = () => {
    if (interestRate && loanAmount && numberOfWeeks) {
      const weeklyInterestRate = interestRate / 52 / 100;
      const totalAmount = loanAmount * (1 + weeklyInterestRate * numberOfWeeks);
      setTotalToPayBack(totalAmount);
    }
  };

  const handleTotalToPayBackBlur = () => {
    if (totalToPayBack && loanAmount && numberOfWeeks) {
      const weeklyInterestRate =
        ((totalToPayBack / loanAmount - 1) / numberOfWeeks) * 52 * 100;
      setInterestRate(weeklyInterestRate);
    }
  };
  const handleClear = () => {
    setPayments([]);
  };
  const handleGenerate = () => {
    const weeklyInterestRate = interestRate / 52 / 100;
    const totalAmount = loanAmount * (1 + weeklyInterestRate * numberOfWeeks);
    const weeklyPayment = totalAmount / numberOfWeeks;
    let remainingAmount = totalAmount;
    const newPayments: Payment[] = [];
    for (let i = 0; i < numberOfWeeks; i++) {
      const paymentDate = new Date(startDate);
      console.log(startDate);
      if (!isNaN(paymentDate.getTime())) {
        paymentDate.setDate(paymentDate.getDate() + i * 7);
        remainingAmount -= weeklyPayment;
        newPayments.push({
          date: paymentDate.toISOString().split("T")[0],
          amount: weeklyPayment,
          remainingAmount: remainingAmount,
        });
      }
    }
    setPayments(newPayments);
  };

  const handleSave = () => {
    toast({
      title: "Uh oh! Something went wrong.",
      description: "There was a problem with your request.",
    });
    // setIsModalOpen(true);
  };

  const handleConfirmSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      // Simulate API call
      const success = Math.random() > 0.999001; // Randomly simulate success or failure
      if (success) {
        console.log("Loan created:", {
          selectedCustomer,
          startDate,
          numberOfWeeks,
          frequency,
          loanAmount,
          interestRate,
          totalToPayBack,
          payments,
        });
        setIsLoading(false);
        setIsModalOpen(false);
        router.push("/");
      } else {
        setIsLoading(false);
        console.log("toasting");
        setIsModalOpen(false);
        toast({
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });
      }
    }, 2000); // Simulate API call
  };

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            Amount
          </label>
          <input
            type="number"
            name="amount"
            value={loanAmount}
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
            onBlur={handleInterestRateBlur}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Total to Pay Back
          </label>
          <input
            type="number"
            name="totalToPayBack"
            value={totalToPayBack}
            onChange={(e) => setTotalToPayBack(parseFloat(e.target.value))}
            onBlur={handleTotalToPayBackBlur}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Frequency
          </label>
          <select
            name="frequency"
            value={frequencyOptions.indexOf(frequency)}
            onChange={(e) =>
              setFrequency(frequencyOptions[parseInt(e.target.value)])
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            {frequencyOptions.map((type, index) => (
              <option key={index} value={index}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Button onClick={handleGenerate} className="mb-4">
        Generate Payment Schedule
      </Button>
      {payments.length > 0 && (
        <Button onClick={handleClear} className="mb-4 ml-4 bg-red-500">
          Clear
        </Button>
      )}
      {payments.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl mb-4">Payment Schedule</h2>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2">Date</th>
                <th className="py-2">Amount Due</th>
                <th className="py-2">Remaining Amount</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{payment.date}</td>
                  <td className="border px-4 py-2">
                    {formatCurrency(payment.amount)}
                  </td>
                  <td className="border px-4 py-2">
                    {formatCurrency(payment.remainingAmount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4">
            <strong>Total: </strong>
            {formatCurrency(
              payments.reduce((total, payment) => total + payment.amount, 0)
            )}
          </div>
          <div className="mt-4">
            <strong>Profit: </strong>
            {formatCurrency(
              payments.reduce((total, payment) => total + payment.amount, 0) -
                loanAmount
            )}
          </div>
        </div>
      )}
      <br />
      <Button onClick={handleSave} disabled={payments.length == 0}>
        Save
      </Button>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Loan Details</DialogTitle>
          </DialogHeader>
          <div className="mb-4">
            <strong>Customer: </strong>
            {customers.find((c) => c.id === selectedCustomer)?.name}
          </div>
          <div className="mb-4">
            <strong>Total Amount: </strong>
            {formatCurrency(loanAmount)}
          </div>
          <div className="mb-4">
            <strong>Number of Weeks: </strong>
            {numberOfWeeks}
          </div>
          <div className="mb-4">
            <strong>Total to be Paid Back: </strong>
            {formatCurrency(totalToPayBack)}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmSave} disabled={isLoading}>
              {isLoading ? <Spinner /> : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoanCreate;
