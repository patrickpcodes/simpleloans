import { customers } from "@/db/schema"; // Import your Drizzle ORM schema
import { UpdateIcon } from "@radix-ui/react-icons";
import { create } from "domain";
import type { InferSelectModel } from "drizzle-orm";
import { z } from "zod";

// Infer the type from the schema
type Customer = InferSelectModel<typeof customers>;

// Define the Zod schema for form validation
export const customerFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(7, "Phone number must be at least 7 digits")
    .regex(/^[\d()+-]+$/, "Phone number can only contain digits, parentheses, hyphens, and plus signs"),
  birthdate: z.string().nonempty("Birthdate is required"), // Expecting YYYY-MM-DD format
  notes: z.string().optional(),
  canSendSpecialEmails: z.boolean().default(false),
  active: z.boolean().default(true),
});

// Infer the form values type from the Zod schema
export type CustomerFormValues = z.infer<typeof customerFormSchema>;

// Utility: Convert form values to the database-compatible Customer type
export function convertFormValuesToCustomer(
  formValues: CustomerFormValues,
  customerId: number
): Omit<Customer, "createdAt" | "updatedAt"> {
  return {
    id: customerId, // Use existing ID or generate a new one
    name: formValues.name,
    email: formValues.email,
    phone: formValues.phone,
    birthdate: new Date(formValues.birthdate), // Convert string to Date
    notes: formValues.notes || null, // Ensure optional fields are nullable
    canSendSpecialEmails: formValues.canSendSpecialEmails,
    active: formValues.active,
  };
}

// Utility: Convert a database object to form values
export function convertCustomerToFormValues(
  customer: Customer
): CustomerFormValues {
  return {
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    birthdate: customer.birthdate.toISOString().split("T")[0], // Convert Date to YYYY-MM-DD
    notes: customer.notes || "",
    canSendSpecialEmails: customer.canSendSpecialEmails,
    active: customer.active,
  };
}
