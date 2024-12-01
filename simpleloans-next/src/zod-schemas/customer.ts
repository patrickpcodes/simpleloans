import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { customers } from "@/db/schema";

export const insertCustomerSchema = createInsertSchema(customers, {
  name: (schema) => schema.name.min(1, "Name is required"),
  email: (schema) => schema.email.email("Invalid email address"),
  phone: (schema) =>
    schema.phone.min(7, "Phone number must be at least 7 characters"),
});

export const selectCustomerSchema = createSelectSchema(customers);

export type insertCustomerSchemaType = typeof insertCustomerSchema._type;

export type selectCustomerSchemaType = typeof selectCustomerSchema._type;
