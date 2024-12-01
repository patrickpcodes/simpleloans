import {
  pgTable,
  serial,
  varchar,
  boolean,
  timestamp,
  integer,
  text,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { number } from "zod";

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: varchar("name").unique().notNull(),
  email: varchar("email").unique().notNull(),
  phone: varchar("phone").unique().notNull(),
  birthdate: timestamp("birthdate").notNull(),
  references: text("references"),
  notes: text("notes"),
  canSendSpecialEmails: boolean("can_send_special_emails")
    .notNull()
    .default(false),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const loans = pgTable("loans", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id")
    .references(() => customers.id)
    .notNull(),
  numberOfPayments: integer("number_of_payments").notNull(),
  paymentFrequency: varchar("payment_frequency").notNull(),
  initialBorrowedAmount: integer("initial_borrowed_amount").notNull(),
  initialDueAmount: integer("initial_due_amount").notNull(),
  firstPaymentDate: timestamp("first_payment_date").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
