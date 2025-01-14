"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  BadgeDollarSign,
  // AlertCircle,
  Calendar,
  PiggyBank,
  // AlertTriangle,
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
  getTotalToBePaidForPendingPayments,
} from "@/utils/payments";
import { formatNumberToDollar } from "@/utils/formatStringToDollar";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

interface LoanDashboardProps {
  loan: Loan;
  payments: Payment[];
}
interface ExtendLoanButtonProps {
  loanId: number;
  shortfallAmount: number;
  onSuccess: () => void;
}

function ExtendLoanButton({
  loanId,
  shortfallAmount,
  onSuccess,
}: ExtendLoanButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleExtend = async () => {
    if (
      !confirm(
        `Add a new payment of $${shortfallAmount.toFixed(
          2
        )} to balance this loan?`
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/loans/extend-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          loanId,
          userId: "system", // TODO: Get actual user ID
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to extend loan");
      }

      toast({
        title: "Success",
        description: "Added balancing payment to loan",
      });
      onSuccess();
    } catch (error) {
      console.error("Error extending loan:", error);
      toast({
        title: "Error",
        description: "Failed to add balancing payment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleExtend}
      disabled={isLoading}
      variant="secondary"
      className="w-full mt-4"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Adding Payment...
        </>
      ) : (
        `Add Balancing Payment ($${shortfallAmount.toFixed(2)})`
      )}
    </Button>
  );
}

export function LoanDashboard({ loan, payments }: LoanDashboardProps) {
  console.log("loanPayments", JSON.stringify(payments));
  const status = loan.loanStatus;
  const initialAmount = parseFloat(loan.initialBorrowedAmount);
  const initialDueAmount = parseFloat(loan.initialDueAmount);
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
  // const warningMessage =
  //   "This loan has a high interest rate. Consider refinancing options.";
  // const errorMessage = "This loan is invalid, this is my error";
  const loanHealthItems: HealthItem[] = [];

  //Check if all paid + future payments >= initialAmount + Fees
  const totalPaid = getTotalPaid(payments);
  console.log("totalPaid", totalPaid);
  const totalToBePaidForPendingPayments =
    getTotalToBePaidForPendingPayments(payments);
  console.log(
    "totalToBePaidForPendingPayments",
    totalToBePaidForPendingPayments
  );
  const totalAmount = totalPaid + totalToBePaidForPendingPayments;
  const isValid = totalAmount >= initialDueAmount + totalFees;
  const shortfallAmount = Math.abs(
    totalAmount - (initialDueAmount + totalFees)
  );

  console.log("totalAmount", totalAmount);
  console.log("initialDueAmount", initialDueAmount);
  console.log("totalFees", totalFees);
  console.log("isValid", isValid);
  if (!isValid) {
    const difference = totalAmount - (initialDueAmount + totalFees);
    loanHealthItems.push({
      title: "Future Payments are not correct",
      message: `Total Paid + Future Payments add up to ${formatNumberToDollar(
        totalAmount
      )} but Initial Amount Due + Total Fees = ${formatNumberToDollar(
        initialDueAmount + totalFees
      )}.  You need to add ${formatNumberToDollar(
        Math.abs(difference)
      )} to Pending Payments to make this loan valid.`,
      status: "red",
    });
  }

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
          <div className="grid grid-cols-1 gap-4">
            {loanHealthItems.map((item, index) => (
              <LoanDashboardHealthItem
                key={index}
                index={index.toString()}
                healthItem={item}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* {warningMessage && (
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
      )} */}
      {!isValid && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-destructive">
              Loan Balance Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              This loan has a shortfall of ${shortfallAmount.toFixed(2)}. You
              can add a balancing payment to correct this.
            </p>
            <ExtendLoanButton
              loanId={loan.id ?? 0}
              shortfallAmount={shortfallAmount}
              onSuccess={() => window.location.reload()}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
