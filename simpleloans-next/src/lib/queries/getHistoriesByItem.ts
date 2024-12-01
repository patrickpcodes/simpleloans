import { db } from "@/db";
import { history } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function getHistoriesByItem(type: string, referenceId: number) {
  const histories = await db
    .select()
    .from(history)
    .where(and(eq(history.referenceId, referenceId), eq(history.type, type)))
    .orderBy(desc(history.timestamp));
  return histories;
}
