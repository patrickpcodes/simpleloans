"use client";

import { useFormContext } from "react-hook-form";

import { InputHTMLAttributes } from "react";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formatDateStringToDateOnly } from "@/utils/formatDateToDateOnly";

type Props<S> = {
  fieldTitle: string;
  nameInSchema: keyof S & string;
  className?: string;
  disabled?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;

export function DateInputWithLabel<S>({
  fieldTitle,
  nameInSchema,
  className,
  //TODO make sure its disabled
  disabled = false,
}: Props<S>) {
  const form = useFormContext();

  // const handleDateChange = (date: string) => {
  //   if (!date) return;

  //   // Ensure the date is set to the start of the day
  //   const startOfDayDate = startOfDay(new Date(date));

  //   console.log(format(startOfDayDate, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")); // "2024-11-12T00:00:00.000Z"

  //   return format(startOfDayDate, "PPP");
  // };

  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      disabled={disabled}
      render={({ field: { value, onChange } }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{fieldTitle}</FormLabel>
          <div className="flex">
            <FormControl>
              <Input
                type="date"
                value={formatDateStringToDateOnly(value)}
                onChange={(e) => {
                  console.log(e.target.value);
                  onChange(new Date(e.target.value));
                  console.log("I changed Date to ", value);
                }}
                className={`w-[240px] ${className}`}
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
