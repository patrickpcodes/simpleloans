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
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { DateInputWithLabel } from "@/components/inputs/DateInputWithLabel";
import { CheckboxWithLabel } from "@/components/inputs/CheckboxWithLabel";
import { TextAreaWithLabel } from "@/components/inputs/TextAreaWithLabel";
import { useRouter } from "next/navigation";

type Props = {
  customer?: selectCustomerSchemaType;
};
export default function CustomerForm({ customer }: Props) {
  const router = useRouter();

  const defaultValues: insertCustomerSchemaType = {
    id: customer?.id ?? 0,
    name: customer?.name ?? "",
    email: customer?.email ?? "",
    phone: customer?.phone ?? "",
    birthdate: customer?.birthdate ?? new Date(),
    references: customer?.references ?? "",
    notes: customer?.notes ?? "",
    canSendSpecialEmails: customer?.canSendSpecialEmails ?? false,
    active: customer?.active ?? true,
  };
  const form = useForm<insertCustomerSchemaType>({
    mode: "onBlur",
    resolver: zodResolver(insertCustomerSchema),
    defaultValues,
  });

  async function submitForm(data: insertCustomerSchemaType) {
    let method = "";
    if (data.id) {
      method = "PUT";
    } else {
      method = "POST";
    }
    //TODO add TOAST for Errors
    try {
      const response = await fetch("/api/customers", {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save customer");
      }

      const result = await response.json();
      console.log("This is my result from call");
      console.log(result);
      if (method == "PUT") {
        router.push(`/customers/form?customerId=${data.id}`);
      } else {
        router.push(`/customers/form?customerId=${result[0].id}`);
      }
      // setSuccess(`Customer created with ID: ${result.id}`);
    } catch (err) {
      console.error(err);
      // setError(err.message);
    } finally {
      console.log("finally");
      // setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-1 sm:px-8">
      <div>
        <h2 className="text-2xl font-bold">
          {customer?.id ? "Edit" : "New"} Customer{" "}
          {customer?.id ? `#${customer.id} : ${customer.name}` : "Form"}
        </h2>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitForm)}
          className="space-y-8 max-w-3xl mx-auto py-10"
        >
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <InputWithLabel<insertCustomerSchemaType>
                fieldTitle="Name"
                nameInSchema="name"
              />
            </div>
            <div className="col-span-6">
              <InputWithLabel<insertCustomerSchemaType>
                fieldTitle="Phone"
                nameInSchema="phone"
              />
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <InputWithLabel<insertCustomerSchemaType>
                fieldTitle="Email"
                nameInSchema="email"
              />
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <DateInputWithLabel<insertCustomerSchemaType>
                fieldTitle="Birthdate"
                nameInSchema="birthdate"
              />
            </div>
            <div className="col-span-6">
              <CheckboxWithLabel<insertCustomerSchemaType>
                fieldTitle="Send Birthday Reminders"
                nameInSchema="canSendSpecialEmails"
                message="When this is checked, this customer will recieve a happy
                        birthday email at 9am on their birthday."
              />
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <TextAreaWithLabel<insertCustomerSchemaType>
                fieldTitle="References"
                nameInSchema="references"
                className="min-h-[120px] resize-y"
              />
            </div>
            <div className="col-span-6">
              <TextAreaWithLabel<insertCustomerSchemaType>
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
              onClick={() => form.reset()}
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
