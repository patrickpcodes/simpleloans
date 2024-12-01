"use client";

import { useFormContext } from "react-hook-form";

import { InputHTMLAttributes } from "react";
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
import { format, startOfDay } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, FormInput } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatDateToDateOnly } from "@/utils/formatDateToDateOnly";

type Props<S> = {
  fieldTitle: string;
  nameInSchema: keyof S & string;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function DateInputWithLabel<S>({
  fieldTitle,
  nameInSchema,
  className,
  ...props
}: Props<S>) {
  const form = useFormContext();

  const handleDateChange = (date) => {
    if (!date) return;

    // Ensure the date is set to the start of the day
    const startOfDayDate = startOfDay(new Date(date));

    console.log(format(startOfDayDate, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")); // "2024-11-12T00:00:00.000Z"

    return format(startOfDayDate, "PPP");
  };

  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field: { value, onChange, ...rest } }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{fieldTitle}</FormLabel>
          <div className="flex">
            <FormControl>
              <Input
                type="date"
                value={formatDateToDateOnly(value)}
                onChange={(e) => {
                  console.log(e.target.value);
                  onChange(new Date(e.target.value));
                  console.log("I changed Date to ", value);
                }}
                className="w-[240px]"
              />
            </FormControl>
          </div>
          <FormDescription>
            Your date of birth is used to calculate your age.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
