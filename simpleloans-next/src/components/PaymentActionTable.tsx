import { Button } from "@/components/ui/button";
import { UpcomingPayment } from "@/types/UpcomingPayment";
import { formatStringToDollar } from "@/utils/formatStringToDollar";
import { CheckCircle, Mail, MoreHorizontal } from "lucide-react";
import { formatNumberToDollar } from "@/utils/formatStringToDollar";
import { useState } from "react";
import { Payment } from "@/zod-schemas/payment";
import { PaymentModal } from "./PaymentModal";
import { PaymentPayTodayValues } from "@/app/(rs)/payments/form/PaymentForm";
import { formatDateToYYYYMMDD } from "@/utils/formatDateToDateOnly";

type Props = {
  upcomingPayments: UpcomingPayment[];
};

export function PaymentActionTable({ upcomingPayments }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePayment, setActivePayment] = useState<Payment | null>(null);
  const [paymentPayTodayValues, setPaymentPayTodayValues] = useState<
    PaymentPayTodayValues | undefined
  >(undefined);
  console.log("format", formatNumberToDollar(1000));
  return (
    <div>
      {isModalOpen && activePayment && (
        <PaymentModal
          payment={activePayment}
          paymentPayTodayValues={paymentPayTodayValues}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setActivePayment(null);
            setPaymentPayTodayValues(undefined);
          }}
        />
      )}
      <div className="flex">
        Button Legend :
        <Button size="sm" variant="outline">
          <CheckCircle className="h-4 w-4" />
          Paid In Full
        </Button>
        <Button size="sm" variant="outline">
          <MoreHorizontal className="h-4 w-4" />
          Manually Confirm
        </Button>
        <Button size="sm" variant="secondary">
          <Mail className="h-4 w-4" />
          Send Reminder
        </Button>
      </div>
      <div className="space-y-4 ">
        {upcomingPayments.map((upcomingPayment) => (
          <div
            key={upcomingPayment.payment.id}
            className=" items-center justify-between p-4 bg-muted rounded-lg grid grid-cols-12 gap-4"
          >
            <div className="col-span-3">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-lg">
                  {upcomingPayment.customerName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h3 className="font-semibold">
                    {upcomingPayment.customerName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {upcomingPayment.payment.paymentMethod}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-span-3 text-left">
              <p className="font-semibold">
                {formatStringToDollar(upcomingPayment.payment.amountDue)}
              </p>
              <p className="text-sm text-muted-foreground">
                Due: {upcomingPayment.payment.dueDate}
              </p>
            </div>
            {/* <div className="text-right">
            <p className="text-sm">
              Total Loan Amount:{" "}
              {formatStringToDollar(upcomingPayment.loan.initialDueAmount)}
            </p>
            <p className="text-sm text-muted-foreground">
              Finishes: {upcomingPayment.payment.updatedAt?.toDateString()}
            </p>
          </div> */}
            <div className="col-span-3 text-left">
              <p className="text-sm text-muted-foreground">Last Reminder:</p>
              <p className="text-sm">{"test"}</p>
            </div>
            <div className="col-span-3 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  console.log("Accept payment", upcomingPayment.payment.id);
                  setActivePayment(upcomingPayment.payment);
                  setPaymentPayTodayValues({
                    amountPaid: upcomingPayment.payment.amountDue,
                    paymentDate: formatDateToYYYYMMDD(new Date()),
                  });
                  setIsModalOpen(true);
                }}
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  console.log("Confirm details", upcomingPayment.payment.id);
                  setActivePayment(upcomingPayment.payment);
                  setIsModalOpen(true);
                }}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() =>
                  console.log("Send email", upcomingPayment.payment.id)
                }
              >
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
