import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import { CustomerDetail } from "@/types/CustomerDetail";
import { hasActiveLoan } from "@/utils/loanChecks";
import { formatDateStringToMonthDayYear } from "@/utils/formatDateToDateOnly";
import { formatStringToDollar } from "@/utils/formatStringToDollar";
import { Badge } from "@/components/ui/badge";
import { getNextPendingPayment } from "@/utils/payments";

export function ModernCustomerDisplay({
  customerDetail,
  onRowClick,
}: {
  customerDetail: CustomerDetail;
  onRowClick: (id: number) => void;
}) {
  const nextPayment =
    customerDetail.loansWithPayments.length > 0
      ? getNextPendingPayment(customerDetail.loansWithPayments[0].payments)
      : undefined;
  return (
    <div
      className="cursor-pointer" // Add a pointer cursor to indicate clickability
      onClick={() => onRowClick(customerDetail.customer.id)} // Call the onRowClick function
    >
      <Card className="overflow-hidden">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="flex justify-between items-center">
            <span>{customerDetail.customer.name}</span>
            <Badge variant="secondary">ID: {customerDetail.customer.id}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-2 divide-x divide-y">
            <div className="p-4 bg-muted">
              <div className="text-sm text-muted-foreground">Email</div>
              <div className="font-medium truncate">
                {customerDetail.customer.email}
              </div>
            </div>
            <div className="p-4">
              <div className="text-sm text-muted-foreground">Phone</div>
              <div className="font-medium">{customerDetail.customer.phone}</div>
            </div>
            <div className="p-4 col-span-2">
              <div className="text-sm text-muted-foreground mb-1">
                Loan Status
              </div>
              {hasActiveLoan(customerDetail.loansWithPayments) ? (
                <div className="flex justify-between items-center">
                  <span className="font-medium text-green-600">
                    Active Loan
                  </span>
                  <Badge variant="outline" className="ml-2">
                    Next Payment:
                    {formatStringToDollar(nextPayment?.amountDue || "0")}
                  </Badge>
                </div>
              ) : (
                <span className="font-medium text-muted-foreground">
                  No Active Loan
                </span>
              )}
            </div>
          </div>
        </CardContent>
        {hasActiveLoan(customerDetail.loansWithPayments) && (
          <CardFooter className="bg-muted">
            <div className="w-full text-center">
              <div className="text-sm text-muted-foreground">
                Next Payment Date
              </div>
              <div className="text-lg font-semibold">
                {formatDateStringToMonthDayYear(nextPayment?.dueDate || "")}
              </div>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
