"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { selectPaymentSchemaType } from "@/zod-schemas/payment";
import {
  formatStringToDollar,
  formatNumberToDollar,
} from "@/utils/formatStringToDollar";
import { formatDateToMonthDayYear } from "@/utils/formatDateToDateOnly";
import { useRouter } from "next/navigation";

type Payment = selectPaymentSchemaType;

interface Props {
  payment: Payment;
  paymentNumber: number;
}

export function PaymentCard({ payment, paymentNumber }: Props) {
  const router = useRouter();
  console.log(payment);
  const totalDue =
    parseFloat(payment.amountDue) + parseFloat(payment.feeAmount);
  const progressPercentage = payment.amountPaid
    ? (parseFloat(payment.amountPaid) / totalDue) * 100
    : 0;

  return (
    <Card
      className="w-full max-w-md"
      onClick={() => {
        router.push(`/payments/form?paymentId=${payment.id}`);
      }}
    >
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Payment #{paymentNumber}</span>
          <Badge
            variant={
              payment.paymentStatus === "Paid"
                ? "default"
                : payment.paymentStatus === "Pending"
                ? "secondary"
                : "destructive"
            }
          >
            {payment.paymentStatus}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Due Date:</span>
            <span>{formatDateToMonthDayYear(payment.dueDate)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Due Amount:</span>
            <span>{formatStringToDollar(payment.amountDue)}</span>
          </div>
          {payment.feeAmount && parseFloat(payment.feeAmount) > 0 && (
            <div className="flex justify-between text-destructive">
              <span className="text-sm">Late Fee:</span>
              <span>{formatStringToDollar(payment.feeAmount)}</span>
            </div>
          )}
          {payment.amountPaid && parseFloat(payment.amountPaid) > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-green-600">
                <span className="text-sm">Amount Paid:</span>
                <span>{formatStringToDollar(payment.amountPaid)}</span>
              </div>
              <Progress value={progressPercentage} className="w-full" />
              <div className="text-xs text-center text-muted-foreground">
                {progressPercentage.toFixed(0)}% paid
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full text-right font-semibold">
          Total Due: {formatNumberToDollar(totalDue)}
        </div>
      </CardFooter>
    </Card>
  );
}
