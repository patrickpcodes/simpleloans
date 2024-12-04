"use client";

import { useFormContext } from "react-hook-form";

import {
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
import { Input } from "@/components/ui/input";
import { InputHTMLAttributes } from "react";

type SelectProps = {
  key: string;
  value: string;
  displayString: string;
};

type Props<S> = {
  fieldTitle: string;
  nameInSchema: keyof S & string;
  className?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  placeholder: string;
  selectProps: SelectProps[];
  disabled?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;

export function SelectInputWithLabel<S>({
  fieldTitle,
  nameInSchema,
  className,
  onValueChange,
  defaultValue,
  placeholder,
  selectProps,
  disabled = false,
  ...props
}: Props<S>) {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{fieldTitle}</FormLabel>
          <Select
            onValueChange={(value) => {
              const numericValue = Number(value); // Convert value to number
              field.onChange(numericValue); // Update form state
              console.log(field);
              //   if (onValueChange) {
              //     onValueChange(numericValue); // Call custom callback
              //   }
            }}
            defaultValue={defaultValue?.toString() || field.value?.toString()} // Ensure initial value is a string
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {selectProps.map((prop, index) => (
                <SelectItem
                  key={prop.key}
                  value={prop.value} // Convert number to string
                >
                  {prop.displayString}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
