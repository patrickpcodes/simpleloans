import { format } from "date-fns";

export const formatDateToDateOnly = (date: unknown) => {
  // Ensure the input is a Date object
  const validDate = date instanceof Date ? date : new Date(date);

  // Check if the resulting Date is valid
  if (isNaN(validDate.getTime())) {
    throw new Error("Invalid Date");
  }

  // Format the date to YYYY-MM-DD
  return validDate.toISOString().split("T")[0];
};

export const formatDateToMonthDayYear = (date: unknown) => {
  // Ensure the input is a Date object
  const validDate = date instanceof Date ? date : new Date(date);

  // Check if the resulting Date is valid
  if (isNaN(validDate.getTime())) {
    throw new Error("Invalid Date");
  }

  return format(validDate, "PPP");
};
