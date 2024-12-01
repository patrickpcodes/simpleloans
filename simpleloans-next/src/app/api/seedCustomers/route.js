import { faker } from "@faker-js/faker";
import { db } from "@/db"; // Adjust based on your project structure
import { customers } from "@/db/schema";

export async function POST() {
  try {
    const randomCustomers = [];

    // Generate 5 random customers
    for (let i = 0; i < 5; i++) {
      randomCustomers.push({
        name: faker.name.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number("+1-###-###-####"),
        birthdate: faker.date.past(30, new Date(2000, 0, 1)), // Random birthdate in the past 30 years
        notes: faker.lorem.sentence(),
        canSendSpecialEmails: faker.datatype.boolean(),
        active: true, // Default value
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Insert the customers into the database
    await db.insert(customers).values(randomCustomers);

    return new Response(
      JSON.stringify({ message: "5 random customers added successfully!" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error seeding customers:", error);
    return new Response(
      JSON.stringify({ error: "Failed to seed customers." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
