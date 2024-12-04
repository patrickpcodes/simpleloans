import { db } from "@/db";
import { customers, history } from "@/db/schema";
import { selectCustomerSchemaType } from "@/zod-schemas/customer";
import { desc, eq, and } from "drizzle-orm";
import { generateChanges } from "@/utils/generateChanges";
import { getCustomer } from "./getCustomer";
type Customer = selectCustomerSchemaType;

export async function updateCustomer(
  updatedCustomer: Customer,
  userEmail: string,
  displayName: string
) {
  const existingCustomer = await getCustomer(updatedCustomer.id);

  if (!existingCustomer) {
    throw new Error(`Customer with ID ${updatedCustomer.id} not found.`);
  }

  // Fields to track
  const trackedFields: (keyof Customer)[] = [
    "name",
    "phone",
    "email",
    "birthdate",
    "canSendSpecialEmails",
    "notes",
    "references",
    "active",
  ];

  // Track changes
  const changes = generateChanges(
    existingCustomer,
    updatedCustomer,
    trackedFields
  );

  if (changes.length === 0) {
    return { status: 304, message: "No changes detected." };
  }

  console.log("in updateCustomer : changes", changes);
  // Save history
  await db.insert(history).values({
    type: "Customer",
    referenceId: updatedCustomer.id,
    changes: changes,
    userEmail,
    displayName,
    timestamp: new Date(),
  });

  // console.log("in updateCustomer : insertedChanges");
  // Update customer
  await db
    .update(customers)
    .set(updatedCustomer)
    .where(eq(customers.id, updatedCustomer.id));
  console.log("in updateCustomer : updatedCustomer");
  // Fetch updated history
  const updatedHistory = await db
    .select()
    .from(history)
    .where(
      and(
        eq(history.referenceId, updatedCustomer.id),
        eq(history.type, "Customer")
      )
    )
    .orderBy(desc(history.timestamp));

  return {
    customer: { ...existingCustomer, ...updatedCustomer },
    history: updatedHistory,
  };
}
