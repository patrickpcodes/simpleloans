import { getCustomer } from "@/lib/queries/getCustomer";
import { BackButton } from "@/components/BackButton";
import * as Sentry from "@sentry/nextjs";
import CustomerForm from "@/app/(rs)/customers/form/CustomerForm";
import { getLoansByCustomerId } from "@/lib/queries/getLoansByCustomerId";
import { LoanTableView } from "@/components/LoanTableView";
import { getHistoriesByItem } from "@/lib/queries/getHistoriesByItem";
// import { HistoryTimelineView } from "@/components/HistoryTimelineView";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { customerId } = await searchParams;

  if (!customerId) return { title: "New Customer" };

  return { title: `Edit Customer #${customerId}` };
}
export default async function CustomerFormPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  try {
    const { customerId } = await searchParams;

    // Edit customer form
    if (customerId) {
      const customer = await getCustomer(parseInt(customerId));
      const loans = await getLoansByCustomerId(parseInt(customerId));
      const histories = await getHistoriesByItem(
        "Customer",
        parseInt(customerId)
      );
      console.log(histories);
      if (!customer) {
        return (
          <>
            <h2 className="text-2xl mb-2">
              Customer ID #{customerId} not found
            </h2>
            <BackButton title="Go Back" variant="default" />
          </>
        );
      }
      console.log(customer);
      console.log(loans);
      // put customer form component
      return (
        <div>
          <CustomerForm customer={customer} />
          {loans.length > 0 && <LoanTableView loans={loans} />}
          {/* {histories.length > 0 && (
            <HistoryTimelineView histories={histories} />
          )} */}
        </div>
      );
    } else {
      // new customer form component
      return <CustomerForm />;
    }
  } catch (e) {
    if (e instanceof Error) {
      Sentry.captureException(e);
      throw e;
    }
  }
}
