import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  BadgeDollarSign,
  AlertCircle,
  Calendar,
  PiggyBank,
} from "lucide-react";

interface LoanDashboardProps {
  status: string;
  initialAmount: number;
  totalFees: number;
  currentAmount: number;
  paymentsLeft: number;
  nextPaymentDate: string;
  nextPaymentAmount: number;
  expectedProfit: number;
  completionDate: string;
  errorMessage?: string;
}

export function SpaciousLoanDashboard({
  status,
  initialAmount,
  totalFees,
  currentAmount,
  paymentsLeft,
  nextPaymentDate,
  nextPaymentAmount,
  expectedProfit,
  completionDate,
  errorMessage,
}: LoanDashboardProps) {
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
                ${currentAmount.toFixed(2)}
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
                <span className="text-lg font-semibold">{nextPaymentDate}</span>
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
                <span className="text-lg font-semibold">{completionDate}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
