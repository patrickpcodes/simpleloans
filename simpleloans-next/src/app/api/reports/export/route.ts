import { NextResponse } from "next/server";
import { db } from "@/db"; // Adjust this path to your Drizzle setup
import { customers, history, loans, payments } from "@/db/schema"; // Adjust this path to your schema
import JSZip from "jszip";
import { Customer } from "@/types/Customer";

export async function GET() {
  try {
    function generateCsv<T extends object>(data: T[]): string {
      if (data.length === 0) {
        return ""; // Handle empty data gracefully
      }

      // Generate CSV headers
      const headers = Object.keys(data[0]).join(",") + "\n";

      // Generate CSV rows
      const rows = data
        .map((row) => {
          return Object.values(row)
            .map((value) => {
              if (typeof value === "object" && value !== null) {
                // Stringify objects or arrays
                return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
              }
              // Escape values with commas or quotes
              return typeof value === "string"
                ? `"${value.replace(/"/g, '""')}"`
                : value;
            })
            .join(",");
        })
        .join("\n");

      return headers + rows;
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
