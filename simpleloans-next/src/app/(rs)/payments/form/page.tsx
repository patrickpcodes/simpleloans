import GlobalError from "@/app/global-error";
import { BackButton } from "@/components/BackButton";
import { getPayment } from "@/lib/queries/getPayment";
import router from "next/router";
import PaymentForm from "./PaymentForm";
import { Payment } from "@/zod-schemas/payment";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { paymentId } = await searchParams;

  if (!paymentId) return { title: "New Payment" };

  return { title: `Edit Payment #${paymentId}` };
}

export default async function PaymentFormPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  try {
    const { paymentId } = await searchParams;

    // Edit payment form
    if (paymentId) {
      const payment = await getPayment(parseInt(paymentId));
      if (!payment) {
        return (
          <>
            <h2 className="text-2xl mb-2">Payment ID #{paymentId} not found</h2>
            <BackButton title="Go Back" variant="default" />
          </>
        );
      }
      console.log(paymentId);
      console.log(payment);
      return (
        <div>
          <PaymentForm
            payment={payment}
            // onSubmit={function (payment: Payment): void {
            //   throw new Error("Function not implemented.");
            // }}
          />
        </div>
      );
    }
  } catch (error) {
    console.log(error);
    // return <GlobalError error={error} reset={() => router.reload()} />;
  }
}
