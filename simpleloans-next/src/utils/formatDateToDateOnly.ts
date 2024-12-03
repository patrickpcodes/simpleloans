import { format } from "date-fns";

export const formatDateToDateOnly = (date: Date) => {
  console.log("in formatDateToDateOnly : date", date);

  // Format the date to YYYY-MM-DD
  return date.toISOString().split("T")[0];
};

export const formatDateStringToDateOnly = (date: string) => {
  // Ensure the input is a Date object
  const validDate = new Date(date);

  // Check if the resulting Date is valid
  if (isNaN(validDate.getTime())) {
    return date;
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
    return date;
  }

  return format(validDate, "PPP");
};
