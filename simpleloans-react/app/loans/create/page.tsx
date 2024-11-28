"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Customer } from "@/types/Customer";
import { Payment } from "@/types/Payment";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import LoanManagementForm from "@/components/LoanManagementForm";
import {
  convertFormValuesToLoanDetails,
  LoanDetails,
  LoanDetailsFormValues,
} from "@/types/LoanDetails";

const LoanCreate: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>(null);
  const [interestRate, setInterestRate] = useState<number>(0);
  const [totalToPayBack, setTotalToPayBack] = useState<number>(0);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryCustomerId = searchParams.get("customerId");

  // const currentCustomer = customers.find((c) => c.id === customerId);

  const frequencyOptions = ["Weekly", "Bi-Weekly", "Monthly"];
  const { toast } = useToast();

  async function fetchAllCustomers(): Promise<Customer[]> {
    const response = await fetch("https://localhost:7238/api/customers");
    if (!response.ok) {
      throw new Error("Failed to fetch customers");
    }

    return await response.json();
  }

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const customerList = await fetchAllCustomers();
        setCustomers(customerList);

        // Set the default value for customerId if query parameter exists and matches a customer
        if (queryCustomerId) {
          const customer = customerList.find(
            (customer) => customer.id === queryCustomerId
          );
          if (customer) {
            setSelectedCustomer(customer);
          }
        }
      } catch (err: any) {
        setError(err.message || "Failed to load customers.");
      }
    };

    loadCustomers();
  }, [queryCustomerId]); // Re-run if queryCustomerId changes

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
  async function generatePaymentSchedule(
    loanDetails: LoanDetailsFormValues
  ): Promise<Payment[]> {
    console.log("In Generate Payments");
    const loanDets = convertFormValuesToLoanDetails(loanDetails);
    console.log(loanDets);
    // const formattedDetails = {
    //   loanDetails: {
    //     ...loanDets,
    //     customerId: loanDets.customerId,
    //     startDate: new Date(loanDets.startDate).toISOString().split("T")[0], // Format as YYYY-MM-DD
    //   },
    // // };
    // console.log(formattedDetails);
    const response = await fetch("https://localhost:7238/api/loans/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loanDets),
    });
    console.log("after call in Generate Payments");

    if (!response.ok) {
      throw new Error("Failed to generate payment schedule");
    }

    return await response.json();
  }

  async function handleGeneratePayments(values: LoanDetailsFormValues) {
    try {
      console.log("In handleGeneratePayments", values);
      const generatedPayments = await generatePaymentSchedule(values);
      setPayments(generatedPayments);
    } catch (err: any) {
      // setErro err.message || "An error occurred while generating payments.");
    }
  }

  const handleFormSubmit = (values: LoanDetailsFormValues) => {
    console.log("Form Submitted, back in page", values);
  };

  const handleSave = () => {
    setIsModalOpen(true);
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
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "There was a problem with your request.  Please contact support.",
        });
      }
    }, 2000); // Simulate API call
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Create Loan Page</h1>

      {/* {payments.length > 0 && (
        <Button onClick={handleClear} className="mb-4 ml-4 bg-red-500">
          Clear
        </Button>
      )}
      <br />
      <Button onClick={handleSave} disabled={payments.length == 0}>
        Save
      </Button> */}
      {/* <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
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
      </Dialog> */}

      <LoanManagementForm
        customerOptions={customers}
        startingCustomer={selectedCustomer}
        frequencyOptions={frequencyOptions}
        onFormSubmit={handleFormSubmit}
        onGeneratePayments={handleGeneratePayments}
      />
      {payments && (
        <div>
          <h2>Generated Payments</h2>
          <ul>
            {payments.map((payment) => (
              <li key={payment.id}>
                <strong>Due Date:</strong> {payment.dueDate},{" "}
                <strong>Amount:</strong> ${payment.amountDue.toFixed(2)},{" "}
                <strong>Status:</strong> {payment.status}
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* <Button onClick={handleGeneratePayments} className="mb-4">
        Generate Payment Schedule
      </Button> */}
    </div>
  );
};

export default LoanCreate;
