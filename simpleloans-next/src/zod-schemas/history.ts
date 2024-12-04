import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { history } from "@/db/schema";
import { ChangesSchema } from "@/zod-schemas/changes";

export const insertHistorySchema = createInsertSchema(history, {});

export const selectHistorySchema = createSelectSchema(history, {
  changes: (schema) =>
    schema.changes.transform((data) => ChangesSchema.parse(data)),
});

export type insertHistorySchemaType = typeof insertHistorySchema._type;

export type selectHistorySchemaType = typeof selectHistorySchema._type;
