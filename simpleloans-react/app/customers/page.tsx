"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import customersData from "../../data/customers.json";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Customer {
  id: number;
  name: string;
  phone: string;
  birthday: string;
  email: string;
  notes: string;
}

const CustomerTable: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const router = useRouter();

  useEffect(() => {
    setCustomers(customersData);
  }, []);

  const handleRowClick = (id: number) => {
    router.push(`/customers/${id}`);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Customer Management</h1>
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
            <TableRow key={customer.id} onClick={() => handleRowClick(customer.id)} className="cursor-pointer">
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.phone}</TableCell>
              <TableCell>{customer.birthday}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.notes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomerTable;
