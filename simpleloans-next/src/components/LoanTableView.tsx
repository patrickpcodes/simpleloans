"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { selectLoanSchemaType } from "@/zod-schemas/loan";
import { useRouter } from "next/navigation";

type Loan = selectLoanSchemaType;

type Props = {
  loans: Loan[];
};

export function LoanTableView({ loans }: Props) {
  const router = useRouter();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Id</TableHead>
          <TableHead>Number of Payments</TableHead>
          <TableHead>Payment Frequency</TableHead>
          <TableHead>Initial Borrowed Amount</TableHead>
          <TableHead>Initial Due Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loans.map((loan) => (
          <TableRow
            key={loan.id}
            onClick={() => router.push(`/loans/form?loanId=${loan.id}`)}
            className="cursor-pointer"
          >
            <TableCell>{loan.id}</TableCell>
            <TableCell>{loan.numberOfPayments}</TableCell>
            <TableCell>{loan.paymentFrequency}</TableCell>
            <TableCell>
              {parseFloat(loan.initialBorrowedAmount).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </TableCell>
            <TableCell>
              {parseFloat(loan.initialDueAmount).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
