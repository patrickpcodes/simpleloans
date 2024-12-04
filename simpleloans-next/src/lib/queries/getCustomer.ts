import { db } from "@/db";
import { customers } from "@/db/schema";
import { Customer } from "@/types/Customer";
import { eq } from "drizzle-orm";

export async function getCustomer(id: number): Promise<Customer | null> {
  const customer = await db
    .select()
    .from(customers)
    .where(eq(customers.id, id));

  return customer.length > 0 ? customer[0] : null;
}
