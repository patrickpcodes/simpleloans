import { LoanStatus } from "./LoanStatus";
import { Payment } from "./Payment";
import { PaymentFrequency } from "./PaymentFrequency";

export interface Loan {
    id: string; // Guid in C#
    customerId: string; // Guid in C#
    creationDate: string; // ISO 8601 DateTime (e.g., "2024-11-27T12:00:00Z")
    closedDate?: string; // Nullable DateTime, optional in TypeScript
    loanAmount: number;
    interestRate: number;
    numberOfWeeks: number;
    paymentFrequency: PaymentFrequency;
    originalTotalAmountToBeRepaid: number;
    totalAmountRepaid: number; // Defaults to 0 in C#
    status: LoanStatus;
    payments: Payment[]; // Reference to Payment type
  }