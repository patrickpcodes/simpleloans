import { PaymentStatus } from "./PaymentStatus";

export interface Payment {
  id: string;
  dueDate: string; // "yyyy-MM-dd"
  datePaid: string | null; // "yyyy-MM-dd"
  amountDue: number;
  amountPaid: number;
  fee: number;
  status: PaymentStatus;
}
