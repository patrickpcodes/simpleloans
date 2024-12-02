import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { CustomerDetail } from "@/types/CustomerDetail";
import {
  hasActiveLoan,
  getNextPaymentDate,
  getNextPaymentAmount,
} from "@/utils/loanChecks";
import { formatDateToMonthDayYear } from "@/utils/formatDateToDateOnly";
import { formatStringToDollar } from "@/utils/formatStringToDollar";

export function SimpleCustomerDisplay({
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
          <CardTitle>Customer #{customerDetail.customer.id}</CardTitle>
          <CardDescription>{customerDetail.customer.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <div>Email:</div>
            <div>{customerDetail.customer.email}</div>
            <div>Phone:</div>
            <div>{customerDetail.customer.phone}</div>
            <div>Active Loan:</div>
            <div>
              {hasActiveLoan(customerDetail.loansWithPayments) ? "Yes" : "No"}
            </div>
            {hasActiveLoan(customerDetail.loansWithPayments) && (
              <>
                <div>Next Payment Date:</div>
                <div>
                  {formatDateToMonthDayYear(
                    getNextPaymentDate(customerDetail.loansWithPayments)
                  )}
                </div>
                <div>Next Payment Amount:</div>
                <div>
                  {formatStringToDollar(
                    getNextPaymentAmount(customerDetail.loansWithPayments)
                  )}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
