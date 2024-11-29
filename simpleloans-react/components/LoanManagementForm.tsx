"use client";
import { useEffect, useState, useCallback } from "react";
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
import { Customer } from "@/types/Customer";
import { loanDetailsSchema, LoanDetailsFormValues } from "@/types/LoanDetails";
import DateFormSelector from "@/components/DateFormSelector";
import { Textarea } from "./ui/textarea";

interface LoanManagementFormProps {
  customerOptions: Customer[];
  startingCustomer?: Customer;
  onGeneratePayments?: (values: LoanDetailsFormValues) => Promise<void>;

  onFormSubmit: (values: LoanDetailsFormValues) => void; // Add this prop
}
//TODO add in way to use this to handle both load creating and loan editing
export default function LoanManagementForm({
  customerOptions,
  startingCustomer,
  onGeneratePayments,
  onFormSubmit,
}: LoanManagementFormProps) {
  console.log("In code Loan Management Form");
  console.log(customerOptions);
  console.log(startingCustomer);
  const { toast } = useToast();

  const form = useForm<LoanDetailsFormValues>({
    resolver: zodResolver(loanDetailsSchema),
    defaultValues: {
      customerId: startingCustomer?.id,
      startDate: "",
      numberOfWeeks: 8,
      startingAmount: 1000,
      interest: 0,
      totalToPayBack: 0,
      frequency: PaymentFrequency.WEEKLY,
      notes: "",
    },
  });
  console.log("Form CustomerId", form.getValues("customerId"));

  useEffect(() => {
    if (startingCustomer) {
      form.setValue("customerId", startingCustomer.id);
    }
  }, [startingCustomer, form]);

  function onSubmit(values: LoanDetailsFormValues) {
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

  async function handleInterestRateBlur(value: string) {
    console.log("Total Paid Back value:", value);
    // Example: Update another field based on the value
    const interestRate = parseFloat(value || "0");
    const numWeeks = form.getValues("numberOfWeeks");
    const loanAmount = form.getValues("startingAmount");

    if (!isNaN(interestRate) && numWeeks > 0 && loanAmount > 0) {
      const weeklyInterestRate = interestRate / 52 / 100;
      const totalPaidBack = loanAmount * (1 + weeklyInterestRate * numWeeks);
      form.setValue("totalToPayBack", totalPaidBack); // Example calculation
      form.setValue("interest", interestRate);
      await form.trigger();
      console.log("Updated interest rate based on total paid back");
    }
  }

  async function handleTotalPaidBackBlur(value: string) {
    console.log("Total Paid Back value:", value);
    const totalPaidBack = parseFloat(value || "0");
    // Get the current value of numWeeks from the form
    const numWeeks = form.getValues("numberOfWeeks");
    const loanAmount = form.getValues("startingAmount");
    console.log("numWeeks value:", numWeeks);

    if (!isNaN(totalPaidBack) && numWeeks > 0 && loanAmount > 0) {
      // Calculate the interest rate (example calculation)
      const interestRate =
        ((totalPaidBack / loanAmount - 1) / numWeeks) * 52 * 100;

      // Update the interestRate field in the form
      form.setValue("interest", interestRate);
      form.setValue("totalToPayBack", totalPaidBack);
      console.log("Calculated interest rate:", interestRate);
      await form.trigger();
    } else {
      console.warn("Invalid input for totalPaidBack or numWeeks");
    }
  }
  async function handleDateChanged() {
    console.log("Date Changed");
    console.log("date", form.getValues("startDate"));
    await form.trigger();
  }
  async function handleGeneratePayments() {
    // Trigger validation for all fields
    form.clearErrors();
    const isValid = await form.trigger();

    if (isValid && onGeneratePayments) {
      // If the form is valid, send values to the parent
      const values = form.getValues();
      console.log("Sending values to parent:", values);

      onGeneratePayments(values);
    } else {
      // If not valid, errors are highlighted automatically
      toast({
        variant: "destructive",
        title: "Fix errors before generating the loan payments",
      });
    }
  }
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
  const handleValueChange = useCallback(
    (value: string) => {
      // Your custom code here
      console.log("Selected customer ID:", value);

      // You can perform any custom logic here, for example:
      const selectedCustomer = customerOptions.find(
        (customer) => customer.id === value
      );
      if (selectedCustomer) {
        console.log("Selected customer name:", selectedCustomer.name);
        // Perform any other actions with the selected customer
      }

      // Don't forget to update the form value
      form.setValue("customerId", value);
    },
    [form, customerOptions]
  );

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
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer</FormLabel>
                  <Select
                    onValueChange={handleValueChange}
                    value={field.value} // This line is the update
                    defaultValue={startingCustomer?.id}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a customer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {customerOptions.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
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
              name="frequency"
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
                      {Object.values(PaymentFrequency).map((freq) => (
                        <SelectItem key={freq} value={freq}>
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
            <FormField
              control={form.control}
              name="numberOfWeeks"
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
              name="startingAmount"
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
              name="interest"
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
              name="totalToPayBack"
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
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <DateFormSelector
              control={form.control}
              name="startDate"
              label="First Payment Date"
              onValueChange={handleDateChanged}
            />
          </div>
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <Textarea
                    placeholder="Enter notes here..."
                    className="min-h-[120px] resize-y"
                    {...field}
                  />
                  <FormDescription>
                    Any customer notes, references, history.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button type="button" onClick={handleSendValues}>
          Callback
        </Button>
        {handleGeneratePayments && (
          <Button type="button" onClick={handleGeneratePayments}>
            GeneratePayments
          </Button>
        )}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
