import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CustomerDetail } from "@/types/CustomerDetail";
import {
  hasActiveLoan,
  getNextPaymentDateForPendingPayments,
  getNextPaymentAmount,
} from "@/utils/loanChecks";
import { Mail, Phone, CalendarIcon } from "lucide-react";
import {
  formatDateStringToMonthDayYear,
  formatDateToMonthDayYear,
} from "@/utils/formatDateToDateOnly";
import { formatStringToDollar } from "@/utils/formatStringToDollar";
export function DetailedCustomerDisplay({
  customerDetail,
  onRowClick,
}: {
  customerDetail: CustomerDetail;
  onRowClick: (id: number) => void;
}) {
  return (
    <div
      className="cursor-pointer" // Add a pointer cursor to indicate clickability
      onClick={() => onRowClick(customerDetail.customer.id)} // Call the onRowClick function
    >
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarFallback>
                {customerDetail.customer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{customerDetail.customer.name}</CardTitle>
              <CardDescription>
                Customer ID: {customerDetail.customer.id}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{customerDetail.customer.email}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{customerDetail.customer.phone}</span>
          </div>
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Loan Information</h3>
            {hasActiveLoan(customerDetail.loansWithPayments) ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Next Payment:
                    {formatDateStringToMonthDayYear(
                      getNextPaymentDateForPendingPayments(
                        customerDetail.loansWithPayments[0].payments
                      )
                    )}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold">
                    Amount Due:
                    {formatStringToDollar(
                      getNextPaymentAmount(customerDetail.loansWithPayments)
                    )}
                  </span>
                </div>
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">
                No active loans
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
