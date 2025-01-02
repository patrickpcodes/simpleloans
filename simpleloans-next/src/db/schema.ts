import {
  pgTable,
  serial,
  varchar,
  boolean,
  timestamp,
  integer,
  text,
  pgEnum,
  decimal,
  jsonb,
} from "drizzle-orm/pg-core";
import { LOAN_PAYMENT_FREQUENCIES } from "@/types/LoanPaymentFrequency";
import { PAYMENT_STATUSES } from "@/types/PaymentStatus";
import { LOAN_STATUSES } from "@/types/LoanStatus";
import { PAYMENT_METHOD } from "@/types/PaymentMethod";

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: varchar("name").unique().notNull(),
  email: varchar("email").unique().notNull(),
  phone: varchar("phone").unique().notNull(),
  birthdate: varchar("birthdate").notNull(),
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

export const loanPaymentFrequencyEnum = pgEnum(
  "payment_frequency_enum",
  LOAN_PAYMENT_FREQUENCIES
);
export const loanStatusEnum = pgEnum("loan_status_enum", LOAN_STATUSES);

export const paymentMethodEnum = pgEnum("payment_method_enum", PAYMENT_METHOD);

export const loans = pgTable("loans", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id")
    .references(() => customers.id)
    .notNull(),
  numberOfPayments: integer("number_of_payments").notNull(),
  paymentFrequency: loanPaymentFrequencyEnum("payment_frequency").notNull(),
  initialBorrowedAmount: decimal("initial_borrowed_amount", {
    precision: 10,
    scale: 2,
  }).notNull(),
  initialDueAmount: decimal("initial_due_amount", {
    precision: 10,
    scale: 2,
  }).notNull(),
  loanStatus: loanStatusEnum("loan_status").notNull(),
  defaultPaymentMethod: paymentMethodEnum("default_payment_method").notNull(),
  firstPaymentDate: varchar("first_payment_date").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const paymentStatusesEnum = pgEnum(
  "payment_statuses_enum",
  PAYMENT_STATUSES
);

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  loanId: integer("loan_id")
    .references(() => loans.id)
    .notNull(),
  amountDue: decimal("amount_due", { precision: 10, scale: 2 }).notNull(),
  amountPaid: decimal("amount_paid", {
    precision: 10,
    scale: 2,
  }).notNull(),
  feeAmount: decimal("fee_amount", { precision: 10, scale: 2 }).notNull(),
  paymentStatus: paymentStatusesEnum("payment_status").notNull(),
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  dueDate: varchar("due_date").notNull(),
  paymentDate: varchar("payment_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const emails = pgTable("emails", {
  id: serial("id").primaryKey(),
  loanId: integer("loan_id").references(() => loans.id),
  subject: varchar("subject").notNull(),
  emailText: text("email_text").notNull(),
  emailHtml: text("email_html"),
  to: text("to").notNull(),
  cc: text("cc"),
  bcc: text("bcc"),
  sent: boolean("sent").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const history = pgTable("history", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  referenceId: integer("reference_id").notNull(),
  changes: jsonb("changes").notNull(),
  userEmail: varchar("user_email").notNull(),
  displayName: varchar("display_name").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});
