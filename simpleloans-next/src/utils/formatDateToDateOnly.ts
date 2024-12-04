import { format, parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

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

// export const formatDateToMonthDayYear = (date: Date) => {
//   return format(date, "PPP");
// };

export const formatDateToYYYYMMDD = (date: Date) => {
  console.log("date string", date);
  const utcDate = new Date(date);
  return formatInTimeZone(utcDate, "UTC", "yyyy-MM-dd");
};

export const formatDateStringToMonthDayYear = (date: string) => {
  console.log("date string", date);
  const [year, month, day] = date.split("-").map(Number);
  const utcDate = new Date(Date.UTC(year, month - 1, day));
  return formatInTimeZone(utcDate, "UTC", "PPP"); // 'PPP' is a human-readable date format like 'Dec 4, 2024'
};
