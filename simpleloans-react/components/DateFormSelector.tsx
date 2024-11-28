"use client";
import React from "react";
import { useState, useEffect } from "react";
import { format, parse, isValid } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Control } from "react-hook-form";

interface DateFormSelectorProps {
  control: Control<any>;
  name: string;
}

export default function DateFormSelector({
  control,
  name,
}: DateFormSelectorProps) {
  return (
    <div className="col-span-6">
      <FormField
        control={control}
        name={name}
        render={({ field }) => {
          const [inputValue, setInputValue] = useState(
            field.value ? format(field.value, "yyyy-MM-dd") : ""
          );

          useEffect(() => {
            if (field.value) {
              setInputValue(format(field.value, "yyyy-MM-dd"));
            } else {
              setInputValue("");
            }
          }, [field.value]);

          const handleInputChange = (
            e: React.ChangeEvent<HTMLInputElement>
          ) => {
            const value = e.target.value;
            setInputValue(value);
            if (value === "") {
              field.onChange(null);
            } else {
              const parsedDate = parse(value, "yyyy-MM-dd", new Date());
              if (isValid(parsedDate)) {
                field.onChange(parsedDate);
              }
            }
          };

          return (
            <FormItem className="flex flex-col">
              <FormLabel>Birthday</FormLabel>
              <div className="flex">
                <FormControl>
                  <Input
                    type="date"
                    value={inputValue}
                    onChange={handleInputChange}
                    className="w-[240px]"
                  />
                </FormControl>
                {/* <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "ml-2 w-10 p-0",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        if (date) {
                          field.onChange(date);
                          setInputValue(format(date, "yyyy-MM-dd"));
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover> */}
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
