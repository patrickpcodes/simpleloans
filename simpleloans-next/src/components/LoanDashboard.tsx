import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  BadgeDollarSign,
  AlertCircle,
  Calendar,
  PiggyBank,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDateStringToMonthDayYear } from "@/utils/formatDateToDateOnly";

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
  warningMessage?: string;
  errorMessage?: string;
  healthItems: {
    name: string;
    status: "red" | "yellow" | "green";
  }[];
}

export function LoanDashboard({
  status,
  initialAmount,
  totalFees,
  currentAmount,
  paymentsLeft,
  nextPaymentDate,
  nextPaymentAmount,
  expectedProfit,
  completionDate,
  warningMessage,
  errorMessage,
  healthItems,
}: LoanDashboardProps) {
  const getStatusColor = (status: "red" | "yellow" | "green") => {
    switch (status) {
      case "red":
        return "bg-red-100 text-red-800 border-red-300";
      case "yellow":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "green":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status: "red" | "yellow" | "green") => {
    switch (status) {
      case "red":
        return <XCircle className="h-6 w-6 text-red-500" />;
      case "yellow":
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      case "green":
        return <CheckCircle2 className="h-6 w-6 text-green-500" />;
      default:
        return null;
    }
  };
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
                <span className="text-lg font-semibold">
                  {formatDateStringToMonthDayYear(nextPaymentDate)}
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
              <Card
                key={index}
                className={`border ${getStatusColor(item.status)}`}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    {getStatusIcon(item.status)}
                    <Badge variant="outline" className="capitalize">
                      {item.status}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-sm">{item.name}</h3>
                </CardContent>
              </Card>
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
