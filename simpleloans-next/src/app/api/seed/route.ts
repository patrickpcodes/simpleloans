import { faker } from "@faker-js/faker"; // Ensure faker is imported
import { db } from "@/db";
import { loans, customers, payments, history } from "@/db/schema";
import { LOAN_PAYMENT_FREQUENCIES } from "@/types/LoanPaymentFrequency";
import { generatePayments } from "@/lib/queries/generatePayments";
import { formatDateToDateOnly } from "@/utils/formatDateToDateOnly";
import { LOAN_STATUSES } from "@/types/LoanStatus";
import { PAYMENT_METHOD } from "@/types/PaymentMethod";

export async function POST() {
  try {
    const numToCreate = 4; // Number of customers to create
    const customerIds = []; // Store created customer IDs

    // Generate and insert customers one at a time
    for (let i = 0; i < numToCreate; i++) {
      const newCustomer = await db
        .insert(customers)
        .values({
          name: faker.name.fullName() + "-PATRICKTEST",
          email: faker.internet.email(),
          phone: faker.phone.number(),
          birthdate: formatDateToDateOnly(faker.date.past({ years: 40 })), // Random birthdate in the past 30 years
          references: faker.lorem.paragraph(),
          notes: faker.lorem.sentence(),
          canSendSpecialEmails: faker.datatype.boolean(),
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning({ id: customers.id }); // Get the ID of the created customer

      customerIds.push(newCustomer[0].id); // Store the customer ID for loans
    }
    // For each customer, generate 0-3 loans
    for (const customerId of customerIds) {
      const numLoans = faker.number.int({ min: 1, max: 1 }); // Random number of loans

      for (let i = 0; i < numLoans; i++) {
        // Generate the initial borrowed amount
        const initialBorrowedAmount = faker.number.int({
          min: 500,
          max: 1000,
        });

        // Ensure the due amount is always greater than the borrowed amount
        const initialDueAmount =
          initialBorrowedAmount + faker.number.int({ min: 1000, max: 3000 });

        // const loanToCreate: Loan = {
        //   customerId,
        //   numberOfPayments: faker.number.int({ min: 6, max: 36 }),
        //   paymentFrequency: faker.helpers.arrayElement(
        //     LOAN_PAYMENT_FREQUENCIES
        //   ),
        //   initialBorrowedAmount: initialBorrowedAmount.toString(),
        //   initialDueAmount: initialDueAmount.toString(),
        //   firstPaymentDate: faker.date.future(),
        //   notes: faker.lorem.sentence(),
        //   createdAt: new Date(),
        //   updatedAt: new Date(),
        // };
        // Insert loan and get the ID
        const newLoan = await db
          .insert(loans)
          .values({
            customerId: customerId,
            numberOfPayments: faker.number.int({ min: 4, max: 12 }),
            paymentFrequency: LOAN_PAYMENT_FREQUENCIES[0],
            initialBorrowedAmount: initialBorrowedAmount.toString(),
            initialDueAmount: initialDueAmount.toString(),
            // Random date in the next 30 days
            loanStatus: LOAN_STATUSES[0],
            defaultPaymentMethod: PAYMENT_METHOD[0],
            firstPaymentDate: formatDateToDateOnly(
              faker.date.between({
                from: Date.now(),
                to: Date.now() + 1000 * 60 * 60 * 24 * 30,
              })
            ),
            notes: faker.lorem.sentence(),
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning();
        console.log("newLoan", newLoan);
        // loanToCreate.id = newLoan; // Store the loan ID for payments

        const paymentList = generatePayments(newLoan[0]); // Generate payments for the loan
        console.log("paymentList", paymentList);
        await db.insert(payments).values(paymentList); // Insert payments in bulk
      }

      // if (loansToCreate.length > 0) {
      //   await db.insert(loans).values(loansToCreate); // Insert loans in bulk
      // }
    }

    return new Response(
      JSON.stringify({
        message: `${numToCreate} random customers and their loans added successfully!`,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error seeding customers and loans:", error);
    return new Response(
      JSON.stringify({ error: "Failed to seed customers and loans." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
export async function DELETE() {
  try {
    await db.delete(history).execute();
    // Delete all payments first to avoid foreign key constraint issues
    await db.delete(payments).execute();
    // Delete all loans first to avoid foreign key constraint issues
    await db.delete(loans).execute();

    // Delete all customers
    await db.delete(customers).execute();

    return new Response(
      JSON.stringify({
        message: "All loans and customers deleted successfully!",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error deleting loans and customers:", error);
    return new Response(
      JSON.stringify({ error: "Failed to delete loans and customers." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
