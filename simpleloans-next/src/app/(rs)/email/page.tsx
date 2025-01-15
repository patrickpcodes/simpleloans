"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateToDateOnly } from "@/utils/formatDateToDateOnly";

interface RecentEmail {
  id: number;
  loanId: number;
  subject: string;
  to: string;
  sent: boolean;
  createdAt: Date;
}

export default function Email() {
  const [recentEmails, setRecentEmails] = useState<RecentEmail[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecentEmails();
  }, []);

  const fetchRecentEmails = async () => {
    try {
      const response = await fetch("/api/email/recent");
      if (!response.ok) throw new Error("Failed to fetch emails");
      const data = await response.json();
      setRecentEmails(data);
    } catch (error) {
      console.error("Error fetching recent emails:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Email History</h2>
        <Button onClick={fetchRecentEmails} disabled={isLoading}>
          Refresh
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date Sent</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Loan ID</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentEmails.map((email) => (
              <TableRow key={email.id}>
                <TableCell>{formatDateToDateOnly(email.createdAt)}</TableCell>
                <TableCell>{email.to}</TableCell>
                <TableCell>{email.subject}</TableCell>
                <TableCell>{email.loanId}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      email.sent
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {email.sent ? "Sent" : "Failed"}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
