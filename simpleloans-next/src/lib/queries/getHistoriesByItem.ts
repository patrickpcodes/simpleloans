import { db } from "@/db";
import { history } from "@/db/schema";
import { Changes } from "@/zod-schemas/changes";
// import { selectHistorySchemaType } from "@/zod-schemas/history";
import { eq, and, desc } from "drizzle-orm";

export async function getHistoriesByItem(type: string, referenceId: number) {
  const rawHistories = await db
    .select()
    .from(history)
    .where(and(eq(history.referenceId, referenceId), eq(history.type, type)))
    .orderBy(desc(history.timestamp));

  // Map raw histories to properly typed histories
  const histories = rawHistories.map((raw) => ({
    ...raw,
    changes: JSON.parse(raw.changes as string) as Changes, // Explicitly cast and parse changes
  }));
  return histories;
}
