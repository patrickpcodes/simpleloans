import { Button } from "@/components/ui/button";
import { UpcomingPayment } from "@/types/UpcomingPayment";
import { formatStringToDollar } from "@/utils/formatStringToDollar";
import { CheckCircle, Mail, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { PaymentModal } from "./PaymentModal";
import { PaymentPayTodayValues } from "@/app/(rs)/payments/form/PaymentForm";
import {
  formatDateToDateOnly,
  // formatDateStringToMonthDayYear,
  formatDateToYYYYMMDD,
} from "@/utils/formatDateToDateOnly";
import { generateEmailText, sendEmail } from "@/utils/emails";
import { useRouter } from "next/navigation";
import { EmailModal } from "./EmailModal";
import { cn } from "@/lib/utils";
import { groupPayments } from "@/utils/payments";
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

  // Group payments by their due status
  const groupedPayments = groupPayments(upcomingPayments);

  const PaymentSection = ({
    title,
    payments,
    variant = "default",
  }: {
    title: string;
    payments: typeof upcomingPayments;
    variant?: "default" | "destructive" | "warning";
  }) => {
    if (payments.length === 0) return null;

    return (
      <div className="mb-8">
        <h3
          className={cn(
            "text-lg font-semibold mb-4",
            variant === "destructive" && "text-destructive",
            variant === "warning" && "text-orange-500"
          )}
        >
          {title} ({payments.length})
        </h3>
        <div className="space-y-4">
          {payments.map((upcomingPayment) => (
            <div
              key={upcomingPayment.payment.id}
              className={cn(
                "items-center justify-between p-4 rounded-lg grid grid-cols-12 gap-4",
                variant === "destructive" && "bg-destructive/10",
                variant === "warning" && "bg-orange-100",
                variant === "default" && "bg-muted"
              )}
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
                    const now = new Date();
                    setEmailDetails({
                      toEmail: upcomingPayment.customerEmail || "",
                      subject: `Reminder for Upcoming Payment : ${formatDateToDateOnly(
                        now
                      )}`,
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
                    router.push(
                      `/loans/form?loanId=${upcomingPayment.loan.id}`
                    );
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
  };
  return (
    <div>
      {isModalOpen && activeUpcomingPayment && (
        <PaymentModal
          payment={activeUpcomingPayment.payment}
          paymentPayTodayValues={paymentPayTodayValues}
          isOpen={isModalOpen}
          onClose={async () => {
            setIsModalOpen(false);
            setActiveUpcomingPayment(null);
            setPaymentPayTodayValues(undefined);
            // Wait for state updates to complete
            await new Promise((resolve) => setTimeout(resolve, 100));
            // Force a hard refresh of the page
            window.location.href = "/home";
          }}
        />
      )}
      {isEmailModalOpen && activeUpcomingPayment && (
        <EmailModal
          isOpen={isEmailModalOpen}
          onClose={async () => {
            setIsEmailModalOpen(false);
            setActiveUpcomingPayment(null);
            // Wait for state updates to complete
            await new Promise((resolve) => setTimeout(resolve, 100));
            // Force a hard refresh of the page
            window.location.href = "/home";
          }}
          defaultToEmail={emailDetails.toEmail}
          defaultSubject={emailDetails.subject}
          defaultBody={emailDetails.body}
          onSend={(email) => {
            sendEmail(email, activeUpcomingPayment.loan.id ?? 0);
          }}
        />
      )}

      {/* Sections */}
      <PaymentSection
        title="Past Due"
        payments={groupedPayments.pastDue}
        variant="destructive"
      />
      <PaymentSection
        title="Due Today"
        payments={groupedPayments.today}
        variant="warning"
      />
      <PaymentSection
        title="Due Tomorrow"
        payments={groupedPayments.tomorrow}
      />
      <PaymentSection
        title="Future Payments"
        payments={groupedPayments.future}
      />
    </div>
  );
}
