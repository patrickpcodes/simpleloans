import { Button } from "@/components/ui/button";
import { UpcomingPayment } from "@/types/UpcomingPayment";
import { formatStringToDollar } from "@/utils/formatStringToDollar";
import { CheckCircle, Mail, MoreHorizontal } from "lucide-react";
import { formatNumberToDollar } from "@/utils/formatStringToDollar";
import { useState } from "react";
import { PaymentModal } from "./PaymentModal";
import { PaymentPayTodayValues } from "@/app/(rs)/payments/form/PaymentForm";
import {
  // formatDateStringToMonthDayYear,
  formatDateToYYYYMMDD,
} from "@/utils/formatDateToDateOnly";
import { Email } from "@/types/Email";
import { generateEmailText } from "@/utils/emails";
import { useRouter } from "next/navigation";
import { EmailModal } from "./EmailModal";

type Props = {
  upcomingPayments: UpcomingPayment[];
};

export function PaymentActionTable({ upcomingPayments }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeUpcomingPayment, setActiveUpcomingPayment] = useState<
    (typeof upcomingPayments)[0] | null
  >(null);

  const [paymentPayTodayValues, setPaymentPayTodayValues] = useState<
    PaymentPayTodayValues | undefined
  >(undefined);
  const router = useRouter();
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailDetails, setEmailDetails] = useState<{
    toEmail: string;
    subject: string;
    body: string;
  }>({ toEmail: "", subject: "", body: "" });
  async function sendEmail(email: Email, loanId: number) {
    const response = await fetch("/api/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, loanId }),
    });
    return response.json();
  }

  console.log("format", formatNumberToDollar(1000));
  return (
    <div>
      {isModalOpen && activeUpcomingPayment && (
        <PaymentModal
          payment={activeUpcomingPayment.payment}
          paymentPayTodayValues={paymentPayTodayValues}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setActiveUpcomingPayment(null);
            setPaymentPayTodayValues(undefined);
          }}
        />
      )}
      {isEmailModalOpen && activeUpcomingPayment && (
        <EmailModal
          isOpen={isEmailModalOpen}
          onClose={() => {
            setIsEmailModalOpen(false);
            setActiveUpcomingPayment(null);
          }}
          defaultToEmail={emailDetails.toEmail}
          defaultSubject={emailDetails.subject}
          defaultBody={emailDetails.body}
          onSend={(email) => {
            sendEmail(email, activeUpcomingPayment.loan.id ?? 0);
          }}
        />
      )}
      {/* <div className="flex">
        Button Legend :
        <Button size="sm" variant="outline">
          <CheckCircle className="h-4 w-4" />
          Paid In Full
        </Button>
        <Button size="sm" variant="outline">
          <MoreHorizontal className="h-4 w-4" />
          Manually Confirm
        </Button>
        <Button size="sm" variant="secondary">
          <Mail className="h-4 w-4" />
          Send Reminder
        </Button>
      </div> */}
      <div className="space-y-4 ">
        {upcomingPayments.map((upcomingPayment) => (
          <div
            key={upcomingPayment.payment.id}
            className=" items-center justify-between p-4 bg-muted rounded-lg grid grid-cols-12 gap-4"
          >
            <div className="col-span-3">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-lg">
                  {upcomingPayment.customerName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h3 className="font-semibold">
                    {upcomingPayment.customerName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {upcomingPayment.payment.paymentMethod}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-span-2 text-left">
              <p className="font-semibold">
                {formatStringToDollar(upcomingPayment.payment.amountDue)}
              </p>
              <p className="text-sm text-muted-foreground">
                Due: {upcomingPayment.payment.dueDate}
              </p>
            </div>
            {/* <div className="text-right">
            <p className="text-sm">
              Total Loan Amount:{" "}
              {formatStringToDollar(upcomingPayment.loan.initialDueAmount)}
            </p>
            <p className="text-sm text-muted-foreground">
              Finishes: {upcomingPayment.payment.updatedAt?.toDateString()}
            </p>
          </div> */}
            <div className="col-span-2 text-left">
              <p className="text-sm text-muted-foreground">Last Reminder:</p>
              <p className="text-sm">{upcomingPayment.lastReminderSent}</p>
            </div>
            <div className="col-span-5 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  console.log("Accept payment", upcomingPayment.payment.id);
                  setActiveUpcomingPayment(upcomingPayment);
                  setPaymentPayTodayValues({
                    amountPaid: upcomingPayment.payment.amountDue,
                    paymentDate: formatDateToYYYYMMDD(new Date()),
                  });
                  setIsModalOpen(true);
                }}
              >
                <CheckCircle className="h-4 w-4" />
                Payment Made
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  console.log("Confirm details", upcomingPayment.payment.id);
                  setActiveUpcomingPayment(upcomingPayment);
                  setIsModalOpen(true);
                }}
              >
                <MoreHorizontal className="h-4 w-4" />
                Update Details
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  const emailText = generateEmailText(
                    upcomingPayment.customerName,
                    upcomingPayment.payment.amountDue,
                    upcomingPayment.payment.dueDate
                  );

                  setEmailDetails({
                    toEmail: upcomingPayment.customerEmail || "",
                    subject: "Payment Reminder at SimpleLoans " + Date.now(),
                    body: emailText,
                  });
                  setActiveUpcomingPayment(upcomingPayment);
                  setIsEmailModalOpen(true);
                }}
              >
                <Mail className="h-4 w-4" />
                Send Reminder
              </Button>
              <Button
                size={"sm"}
                variant={"outline"}
                onClick={() => {
                  router.push(`/loans/form?loanId=${upcomingPayment.loan.id}`);
                }}
              >
                Go To Loan
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
