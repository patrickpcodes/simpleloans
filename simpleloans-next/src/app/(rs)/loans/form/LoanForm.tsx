"use client";
import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useController, useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import DateFormSelector from "@/components/DateFormSelector";
import { CustomerFormValues, customerFormSchema } from "@/types/Customer";
import { Textarea } from "../../../../components/ui/textarea";
import {
  insertCustomerSchema,
  insertCustomerSchemaType,
  selectCustomerSchemaType,
} from "@/zod-schemas/customer";
import {
  insertLoanSchema,
  insertLoanSchemaType,
  selectLoanSchemaType,
} from "@/zod-schemas/loan";
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { DateInputWithLabel } from "@/components/inputs/DateInputWithLabel";
import { CheckboxWithLabel } from "@/components/inputs/CheckboxWithLabel";
import { TextAreaWithLabel } from "@/components/inputs/TextAreaWithLabel";
import { useRouter } from "next/navigation";
import { LOAN_PAYMENT_FREQUENCIES } from "@/types/LoanPaymentFrequency";

type Props = {
  loan?: selectLoanSchemaType;
  customers: selectCustomerSchemaType[];
};

export default function LoanForm({ loan, customers }: Props) {
  const router = useRouter();
  const defaultValues: insertLoanSchemaType = {
    id: loan?.id ?? 0,
    customerId: loan?.customerId ?? 0,
    numberOfPayments: loan?.numberOfPayments ?? 0,
    paymentFrequency: loan?.paymentFrequency ?? LOAN_PAYMENT_FREQUENCIES[1],
    initialBorrowedAmount: loan?.initialBorrowedAmount ?? 0,
    initialDueAmount: loan?.initialDueAmount ?? 0,
    firstPaymentDate: loan?.firstPaymentDate ?? new Date(),
    notes: loan?.notes ?? "",
  };
  const form = useForm<insertLoanSchemaType>({
    mode: "onBlur",
    resolver: zodResolver(insertLoanSchema),
    defaultValues,
  });
  //   // Reset the form whenever `loan` or `customers` change
  //   useEffect(() => {
  //     form.reset(defaultValues);
  //   }, [loan, customers, form.reset]);
  async function submitForm(data: insertLoanSchemaType) {
    console.log(data);
  }
  return (
    <div className="flex flex-col gap-1 sm:px-8">
      <div>
        <h2 className="text-2xl font-bold">
          {loan?.id ? "Edit" : "New"} loan {loan?.id ? `#${loan.id}` : "Form"}
        </h2>
      </div>
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
                      onValueChange={(value) => field.onChange(Number(value))} // Convert selected value back to number
                      defaultValue={field.value?.toString()} // Ensure initial value is a string
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
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a payment frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LOAN_PAYMENT_FREQUENCIES.map((freq, index) => (
                          <SelectItem key={`paymentFreq_${freq}`} value={freq}>
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
              />
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <InputWithLabel<insertLoanSchemaType>
                fieldTitle="Initial Borrowed Amount"
                nameInSchema="initialBorrowedAmount"
              />
            </div>
            <div className="col-span-6">
              <InputWithLabel<insertLoanSchemaType>
                fieldTitle="Initial Due Amount"
                nameInSchema="initialDueAmount"
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
      {JSON.stringify(form.getValues())}
    </div>
  );
}
