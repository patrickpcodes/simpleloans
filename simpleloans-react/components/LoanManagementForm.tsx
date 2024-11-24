"use client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useController, useForm } from "react-hook-form";
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
import { Customer } from "@/types/Customer";

const formSchema = z.object({
  customer: z.string(),
  loanFrequency: z.string(),
  numWeeks: z
    .number()
    .gt(0, { message: "Number of weeks must be greater than 0" }),
  loanAmount: z
    .number()
    .gt(0, { message: "Loan Amount must be greater than 0" }),
  interestRate: z
    .number()
    .gt(0, { message: "Interest Rate must be greater than 0" }),
  totalPaidBack: z
    .number()
    .gt(0, { message: "Total Paid Back must be greater than 0" }),
  startDate: z.coerce.date(),
});
interface LoanManagementFormProps {
  customerOptions: Customer[];
  startingCustomer?: Customer;
  frequencyOptions: string[];

  onFormSubmit: (values: z.infer<typeof formSchema>) => void; // Add this prop
}

export default function LoanManagementForm({
  customerOptions,
  startingCustomer,
  frequencyOptions,
  onFormSubmit,
}: LoanManagementFormProps) {
  console.log("In code Loan Management Form");
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer: startingCustomer?.name || "",
      startDate: new Date(),
      loanFrequency: frequencyOptions[0],
      numWeeks: 8,
      loanAmount: 1200,
      interestRate: 0,
      totalPaidBack: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
      toast({
        title: "Form submitted",
        description: `Values: ${JSON.stringify(values)}`,
      });
    } catch (error) {
      console.error("Form submission error", error);
      toast({
        variant: "destructive",
        title: "Failed to submit the form. Please try again.",
      });
    }
  }

  const { field: customerField } = useController({
    name: "customer",
    control: form.control,
  });

  const handleCustomerChange = (value: string) => {
    customerField.onChange(value);
    console.log("Customer changed", value);
  };

  const handleInterestRateBlur = (value: string) => {
    console.log("Total Paid Back value:", value);
    // Example: Update another field based on the value
    const interestRate = parseFloat(value || "0");
    const numWeeks = form.getValues("numWeeks");
    const loanAmount = form.getValues("loanAmount");

    if (!isNaN(interestRate) && numWeeks > 0 && loanAmount > 0) {
      const weeklyInterestRate = interestRate / 52 / 100;
      const totalPaidBack = loanAmount * (1 + weeklyInterestRate * numWeeks);
      form.setValue("totalPaidBack", totalPaidBack); // Example calculation
      form.setValue("interestRate", interestRate);
      console.log("Updated interest rate based on total paid back");
    }
  };

  const handleTotalPaidBackBlur = (value: string) => {
    console.log("Total Paid Back value:", value);
    const totalPaidBack = parseFloat(value || "0");
    // Get the current value of numWeeks from the form
    const numWeeks = form.getValues("numWeeks");
    const loanAmount = form.getValues("loanAmount");
    console.log("numWeeks value:", numWeeks);

    if (!isNaN(totalPaidBack) && numWeeks > 0 && loanAmount > 0) {
      // Calculate the interest rate (example calculation)
      const interestRate =
        ((totalPaidBack / loanAmount - 1) / numWeeks) * 52 * 100;

      // Update the interestRate field in the form
      form.setValue("interestRate", interestRate);
      form.setValue("totalPaidBack", totalPaidBack);
      console.log("Calculated interest rate:", interestRate);
    } else {
      console.warn("Invalid input for totalPaidBack or numWeeks");
    }
  };

  async function handleSendValues() {
    // Trigger validation for all fields
    form.clearErrors();
    const isValid = await form.trigger();

    if (isValid) {
      // If the form is valid, send values to the parent
      const values = form.getValues();
      console.log("Sending values to parent:", values);
      onFormSubmit(values);
    } else {
      // If not valid, errors are highlighted automatically
      toast({
        variant: "destructive",
        title: "Fix errors before generating the loan payments",
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl mx-auto py-10"
      >
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="customer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer</FormLabel>
                  <Select
                    onValueChange={handleCustomerChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Test Hard" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {customerOptions.map((customer) => (
                        <SelectItem key={customer.id} value={customer.name}>
                          {customer.name}
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
              name="loanFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loan Frequency</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Weekly" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {frequencyOptions.map((frequency, index) => (
                        <SelectItem key={index} value={frequency}>
                          {frequency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>How often is the loan paid</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="numWeeks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Weeks</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>How many weeks is the loan</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-6">
            <FormField
              control={form.control}
              name="loanAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loan Amount</FormLabel>
                  <FormControl>
                    <Input placeholder="" type="number" {...field} />
                  </FormControl>
                  <FormDescription>How much is the loan for</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="interestRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interest Rate (%)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      type="number"
                      {...field}
                      onBlur={(e) => handleInterestRateBlur(e.target.value)}
                    />
                  </FormControl>
                  <FormDescription>
                    This is loan interest rate (annualized)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-6">
            <FormField
              control={form.control}
              name="totalPaidBack"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount Paid Back</FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      type="number"
                      {...field}
                      onBlur={(e) => handleTotalPaidBackBlur(e.target.value)}
                    />
                  </FormControl>
                  <FormDescription>
                    This is total amount of loan to be paid back
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Loan Start Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
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
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                This is the Date the loan officially starts
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="button" onClick={handleSendValues}>
          Callback
        </Button>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
