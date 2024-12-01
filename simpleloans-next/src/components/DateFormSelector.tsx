"use client";
import React from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control, FieldValues, Path } from "react-hook-form";

interface DateFormSelectorProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  onValueChange?: (value: string) => void;
}

export default function DateFormSelector<T extends FieldValues>({
  control,
  name,
  label,
  onValueChange,
}: DateFormSelectorProps<T>) {
  return (
    <div className="col-span-6">
      <FormField
        control={control}
        name={name}
        render={({ field }) => {
          return (
            <FormItem className="flex flex-col">
              <FormLabel>{label}</FormLabel>
              <div className="flex">
                <FormControl>
                  <Input
                    type="date"
                    value={field.value || ""}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      if (onValueChange) {
                        onValueChange(e.target.value);
                      }
                    }}
                    className="w-[240px]"
                  />
                </FormControl>
              </div>
              <FormDescription>
                Select from popup or type in format mm/dd/yyyy
              </FormDescription>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </div>
  );
}
