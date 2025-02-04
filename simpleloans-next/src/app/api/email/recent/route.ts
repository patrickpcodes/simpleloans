import { db } from "@/db";
import { emails } from "@/db/schema";
import { and, gte, sql } from "drizzle-orm";

export async function GET() {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 27);

    const recentEmails = await db
      .select({
        id: emails.id,
        loanId: emails.loanId,
        subject: emails.subject,
        to: emails.to,
        cc: emails.cc,
        bcc: emails.bcc,
        sent: emails.sent,
        createdAt: emails.createdAt,
      })
      .from(emails)
      .where(
        and(gte(emails.createdAt, sql`DATE(${sevenDaysAgo.toISOString()})`))
      )
      .orderBy(sql`${emails.createdAt} DESC`);

    return Response.json(recentEmails);
  } catch (error) {
    console.error("Error fetching recent emails:", error);
    return Response.json({ error: "Failed to fetch emails" }, { status: 500 });
  }
}
