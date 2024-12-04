"use client";
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import {
  insertPaymentSchema,
  insertPaymentSchemaType,
  Payment,
} from "@/zod-schemas/payment";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";
import { format } from "date-fns";
import { DollarSign, CreditCard, CalendarIcon, Calendar } from "lucide-react";
import { DateInputWithLabel } from "@/components/inputs/DateInputWithLabel";
// import { Input } from "postcss";

type Props = {
  payment: Payment;
  onSubmit?: (payment: Payment) => void;
};

export default function PaymentForm({ payment, onSubmit }: Props) {
  const defaultValues: insertPaymentSchemaType = {
    id: payment?.id ?? 0,
    loanId: payment?.loanId ?? 0,
    amountDue: payment?.amountDue ?? "0",
    amountPaid: payment?.amountPaid ?? "0",
    feeAmount: payment?.feeAmount ?? "0",
    paymentStatus: payment.paymentStatus,
    paymentDate: payment?.paymentDate ?? new Date(),
    dueDate: payment.dueDate,
  };

  const form = useForm<insertPaymentSchemaType>({
    resolver: zodResolver(insertPaymentSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
        {/* <FormField
          control={form.control}
          name="fee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fee</FormLabel>
              <FormControl>
                <Input {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="paymentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a payment type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="cash">
                    <div className="flex items-center">
                      <DollarSign className="mr-2 h-4 w-4" />
                      Cash
                    </div>
                  </SelectItem>
                  <SelectItem value="card">
                    <div className="flex items-center">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Card
                    </div>
                  </SelectItem>
                  <SelectItem value="bank_transfer">
                    <div className="flex items-center">
                      <Bank className="mr-2 h-4 w-4" />
                      Bank Transfer
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        {/* <FormField
          control={form.control}
          name="paymentDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Payment Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <DialogFooter>
          <Button type="submit" className="w-full">
            Submit Payment
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
