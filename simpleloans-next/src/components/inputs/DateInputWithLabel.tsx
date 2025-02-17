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

type Props<S> = {
  fieldTitle: string;
  nameInSchema: keyof S & string;
  className?: string;
  description?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function DateInputWithLabel<S>({
  fieldTitle,
  nameInSchema,
  className,
  description,
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
      // disabled={disabled}
      render={({ field: { value, onChange } }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{fieldTitle}</FormLabel>
          <div className="flex">
            <FormControl>
              <Input
                type="date"
                value={value}
                onChange={(e) => {
                  console.log("value", e.target.value);
                  onChange(e.target.value);
                  console.log("I changed Date to ", value);
                }}
                // readOnly={disabled}
                className={`w-[240px] ${className}`}
              />
            </FormControl>
          </div>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
