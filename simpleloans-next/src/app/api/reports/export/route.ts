import { NextResponse } from "next/server";
import { db } from "@/db"; // Adjust this path to your Drizzle setup
import { customers, history, loans, payments } from "@/db/schema"; // Adjust this path to your schema
import JSZip from "jszip";
import { Customer } from "@/types/Customer";

export async function GET() {
  try {
    function generateCsv<T extends object>(data: T[]): string {
      // Generate CSV headers and rows
      const headers = Object.keys(data[0] || {}).join(",") + "\n";
      const rows = data.map((row) => Object.values(row).join(",")).join("\n");
      const csv = headers + rows;
      return csv;
    }
    // Fetch data from the `customers` table
    const customerCsv = generateCsv(
      (await db.select().from(customers)) as Customer[]
    );
    const loanCsv = generateCsv(await db.select().from(loans));
    const paymentsCsv = generateCsv(await db.select().from(payments));
    const historyCsv = generateCsv(await db.select().from(history));

    const zip = new JSZip();
    zip.file("customers.csv", customerCsv);
    zip.file("loans.csv", loanCsv);
    zip.file("payments.csv", paymentsCsv);
    zip.file("history.csv", historyCsv);
    // Return the CSV as a response
    const archive = await zip.generateAsync({ type: "blob" });

    return new NextResponse(archive, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
      },
    });
  } catch (error) {
    console.error("Error exporting customers:", error);
    return new NextResponse("Error generating CSV", { status: 500 });
  }
}
