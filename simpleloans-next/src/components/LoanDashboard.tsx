import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  BadgeDollarSign,
  AlertCircle,
  Calendar,
  PiggyBank,
  AlertTriangle,
} from "lucide-react";
import { formatDateStringToMonthDayYear } from "@/utils/formatDateToDateOnly";
import { Payment } from "@/zod-schemas/payment";
import { Loan } from "@/zod-schemas/loan";
import { HealthItem, LoanDashboardHealthItem } from "./LoanDashboardHealthItem";
import {
  getLastPayment,
  getNextPendingPayment,
  getTotalFees,
  getTotalPaid,
  getTotalToBePaid,
} from "@/utils/payments";

interface LoanDashboardProps {
  loan: Loan;
  payments: Payment[];
}

export function LoanDashboard({ loan, payments }: LoanDashboardProps) {
  const status = loan.loanStatus;
  const initialAmount = parseFloat(loan.initialBorrowedAmount);
  const totalFees = getTotalFees(payments);
  const remainingAmount = getTotalToBePaid(payments) - getTotalPaid(payments);
  const paymentsLeft = payments.filter(
    (payment) => payment.paymentStatus === "Pending"
  ).length;
  const nextPayment = getNextPendingPayment(payments);
  const nextPaymentDate = nextPayment?.dueDate;
  const nextPaymentAmount = nextPayment ? parseFloat(nextPayment.amountDue) : 0;
  const expectedProfit = getTotalToBePaid(payments) - initialAmount;
  // Get payment with the latest due date
  const lastPayment = getLastPayment(payments);
  const completionDate = lastPayment?.dueDate || "";
  const warningMessage =
    "This loan has a high interest rate. Consider refinancing options.";
  const errorMessage = "This loan is invalid, this is my error";

  const healthItems: HealthItem[] = [
    { title: "Payment History", message: "Test 1", status: "green" },
    { title: "Loan-to-Value", message: "Test 1", status: "yellow" },
    { title: "Credit Score", message: "Test 1", status: "red" },
  ];
  healthItems.push({
    title: "Payment History",
    message: "Test 1",
    status: "green",
  });
  return (
    <div className="w-full max-w-2xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Loan Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-muted-foreground">
                Status
              </span>
              <span className="text-lg font-semibold">{status}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-muted-foreground">
                Initial Amount
              </span>
              <span className="text-lg font-semibold">
                ${initialAmount.toFixed(2)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-muted-foreground">
                Total Fees
              </span>
              <span className="text-lg font-semibold">
                ${totalFees.toFixed(2)}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-muted-foreground">
                Current Amount Due
              </span>
              <span className="text-lg font-semibold">
                ${remainingAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center">
              <BadgeDollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">Payments Left</span>
                <span className="text-lg font-semibold">{paymentsLeft}</span>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">Next Payment</span>
                <span className="text-lg font-semibold">
                  {nextPaymentDate
                    ? formatDateStringToMonthDayYear(nextPaymentDate)
                    : ""}
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <BadgeDollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">Next Payment Amount</span>
                <span className="text-lg font-semibold">
                  ${nextPaymentAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Loan Projections
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center">
              <PiggyBank className="mr-2 h-4 w-4 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">Expected Profit</span>
                <span className="text-lg font-semibold">
                  ${expectedProfit.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  Loan Completion Date
                </span>
                <span className="text-lg font-semibold">
                  {" "}
                  {formatDateStringToMonthDayYear(completionDate)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Loan Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {healthItems.map((item, index) => (
              <LoanDashboardHealthItem
                key={index}
                index={index.toString()}
                healthItem={item}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {warningMessage && (
        <Alert variant="default">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>{warningMessage}</AlertDescription>
        </Alert>
      )}

      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
