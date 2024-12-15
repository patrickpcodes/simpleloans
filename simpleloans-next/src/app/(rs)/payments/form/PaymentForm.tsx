"use client";
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  insertPaymentSchema,
  insertPaymentSchemaType,
  Payment,
} from "@/zod-schemas/payment";
import { AlertTriangle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateInputWithLabel } from "@/components/inputs/DateInputWithLabel";
import { formatDateToYYYYMMDD } from "@/utils/formatDateToDateOnly";
import { SelectInputWithLabel } from "@/components/inputs/SelectInputWithLabel";
import { PAYMENT_STATUSES } from "@/types/PaymentStatus";
import { TextAreaWithLabel } from "@/components/inputs/TextAreaWithLabel";
import { PAYMENT_METHOD } from "@/types/PaymentMethod";
import { useRouter } from "next/navigation";
// import { Input } from "postcss";

export type PaymentPayTodayValues = {
  amountPaid: string;
  paymentDate: string;
};

type Props = {
  payment: Payment;
  paymentPayTodayValues?: PaymentPayTodayValues;
  // onSubmit?: (payment: insertPaymentSchemaType) => void;
};

export default function PaymentForm({ payment, paymentPayTodayValues }: Props) {
  const router = useRouter();
  const warningMessage = "This is a warning message";
  const defaultValues: insertPaymentSchemaType = {
    id: payment?.id ?? 0,
    loanId: payment?.loanId ?? 0,
    amountDue: payment?.amountDue ?? "0",
    amountPaid: paymentPayTodayValues
      ? paymentPayTodayValues.amountPaid
      : payment?.amountPaid ?? "0",
    feeAmount: payment?.feeAmount ?? "0",
    paymentStatus: paymentPayTodayValues ? "Paid" : payment.paymentStatus,
    paymentMethod: payment.paymentMethod,
    notes: payment?.notes ?? "",
    paymentDate: paymentPayTodayValues
      ? paymentPayTodayValues.paymentDate
      : payment?.paymentDate ?? formatDateToYYYYMMDD(new Date()),
    dueDate: payment.dueDate,
  };

  const form = useForm<insertPaymentSchemaType>({
    resolver: zodResolver(insertPaymentSchema),
    defaultValues,
  });
  const { watch, setValue } = form;

  // Track previous value of amountPaid
  const amountPaid = watch("amountPaid");

  // useEffect(() => {
  //   if (amountPaid !== previousAmountPaidRef.current) {
  //     console.log("amountPaid changed:", amountPaid);
  //     previousAmountPaidRef.current = amountPaid;
  //   }
  // }, [amountPaid]);

  function handleAmountPaidBlur() {
    console.log("amountPaid onBlur:", amountPaid);
    const amountPaidNum = parseFloat(amountPaid);
    const amountDueNum = parseFloat(form.getValues("amountDue"));
    if (amountPaidNum >= amountDueNum) {
      setValue("paymentStatus", "Paid");
      form.trigger();
    }
    console.log("formValues", form.getValues());
    // Add your custom logic here, e.g., validation or calculations
  }
  async function submitForm(data: insertPaymentSchemaType) {
    if (form.getValues("paymentStatus") == "Pending") {
      return;
    }
    let method = "";
    if (data.id && data.id > 0) {
      method = "PUT";
    } else {
      method = "POST";
    }
    try {
      const response = await fetch("/api/payments", {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to save payment");
      }

      const result = await response.json();
      console.log("This is my result from call");
      console.log(result);
      router.refresh();
      // if (method == "PUT") {
      //   router.push(`/loans/form?loanId=${data.id}`);
      // } else {
      //   router.push(`/loans/form?loanId=${result[0].id}`);
      // }
    } catch (err) {
      console.error(err);
      // setError(err.message);
    } finally {
      console.log("finally");
      // setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitForm)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <SelectInputWithLabel<insertPaymentSchemaType>
            fieldTitle="Payment Status"
            nameInSchema="paymentStatus"
            placeholder="Payment Status"
            selectProps={PAYMENT_STATUSES.map((freq, index) => ({
              key: `payment-status-${index}`,
              value: freq,
              displayString: freq,
            }))}
          />
          <SelectInputWithLabel<insertPaymentSchemaType>
            fieldTitle="Payment Method"
            nameInSchema="paymentMethod"
            placeholder="Payment Method"
            selectProps={PAYMENT_METHOD.map((freq, index) => ({
              key: `payment-status-${index}`,
              value: freq,
              displayString: freq,
            }))}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputWithLabel<insertPaymentSchemaType>
            fieldTitle="Amount to Pay"
            nameInSchema="amountDue"
          />
          <InputWithLabel<insertPaymentSchemaType>
            fieldTitle="Amount Paid"
            nameInSchema="amountPaid"
            onBlur={handleAmountPaidBlur}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <DateInputWithLabel<insertPaymentSchemaType>
            fieldTitle="Due Date"
            nameInSchema="dueDate"
          />
          <DateInputWithLabel<insertPaymentSchemaType>
            fieldTitle="Payment Date"
            nameInSchema="paymentDate"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputWithLabel<insertPaymentSchemaType>
            fieldTitle="Fee Amount"
            nameInSchema="feeAmount"
          />
          <TextAreaWithLabel<insertPaymentSchemaType>
            fieldTitle="Notes"
            nameInSchema="notes"
          />
        </div>
        <div>
          {warningMessage && (
            <Alert variant="default">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>{warningMessage}</AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter>
          <Button type="submit" className="w-full">
            Submit Payment
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
