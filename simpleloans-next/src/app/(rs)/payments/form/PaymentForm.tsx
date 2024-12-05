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
// import { Input } from "postcss";

type Props = {
  payment: Payment;
  onSubmit?: (payment: Payment) => void;
};

export default function PaymentForm({ payment, onSubmit }: Props) {
  console.log(onSubmit);
  const warningMessage = "This is a warning message";
  const defaultValues: insertPaymentSchemaType = {
    id: payment?.id ?? 0,
    loanId: payment?.loanId ?? 0,
    amountDue: payment?.amountDue ?? "0",
    amountPaid: payment?.amountPaid ?? "0",
    feeAmount: payment?.feeAmount ?? "0",
    paymentStatus: payment.paymentStatus,
    paymentDate: payment?.paymentDate ?? formatDateToYYYYMMDD(new Date()),
    dueDate: payment.dueDate,
  };

  const form = useForm<insertPaymentSchemaType>({
    resolver: zodResolver(insertPaymentSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form className="space-y-6">
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
        </div>
        <div className="grid grid-cols-2 gap-4">
          <InputWithLabel<insertPaymentSchemaType>
            fieldTitle="Amount to Pay"
            nameInSchema="amountDue"
          />
          <InputWithLabel<insertPaymentSchemaType>
            fieldTitle="Amount Paid"
            nameInSchema="amountPaid"
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
