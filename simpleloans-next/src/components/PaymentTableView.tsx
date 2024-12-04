"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateStringToMonthDayYear } from "@/utils/formatDateToDateOnly";
import { selectPaymentSchemaType } from "@/zod-schemas/payment";
import { useRouter } from "next/navigation";

type Payment = selectPaymentSchemaType;

type Props = {
  payments: Payment[];
};

export function PaymentTableView({ payments }: Props) {
  const router = useRouter();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Id</TableHead>
          <TableHead>Loan Id</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Amount Due</TableHead>
          <TableHead>Payment Status</TableHead>
          <TableHead>Notes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => (
          <TableRow
            key={payment.id}
            onClick={() => {
              router.push(`/payments/form?paymentId=${payment.id}`);
            }}
            className="cursor-pointer"
          >
            <TableCell>{payment.id}</TableCell>
            <TableCell>{payment.loanId}</TableCell>
            <TableCell>
              {formatDateStringToMonthDayYear(payment.dueDate)}
            </TableCell>
            <TableCell>{payment.amountDue}</TableCell>
            <TableCell>{payment.paymentStatus}</TableCell>
            <TableCell>{payment.notes}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
