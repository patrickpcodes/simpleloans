import { LoanDetail } from "@/types/LoanDetail";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { formatStringToDollar } from "@/utils/formatStringToDollar";
import { formatDateToMonthDayYear } from "@/utils/formatDateToDateOnly";
import {
  CalendarIcon,
  CreditCard,
  DollarSign,
  Hash,
  Repeat,
  User,
} from "lucide-react";
import { Badge } from "../ui/badge";

export function DetailedLoanDisplay({
  loanDetail,
  onRowClick,
}: {
  loanDetail: LoanDetail;
  onRowClick: (id: number) => void;
}) {
  return (
    <div
      className="cursor-pointer" // Add a pointer cursor to indicate clickability
      onClick={() => onRowClick(loanDetail.loan.id)} // Call the onRowClick function
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Loan Details</span>
            <Badge variant="outline">#{loanDetail.loan.id}</Badge>
          </CardTitle>
          <CardDescription>
            Comprehensive view of the loan information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Customer Name:
            </span>
            <span className="font-medium">{loanDetail.customer.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Number of Payments:
            </span>
            <span className="font-medium">
              {loanDetail.loan.numberOfPayments}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Repeat className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Payment Frequency:
            </span>
            <span className="font-medium">
              {loanDetail.loan.paymentFrequency}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Initial Amount:
            </span>
            <span className="font-medium">
              {formatStringToDollar(loanDetail.loan.initialBorrowedAmount)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Due Amount:</span>
            <span className="font-medium">
              {formatStringToDollar(loanDetail.loan.initialDueAmount)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              First Payment Date:
            </span>
            <span className="font-medium">
              {formatDateToMonthDayYear(loanDetail.loan.firstPaymentDate)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
