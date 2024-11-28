"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Customer, CustomerWithHistory } from "@/types/Customer";
import LoanManagementForm from "@/components/LoanManagementForm";
import { format } from "date-fns";
import { History, HistoryChange } from "@/types/History";
import { HistoryTimelineView } from "@/components/HistoryTimelineView";

import { useToast } from "@/hooks/use-toast";

const CustomerDetail: React.FC = () => {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [history, setHistory] = useState<History[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = useParams();

  const { toast } = useToast();

  function updateCustomerBirthday(customer: Customer) {
    if (customer.birthday) {
      customer.birthday = format(new Date(customer.birthday), "yyyy-MM-dd");
    }
  }
  async function fetchCustomerById(id: string): Promise<CustomerWithHistory> {
    const response = await fetch(`https://localhost:7238/api/customers/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch customer with ID ${id}`);
    }
    const customerWithHistory: CustomerWithHistory = await response.json();

    updateCustomerBirthday(customerWithHistory.customer);
    // Convert the birthday to "YYYY-MM-DD"
    // if (customerWithHistory.customer.birthday) {
    //   customerWithHistory.customer.birthday = format(
    //     new Date(customerWithHistory.customer.birthday),
    //     "yyyy-MM-dd"
    //   );
    // }

    return customerWithHistory;
  }

  useEffect(() => {
    if (id) {
      const fetchCustomer = async () => {
        try {
          setLoading(true);
          const data: CustomerWithHistory = await fetchCustomerById(
            id as string
          );
          updateCustomerBirthday(data.customer);
          setCustomer(data.customer);
          setHistory(data.history);
        } catch (err: any) {
          setError(
            err.message || "An error occurred while fetching the customer."
          );
        } finally {
          setLoading(false);
        }
      };

      fetchCustomer();
    }
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!customer) return <p>No customer found.</p>;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (customer) {
      setCustomer({ ...customer, [e.target.name]: e.target.value });
    }
  };

  async function updateCustomer(
    updatedCustomer: Customer
  ): Promise<{ status: number; customer?: Customer; history?: History[] }> {
    const response = await fetch(
      `https://localhost:7238/api/customers/${updatedCustomer.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCustomer),
      }
    );

    if (response.status === 304) {
      return { status: 304 }; // No changes
    }

    if (!response.ok) {
      throw new Error("Failed to update customer");
    }

    const { customer, history } = await response.json();
    return { status: 200, customer, history };
  }

  async function handleSave() {
    try {
      const result = await updateCustomer(customer as Customer);
      if (result.status === 304) {
        toast({
          title: "Uh oh! Something weird happened",
          description: "No changes were made to the customer.",
        });
        return;
      }
      updateCustomerBirthday(result.customer!);
      setCustomer(result.customer!);
      setHistory(result.history!);
      toast({
        title: `Customer ${result.customer?.name} updated successfully!`,
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! An error occurred",
        description:
          err.message || "An error occurred while updating the customer.",
      });
    }
    // Save logic here
    // await updateCustomer(id as string, customer as Customer);
    // console.log("Customer saved:", customer);
    // router.push("/customers");
  }

  const handleCreateLoan = () => {
    router.push(`/loans/create?customerId=${id}`);
  };

  if (!customer) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Manage Customer</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          value={customer.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Phone</label>
        <input
          type="text"
          name="phoneNumber"
          value={customer.phoneNumber}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Birthday
        </label>
        <input
          type="date"
          name="birthday"
          value={customer.birthday}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={customer.email}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          name="notes"
          value={customer.notes}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <Button onClick={handleSave} className="mr-4">
        Save
      </Button>
      <Button onClick={handleCreateLoan}>Create New Loan</Button>
      {/* <h2 className="mt-8">History</h2> */}
      {/* {history.length > 0 ? (
        <ul>
          {history
            .sort(
              (a, b) =>
                new Date(b.timestamp).getTime() -
                new Date(a.timestamp).getTime()
            )
            .map((entry) => (
              <li key={entry.id} className="mb-4">
                <p>
                  <strong>Timestamp:</strong>{" "}
                  {new Date(entry.timestamp).toLocaleString()}
                </p>
                <p>
                  <strong>User:</strong> {entry.userId}
                </p>
                <p>
                  <strong>Changes:</strong>
                </p>
                <ul>
                  {entry.changes.map((change, index) => (
                    <li key={index}>
                      {change.field}: &quot;{change.oldValue}&quot; → &quot;
                      {change.newValue}&quot;
                    </li>
                  ))}
                </ul>
              </li>
            ))}
        </ul>
      ) : (
        <p>No history found for this customer.</p>
      )} */}
      {history.length > 0 ? (
        <HistoryTimelineView history={history} />
      ) : (
        <p>No history found for this customer.</p>
      )}
    </div>
  );
};

export default CustomerDetail;
