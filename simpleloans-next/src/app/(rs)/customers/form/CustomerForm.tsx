"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  insertCustomerSchema,
  insertCustomerSchemaType,
} from "@/zod-schemas/customer";
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { DateInputWithLabel } from "@/components/inputs/DateInputWithLabel";
import { CheckboxWithLabel } from "@/components/inputs/CheckboxWithLabel";
import { TextAreaWithLabel } from "@/components/inputs/TextAreaWithLabel";
import { useRouter } from "next/navigation";
import { CustomerDetail } from "@/types/CustomerDetail";
import { LoanDetail } from "@/types/LoanDetail";
import { MultiLoanDisplay } from "@/components/loan/MultiLoanDisplay";

type Props = {
  customerDetail?: CustomerDetail;
};

export default function CustomerForm({ customerDetail }: Props) {
  const router = useRouter();
  const customer = customerDetail?.customer;

  const defaultValues: insertCustomerSchemaType = {
    id: customer?.id ?? 0,
    name: customer?.name ?? "",
    email: customer?.email ?? "",
    phone: customer?.phone ?? "",
    birthdate: customer?.birthdate ?? "",
    references: customer?.references ?? "",
    notes: customer?.notes ?? "",
    canSendSpecialEmails: customer?.canSendSpecialEmails ?? false,
    active: customer?.active ?? true,
  };
  const form = useForm<insertCustomerSchemaType>({
    mode: "onBlur",
    resolver: zodResolver(insertCustomerSchema),
    defaultValues,
  });

  async function submitForm(data: insertCustomerSchemaType) {
    let method = "";
    if (data.id) {
      method = "PUT";
    } else {
      method = "POST";
    }
    //TODO add TOAST for Errors
    console.log("about to submit form", data, method);
    console.log("data stringified", JSON.stringify(data));
    try {
      const response = await fetch("/api/customers", {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save customer");
      }

      const result = await response.json();
      console.log("This is my result from call");
      console.log(result);

      if (method == "PUT") {
        router.push(`/customers/form?customerId=${data.id}`);
      } else {
        router.push(`/customers/form?customerId=${result[0].id}`);
      }
      // setSuccess(`Customer created with ID: ${result.id}`);
    } catch (err) {
      console.error(err);
      // setError(err.message);
    } finally {
      console.log("finally");
      // setLoading(false);
    }
  }
  const loanDetails: LoanDetail[] | undefined =
    customerDetail?.loansWithPayments.map((loanWithPayments) => {
      return {
        loan: loanWithPayments.loan,
        payments: loanWithPayments.payments,
        customer: customerDetail?.customer,
      };
    });
  const handleRowClick = (id: number) => {
    router.push(`/loans/form?loanId=${id}`);
  };
  return (
    <div className="flex flex-col gap-1 sm:px-8">
      <div>
        <h2 className="text-2xl font-bold">
          {customer?.id ? "Edit" : "New"} Customer{" "}
          {customer?.id ? `#${customer.id} : ${customer.name}` : "Form"}
        </h2>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitForm)}
          className="space-y-8 max-w-3xl mx-auto py-10"
        >
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <InputWithLabel<insertCustomerSchemaType>
                fieldTitle="Name"
                nameInSchema="name"
              />
            </div>
            <div className="col-span-6">
              <InputWithLabel<insertCustomerSchemaType>
                fieldTitle="Phone"
                nameInSchema="phone"
              />
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <InputWithLabel<insertCustomerSchemaType>
                fieldTitle="Email"
                nameInSchema="email"
              />
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <DateInputWithLabel<insertCustomerSchemaType>
                fieldTitle="Birthdate"
                nameInSchema="birthdate"
                description="Your date of birth is used to calculate your age."
              />
            </div>
            <div className="col-span-6">
              <CheckboxWithLabel<insertCustomerSchemaType>
                fieldTitle="Send Birthday Reminders"
                nameInSchema="canSendSpecialEmails"
                message="When this is checked, this customer will recieve a happy
                        birthday email at 9am on their birthday."
              />
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <TextAreaWithLabel<insertCustomerSchemaType>
                fieldTitle="References"
                nameInSchema="references"
                className="min-h-[120px] resize-y"
              />
            </div>
            <div className="col-span-6">
              <TextAreaWithLabel<insertCustomerSchemaType>
                fieldTitle="Notes"
                nameInSchema="notes"
                className="min-h-[120px] resize-y"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="submit"
              className="w-3/4"
              variant="default"
              title="Save"
            >
              Save
            </Button>
            <Button
              type="button"
              variant="destructive"
              title="Reset"
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            {customer?.id && (
              <Button
                type="button"
                variant="secondary"
                title="New Loan"
                onClick={() =>
                  router.push(`/loans/form?customerId=${customer.id}`)
                }
              >
                Create New Loan
              </Button>
            )}
          </div>
        </form>
      </Form>
      {JSON.stringify(customer)}
      {customer?.id && loanDetails && loanDetails.length > 0 && (
        <MultiLoanDisplay
          loanDetails={loanDetails}
          onRowClick={handleRowClick}
        />
      )}
    </div>
  );
}
