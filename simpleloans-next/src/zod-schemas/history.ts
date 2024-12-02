import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { history } from "@/db/schema";

export const insertHistorySchema = createInsertSchema(history, {});

export const selectHistorySchema = createSelectSchema(history, {
  changes: (schema) =>
    schema.changes.array().nonempty("Changes must not be empty"),
});

export type insertHistorySchemaType = typeof insertHistorySchema._type;

export type selectHistorySchemaType = typeof selectHistorySchema._type;
