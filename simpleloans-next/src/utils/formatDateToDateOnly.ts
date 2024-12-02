import { format } from "date-fns";

export const formatDateToDateOnly = (date: Date) => {
  // Format the date to YYYY-MM-DD
  return date.toISOString().split("T")[0];
};

export const formatDateStringToDateOnly = (date: string) => {
  // Ensure the input is a Date object
  const validDate = new Date(date);

  // Check if the resulting Date is valid
  if (isNaN(validDate.getTime())) {
    throw new Error("Invalid Date");
  }

  // Format the date to YYYY-MM-DD
  return validDate.toISOString().split("T")[0];
};

export const formatDateToMonthDayYear = (date: Date) => {
  return format(date, "PPP");
};

export const formatDateStringToMonthDayYear = (date: string) => {
  const validDate = new Date(date);

  // Check if the resulting Date is valid
  if (isNaN(validDate.getTime())) {
    throw new Error("Invalid Date");
  }

  return format(validDate, "PPP");
};
