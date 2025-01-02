import { formatDateStringToMonthDayYear } from "./formatDateToDateOnly";
import { formatStringToDollar } from "./formatStringToDollar";

export function generateEmailText(
  name: string,
  dueAmount: string,
  dueDate: string
): string {
  return `Good morning ${name},\nJust a reminder that a payment of ${formatStringToDollar(
    dueAmount
  )} is due to be made on ${formatDateStringToMonthDayYear(
    dueDate
  )} by e-transfer to info@simpleloans500.com. Please ensure this payment arrangement is respected, in order to avoid a required $65 missed payment fee, as per stated in your contract. Also, please ensure that the payment is made in the morning as Collection follow-ups are done around noon.\nThank you and have a great day`;
}
export function generateEmailHtml(
  name: string,
  dueAmount: string,
  dueDate: string
): string {
  return `<p>Good morning ${name},</p><p>Just a reminder that a payment of ${formatStringToDollar(
    dueAmount
  )} is due to be made on ${formatDateStringToMonthDayYear(
    dueDate
  )} by e-transfer to info@simpleloans500.com. Please ensure this payment arrangement is respected, in order to avoid a required $65 missed payment fee, as per stated in your contract. Also, please ensure that the payment is made in the morning as Collection follow-ups are done around noon.</p><p>Thank you and have a great day</p>`;
}
