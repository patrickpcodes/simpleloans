import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Payment } from "@/types/Payment";
import { PaymentStatus } from "@/types/PaymentStatus";

interface DetailedPaymentCardProps {
  payment: Payment;
  paymentNumber: number;
}

export function DetailedPaymentCard({
  payment,
  paymentNumber,
}: DetailedPaymentCardProps) {
  const totalDue = payment.amountDue + (payment.fee || 0);
  const progressPercentage = payment.amountPaid
    ? (payment.amountPaid / totalDue) * 100
    : 0;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Payment #{paymentNumber}</span>
          <Badge
            variant={
              payment.status === PaymentStatus.Paid
                ? "default"
                : payment.status === PaymentStatus.Pending
                ? "secondary"
                : "destructive"
            }
          >
            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Due Date:</span>
            <span>{payment.dueDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Due Amount:</span>
            <span>${payment.amountDue.toFixed(2)}</span>
          </div>
          {payment.fee !== undefined && payment.fee > 0 && (
            <div className="flex justify-between text-destructive">
              <span className="text-sm">Late Fee:</span>
              <span>${payment.fee.toFixed(2)}</span>
            </div>
          )}
          {payment.amountPaid !== undefined && payment.amountPaid > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-green-600">
                <span className="text-sm">Amount Paid:</span>
                <span>${payment.amountPaid.toFixed(2)}</span>
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
          Total Due: ${totalDue.toFixed(2)}
        </div>
      </CardFooter>
    </Card>
  );
}
