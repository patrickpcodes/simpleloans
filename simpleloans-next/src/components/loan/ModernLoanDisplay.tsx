import { LoanDetail } from "@/types/LoanDetail";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { formatStringToDollar } from "@/utils/formatStringToDollar";
import { formatDateToMonthDayYear } from "@/utils/formatDateToDateOnly";

export function ModernLoanDisplay({
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
      <Card className="overflow-hidden">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="text-2xl">Loan Summary</CardTitle>
          <CardDescription className="text-primary-foreground/70">
            Customer Name: {loanDetail.customer.name} | Loan ID:{" "}
            {loanDetail.loan.id}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-2 divide-x divide-y">
            <div className="p-4 bg-muted">
              <div className="text-sm text-muted-foreground">
                Number of Payments
              </div>
              <div className="text-2xl font-bold">
                {loanDetail.loan.numberOfPayments}
              </div>
            </div>
            <div className="p-4">
              <div className="text-sm text-muted-foreground">
                Payment Frequency
              </div>
              <div className="text-2xl font-bold">
                {loanDetail.loan.paymentFrequency}
              </div>
            </div>
            <div className="p-4">
              <div className="text-sm text-muted-foreground">
                Initial Amount
              </div>
              <div className="text-2xl font-bold">
                {formatStringToDollar(loanDetail.loan.initialBorrowedAmount)}
              </div>
            </div>
            <div className="p-4 bg-muted">
              <div className="text-sm text-muted-foreground">Due Amount</div>
              <div className="text-2xl font-bold">
                {formatStringToDollar(loanDetail.loan.initialDueAmount)}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-muted">
          <div className="w-full text-center">
            <div className="text-sm text-muted-foreground">
              First Payment Date
            </div>
            <div className="text-lg font-semibold">
              {formatDateToMonthDayYear(loanDetail.loan.firstPaymentDate)}
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
