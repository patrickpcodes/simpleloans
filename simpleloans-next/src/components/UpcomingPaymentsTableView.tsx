"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
import { UpcomingPayment } from "@/types/UpcomingPayment";
import {
  formatNumberToDollar,
  formatStringToDollar,
} from "@/utils/formatStringToDollar";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Payment } from "@/zod-schemas/payment";
import { PaymentModal } from "./PaymentModal";

// const statusColors = {
//   pending: "bg-yellow-100 text-yellow-800",
//   overdue: "bg-red-100 text-red-800",
//   paid: "bg-green-100 text-green-800",
// };

type Props = {
  upcomingPayments: UpcomingPayment[];
};

export default function UpcomingPaymentsTableView({ upcomingPayments }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePayment, setActivePayment] = useState<Payment | null>(null);
  console.log("format", formatNumberToDollar(1000));
  const router = useRouter();
  return (
    <div>
      {isModalOpen && activePayment && (
        <PaymentModal
          payment={activePayment}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setActivePayment(null);
          }}
        />
      )}
      <div className="container mx-auto py-10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer Name</TableHead>
              <TableHead>Due Amount</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {upcomingPayments.map((upcomingPayment) => (
              <TableRow
                key={upcomingPayment.payment.id}
                className="hover:bg-gray-50"
                //   onClick={() =>
                //     router.push("/loans/form?loanId=" + upcomingPayment.loanId)
                //   }
              >
                <TableCell
                  className="font-medium"
                  onClick={() =>
                    router.push(
                      "/customers/form?customerId=" + upcomingPayment.customerId
                    )
                  }
                >
                  {upcomingPayment.customerName}
                </TableCell>
                <TableCell>
                  {formatStringToDollar(upcomingPayment.payment.amountDue)}
                </TableCell>
                <TableCell>{upcomingPayment.payment.dueDate}</TableCell>
                <TableCell>
                  {upcomingPayment.payment.paymentMethod}
                  {/* <Badge className={statusColors[payment.status]}>
                  {payment.status}
                </Badge> */}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() =>
                        console.log(
                          "Accept payment",
                          upcomingPayment.payment.id
                        )
                      }
                    >
                      Paid
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        console.log(
                          "Confirm details",
                          upcomingPayment.payment.id
                        );
                        setActivePayment(upcomingPayment.payment);
                        setIsModalOpen(true);
                      }}
                    >
                      Manually Confirm
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        console.log("Send email", upcomingPayment.payment.id)
                      }
                    >
                      Send Email
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
