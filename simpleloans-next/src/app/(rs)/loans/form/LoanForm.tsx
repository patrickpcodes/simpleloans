"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { selectCustomerSchemaType } from "@/zod-schemas/customer";
import {
  insertLoanSchema,
  insertLoanSchemaType,
  selectLoanSchemaType,
} from "@/zod-schemas/loan";
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { TextAreaWithLabel } from "@/components/inputs/TextAreaWithLabel";
// import { useRouter } from "next/navigation";
import { LOAN_PAYMENT_FREQUENCIES } from "@/types/LoanPaymentFrequency";
import { selectPaymentSchemaType } from "@/zod-schemas/payment";
import { formatNumberToDollar } from "@/utils/formatStringToDollar";
import { DateInputWithLabel } from "@/components/inputs/DateInputWithLabel";
import { useRouter } from "next/navigation";

type Props = {
  loan?: selectLoanSchemaType;
  customers: selectCustomerSchemaType[];
  payments?: selectPaymentSchemaType[];
  customerId?: number;
};

export default function LoanForm({
  loan,
  customers,
  payments,
  customerId,
}: Props) {
  const router = useRouter();
  if (customerId) {
  }
  // const router = useRouter();
  const defaultValues: insertLoanSchemaType = {
    id: loan?.id ?? 0,
    customerId: loan?.customerId ?? customerId ?? 0,
    numberOfPayments: loan?.numberOfPayments ?? 0,
    paymentFrequency: loan?.paymentFrequency ?? LOAN_PAYMENT_FREQUENCIES[0],
    initialBorrowedAmount: loan?.initialBorrowedAmount ?? "0",
    initialDueAmount: loan?.initialDueAmount ?? "0",
    firstPaymentDate: loan?.firstPaymentDate ?? new Date(),
    notes: loan?.notes ?? "",
  };

  const form = useForm<insertLoanSchemaType>({
    mode: "onBlur",
    resolver: zodResolver(insertLoanSchema),
    defaultValues,
  });

  async function submitForm(data: insertLoanSchemaType) {
    console.log("submit", data);
    let method = "";
    if (data.id && data.id > 0) {
      method = "PUT";
      return;
    } else {
      method = "POST";
    }
    try {
      const response = await fetch("/api/loans", {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to save loan");
      }

      const result = await response.json();
      console.log("This is my result from call");
      console.log(result);

      if (method == "PUT") {
        router.push(`/loans/form?loanId=${data.id}`);
      } else {
        router.push(`/loans/form?loanId=${result[0].id}`);
      }
    } catch (err) {
      console.error(err);
      // setError(err.message);
    } finally {
      console.log("finally");
      // setLoading(false);
    }
  }

  const totalPaid = payments
    ? payments.reduce((sum, item) => sum + parseFloat(item.amountPaid), 0)
    : 0;
  const totalFees = payments
    ? payments.reduce((sum, item) => sum + parseFloat(item.feeAmount), 0)
    : 0;

  //   // Reset the form whenever `loan` or `customers` change
  //   useEffect(() => {
  //     form.reset(defaultValues);
  //   }, [loan, customers, form.reset]);
  return (
    <div className="flex flex-col gap-1 sm:px-8">
      <div>
        <h2 className="text-2xl font-bold">
          {loan?.id ? "Edit" : "New"} loan {loan?.id ? `#${loan.id}` : "Form"}
        </h2>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(submitForm)}
              className="space-y-8 max-w-3xl mx-auto py-10"
            >
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6">
                  <FormField
                    control={form.control}
                    name="customerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          } // Convert selected value back to number
                          defaultValue={field.value?.toString()} // Ensure initial value is a string
                          disabled={loan?.id ? true : false}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Customer" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {customers.map((customer, index) => (
                              <SelectItem
                                key={`customer_${index}`}
                                value={customer.id.toString()} // Convert number to string
                              >
                                {customer.id.toString()} - {customer.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-6">
                  <FormField
                    control={form.control}
                    name="paymentFrequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Frequency</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={loan?.id ? true : false}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a payment frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {LOAN_PAYMENT_FREQUENCIES.map((freq) => (
                              <SelectItem
                                key={`paymentFreq_${freq}`}
                                value={freq}
                              >
                                {freq}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6">
                  <InputWithLabel<insertLoanSchemaType>
                    fieldTitle="Number of Payments"
                    nameInSchema="numberOfPayments"
                    isNumber={true}
                    disabled={loan?.id ? true : false}
                  />
                </div>

                <div className="col-span-6">
                  <DateInputWithLabel<insertLoanSchemaType>
                    fieldTitle="First Payment Date"
                    nameInSchema="firstPaymentDate"
                    disabled={loan?.id ? true : false}
                  />
                </div>
              </div>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6">
                  <InputWithLabel<insertLoanSchemaType>
                    fieldTitle="Initial Borrowed Amount"
                    nameInSchema="initialBorrowedAmount"
                    disabled={loan?.id ? true : false}
                  />
                </div>
                <div className="col-span-6">
                  <InputWithLabel<insertLoanSchemaType>
                    fieldTitle="Initial Due Amount"
                    nameInSchema="initialDueAmount"
                    disabled={loan?.id ? true : false}
                  />
                </div>
              </div>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6">
                  <TextAreaWithLabel<insertLoanSchemaType>
                    fieldTitle="Notes"
                    nameInSchema="notes"
                    className="min-h-[120px] resize-y"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="w-3/4"
                  variant="default"
                  title="Save"
                >
                  Save
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  title="Reset"
                  onClick={() => form.reset(defaultValues)}
                >
                  Reset
                </Button>
              </div>
            </form>
          </Form>
        </div>

        <div className="col-span-6">
          <h2>Calculated Values</h2>
          <h3>Total Amount Paid : {formatNumberToDollar(totalPaid)}</h3>
          <h3>Total Fees : {formatNumberToDollar(totalFees)}</h3>
        </div>
      </div>
    </div>
  );
}
