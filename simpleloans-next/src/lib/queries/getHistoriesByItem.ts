import { db } from "@/db";
import { history } from "@/db/schema";
// import { selectHistorySchemaType } from "@/zod-schemas/history";
import { eq, and, desc } from "drizzle-orm";
import { selectHistorySchema } from "@/zod-schemas/history";

export async function getHistoriesByItem(type: string, referenceId: number) {
  const rawHistories = await db
    .select()
    .from(history)
    .where(and(eq(history.referenceId, referenceId), eq(history.type, type)))
    .orderBy(desc(history.timestamp));

  // Validate and transform the raw histories
  const validatedHistories = rawHistories.map((raw) =>
    selectHistorySchema.parse(raw)
  );

  return validatedHistories;
}
