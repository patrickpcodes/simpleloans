import { db } from "@/db";
import { customers, history } from "@/db/schema";
import { selectCustomerSchemaType } from "@/zod-schemas/customer";
import { desc, eq } from "drizzle-orm";
import { formatDateToDateOnly } from "@/utils/formatDateToDateOnly";
import { Change } from "@/zod-schemas/changes";

function trackChanges<
  T extends Record<string, string | number | boolean | Date | null>
>(existing: T, updated: T, fields: (keyof T)[]): Change[] {
  return fields.reduce<Change[]>((changes, field) => {
    console.log("in trackChanges : field", field);
    console.log("in trackChanges : existing[field]", existing[field]);
    console.log("in trackChanges : updated[field]", updated[field]);

    const existingValue = existing[field]?.toString() ?? null;
    const updatedValue = updated[field]?.toString() ?? null;

    if (existingValue !== updatedValue) {
      changes.push({
        field: field as string,
        oldValue: existingValue,
        newValue: updatedValue,
      });
    }
    return changes;
  }, []);
}

type Customer = selectCustomerSchemaType;

export async function updateCustomer(
  updatedCustomer: Customer
  // userEmail: string,
  // displayName: string
) {
  const existingCustomers = await db
    .select()
    .from(customers)
    .where(eq(customers.id, updatedCustomer.id))
    .limit(1);

  if (!existingCustomers) {
    throw new Error(`Customer with ID ${updatedCustomer.id} not found.`);
  }
  updatedCustomer.birthdate = new Date(updatedCustomer.birthdate);
  //TODO better way to manage Date
  console.log(
    "in updateCustomer : updatedCustomer.birthdate",
    updatedCustomer.birthdate
  );
  console.log("type of date", typeof updatedCustomer.birthdate);

  const formattedDate = formatDateToDateOnly(updatedCustomer.birthdate);
  console.log("type of formattedDate", typeof formattedDate);
  console.log("in updateCustomer : formattedDate", formattedDate);

  updatedCustomer.birthdate = new Date(
    formatDateToDateOnly(updatedCustomer.birthdate)
  );

  const existingCustomer: Customer = existingCustomers[0];
  console.log(
    "in updateCustomer : type of existingCustomer",
    typeof existingCustomer
  );
  console.log("in updateCustomer : existingCustomer", existingCustomer);
  console.log(
    "in updateCustomer: type of updatedCustomer",
    typeof updatedCustomer
  );
  console.log("in updateCustomer : updatedCustomer", updatedCustomer);
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
    userEmail: "p@p.com",
    displayName: "Patrick P",
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
    .where(eq(history.referenceId, updatedCustomer.id))
    .orderBy(desc(history.timestamp));

  return {
    customer: { ...existingCustomer, ...updatedCustomer },
    history: updatedHistory,
  };
}
