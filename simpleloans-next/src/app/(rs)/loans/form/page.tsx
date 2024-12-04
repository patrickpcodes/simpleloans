import { BackButton } from "@/components/BackButton";
import { getCustomers } from "@/lib/queries/getCustomers";
import { getLoan } from "@/lib/queries/getLoan";
import LoanForm from "./LoanForm";
import { PaymentCard } from "@/components/PaymentCard";
import { LoanDashboard } from "@/components/LoanDashboard";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { loanId } = await searchParams;

  if (!loanId) return { title: "New Loan" };

  return { title: `Edit Loan #${loanId}` };
}
export default async function LoanFormPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  try {
    const customers = await getCustomers();
    const { loanId, customerId } = await searchParams;

    // Edit customer form
    if (loanId) {
      const result = await getLoan(parseInt(loanId));
      if (!loanId) {
        return (
          <>
            <h2 className="text-2xl mb-2">Loan ID #{loanId} not found</h2>
            <BackButton title="Go Back" variant="default" />
          </>
        );
      }
      if (!result) {
        return (
          <>
            <h2 className="text-2xl mb-2">Loan ID #{loanId} not found</h2>
            <BackButton title="Go Back" variant="default" />
          </>
        );
      }
      const healthItems = [
        { name: "Payment History", status: "green" },
        { name: "Loan-to-Value", status: "yellow" },
        { name: "Credit Score", status: "red" },
      ];
      console.log(loanId);
      console.log(result.loan);
      return (
        <div>
          <div className="flex flex-col gap-1 sm:px-8">
            <div>
              <h2 className="text-2xl font-bold text-center">
                {result.loan?.id ? "Edit" : "New"} loan{" "}
                {result.loan?.id ? `#${result.loan.id}` : "Form"}
              </h2>
            </div>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6">
                <LoanForm
                  loan={result.loan}
                  customers={customers}
                  payments={result.payments}
                />
              </div>
              <div className="col-span-6">
                <LoanDashboard
                  status="status"
                  initialAmount={123}
                  totalFees={456}
                  currentAmount={789}
                  paymentsLeft={10}
                  nextPaymentDate={"2022-04-05"}
                  nextPaymentAmount={123}
                  expectedProfit={123}
                  completionDate={"2022-04-05"}
                  warningMessage="This loan has a high interest rate. Consider refinancing options."
                  errorMessage="This loan is invalid, this is my error"
                  healthItems={healthItems}
                />
              </div>
            </div>
          </div>
          {result.payments && (
            <div>
              <h2 className="text-2xl font-bold text-center">Payments</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {result.payments.map((payment, index) => (
                  <PaymentCard
                    payment={payment}
                    paymentNumber={index + 1}
                    key={index}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      );
    } else {
      if (customerId) {
        console.log(customerId);
        return (
          <LoanForm customers={customers} customerId={parseInt(customerId)} />
        );
      }
      // new customer form component
      return <LoanForm customers={customers} />;
    }
  } catch (e) {
    console.log(e);
  }
}
