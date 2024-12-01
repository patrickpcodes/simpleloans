import { db } from "@/db";
import { customers } from "@/db/schema";

export async function getCustomers() {
  const customerList = await db.select().from(customers);

  return customerList;
}
