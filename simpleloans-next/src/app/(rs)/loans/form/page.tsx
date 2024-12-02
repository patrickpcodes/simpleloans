import { BackButton } from "@/components/BackButton";
import { getCustomers } from "@/lib/queries/getCustomers";
import { getLoan } from "@/lib/queries/getLoan";
import * as Sentry from "@sentry/nextjs";
import LoanForm from "./LoanForm";
import { PaymentTableView } from "@/components/PaymentTableView";
import { PaymentCard } from "@/components/PaymentCard";

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
      console.log(loanId);
      console.log(result.loan);
      return (
        <div>
          <LoanForm
            loan={result.loan}
            customers={customers}
            payments={result.payments}
          />
          {result.payments && (
            <div>
              <h2>Generated Payments</h2>
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
          <PaymentTableView payments={result.payments} />
        </div>
      );
      // put customer form component
      return <div>{/* <CustomerForm customer={customer} /> */}</div>;
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
    if (e instanceof Error) {
      Sentry.captureException(e);
      throw e;
    }
  }
}
