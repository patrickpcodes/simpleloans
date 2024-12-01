import { BackButton } from "@/components/BackButton";
import { getCustomers } from "@/lib/queries/getCustomers";
import { getLoan } from "@/lib/queries/getLoan";
import * as Sentry from "@sentry/nextjs";
import LoanForm from "./LoanForm";
import { PaymentTableView } from "@/components/PaymentTableView";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { loanId } = await searchParams;

  if (!loanId) return { title: "New Loan" };

  return { title: `Edit Loan #${loanId}` };
}
export default async function CustomerFormPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  try {
    const customers = await getCustomers();
    const { loanId } = await searchParams;

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
          <LoanForm loan={result.loan} customers={customers} />
          <PaymentTableView payments={result.payments} />
          {JSON.stringify(result.loan)} {JSON.stringify(result.payments)}
        </div>
      );
      // put customer form component
      return <div>{/* <CustomerForm customer={customer} /> */}</div>;
    } else {
      // new customer form component
      //   return <CustomerForm />;
    }
  } catch (e) {
    if (e instanceof Error) {
      Sentry.captureException(e);
      throw e;
    }
  }
}
