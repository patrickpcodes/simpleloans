import { BackButton } from "@/components/BackButton";
import * as Sentry from "@sentry/nextjs";
import CustomerForm from "@/app/(rs)/customers/form/CustomerForm";
import { getCustomerData } from "@/lib/queries/getCustomerData";
import { CustomerDetail } from "@/types/CustomerDetail";
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
      const customerDetailResponse: CustomerDetail[] = await getCustomerData(
        parseInt(customerId)
      );
      // const histories = await getHistoriesByItem(
      //   "Customer",
      //   parseInt(customerId)
      // );
      // console.log(histories);
      if (!customerDetailResponse || customerDetailResponse.length != 1) {
        return (
          <>
            <h2 className="text-2xl mb-2">
              Customer ID #{customerId} not found
            </h2>
            <BackButton title="Go Back" variant="default" />
          </>
        );
      }
      const customerDetail = customerDetailResponse[0];
      console.log(customerDetail);
      // const loanDetails: LoanDetail[] = customerDetails.loansWithPayments.map(
      //   (loanWithPayments) => {
      //     return {
      //       loan: loanWithPayments.loan,
      //       payments: loanWithPayments.payments,
      //       customer: customerDetails.customer,
      //     };
      //   }
      // );
      // console.log("loanDetails", loanDetails);
      // put customer form component
      return (
        <div>
          <CustomerForm customerDetail={customerDetail} />
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
