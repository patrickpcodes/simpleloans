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
import { InputHTMLAttributes } from "react";

type SelectProps = {
  key: string;
  value: string;
  displayString: string;
};

type Props<S> = {
  fieldTitle: string;
  nameInSchema: keyof S & string;
  // className?: string;
  // onValueChange?: (value: string) => void;
  defaultValue?: string;
  placeholder: string;
  selectProps: SelectProps[];
  convertToNumber?: boolean;
  disabled?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;

export function SelectInputWithLabel<S>({
  fieldTitle,
  nameInSchema,
  // className,
  // onValueChange,
  defaultValue,
  placeholder,
  selectProps,
  convertToNumber = false,
  disabled = false,
}: // ...props
Props<S>) {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{fieldTitle}</FormLabel>
          <Select
            value={field.value?.toString()} // Bind to field.value for controlled behavior
            onValueChange={(value) => {
              console.log("in select value", value);
              if (convertToNumber) {
                field.onChange(Number(value));
              } else {
                field.onChange(value); // Update form state
              }
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
              {selectProps.map((prop) => (
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
