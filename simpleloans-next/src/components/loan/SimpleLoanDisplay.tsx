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

export function SimpleLoanDisplay({
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
          <CardTitle>Loan #{loanDetail.loan.id}</CardTitle>
          <CardDescription>
            Customer Name: {loanDetail.customer.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <div>Number of Payments:</div>
            <div>{loanDetail.loan.numberOfPayments}</div>
            <div>Payment Frequency:</div>
            <div>{loanDetail.loan.paymentFrequency}</div>
            <div>Initial Amount:</div>
            <div>
              {formatStringToDollar(loanDetail.loan.initialBorrowedAmount)}
            </div>
            <div>Due Amount:</div>
            <div>{formatStringToDollar(loanDetail.loan.initialDueAmount)}</div>
            <div>First Payment Date:</div>
            <div>
              {formatDateToMonthDayYear(loanDetail.loan.firstPaymentDate)}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
