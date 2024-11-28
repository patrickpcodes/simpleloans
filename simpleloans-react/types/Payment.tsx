export interface Payment {
  id: string;
  dueDate: string; // "yyyy-MM-dd"
  amountDue: number;
  status: PaymentStatus;
}

export type PaymentStatus = "Pending" | "Paid" | "Missed";
