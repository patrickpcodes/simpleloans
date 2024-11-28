export interface Customer {
  id: string;
  name: string;
  phoneNumber: string;
  birthday: string;
  email: string;
  canSendEmail: boolean;
  notes: string;
}

import { History } from "./History";
export interface CustomerWithHistory {
  customer: Customer;
  history: History[];
}
