import { db } from "@/db";
import { customers, history } from "@/db/schema";
import { selectCustomerSchemaType } from "@/zod-schemas/customer";
import { desc, eq } from "drizzle-orm";
import { formatDateToDateOnly } from "@/utils/formatDateToDateOnly";
import { Change } from "@/zod-schemas/changes";

function trackChanges(
  existing: Record<string, string | null>,
  updated: Record<string, string | null>,
  fields: string[]
): Change[] {
  return fields.reduce<Change[]>((changes, field) => {
    console.log("in trackChanges : field", field);
    console.log("in trackChanges : existing[field]", existing[field]);
    console.log("in trackChanges : updated[field]", updated[field]);

    if (existing[field]?.toString() !== updated[field]?.toString()) {
      changes.push({
        field,
        oldValue: existing[field] || null,
        newValue: updated[field] || null,
      });
    }
    return changes;
  }, []);
}

type Customer = selectCustomerSchemaType;

export async function updateCustomer(
  updatedCustomer: Customer,
  userEmail: string,
  displayName: string
) {
  const existingCustomers = await db
    .select()
    .from(customers)
    .where(eq(customers.id, updatedCustomer.id))
    .limit(1);

  if (!existingCustomers) {
    throw new Error(`Customer with ID ${updatedCustomer.id} not found.`);
  }
  //TODO better way to manage Date
  updatedCustomer.birthdate = new Date(
    formatDateToDateOnly(updatedCustomer.birthdate)
  );

  const existingCustomer = existingCustomers[0];
  console.log("in updateCustomer : existingCustomer", existingCustomer);
  console.log("in updateCustomer : updatedCustomer", updatedCustomer);
  // Fields to track
  const trackedFields = [
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
  const changes = trackChanges(
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

  console.log("in updateCustomer : insertedChanges");
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
    .where(eq(history.referenceId, updatedCustomer.id))
    .orderBy(desc(history.timestamp));

  return {
    customer: { ...existingCustomer, ...updatedCustomer },
    history: updatedHistory,
  };
}
