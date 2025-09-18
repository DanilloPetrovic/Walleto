import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const incomeCategoryNames = ["Salary", "Freelance", "Investments", "Gifts"];
const expenseCategoryNames = [
  "Food",
  "Rent",
  "Transport",
  "Entertainment",
  "Utilities",
];

// Utility to get random number in range
const getRandomAmount = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Utility to pick a random element
const pickRandom = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

async function main() {
  // 1️⃣ Create categories
  const incomeCategories = await Promise.all(
    incomeCategoryNames.map((name) =>
      prisma.incomeCategory.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );

  const expenseCategories = await Promise.all(
    expenseCategoryNames.map((name) =>
      prisma.expenseCategory.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );

  // 2️⃣ Create multiple users
  const users = [];
  for (let i = 1; i <= 5; i++) {
    const passwordHash = await bcrypt.hash("password123", 10);
    const user = await prisma.user.upsert({
      where: { email: `user${i}@example.com` },
      update: {},
      create: {
        email: `user${i}@example.com`,
        name: `User ${i}`,
        password: passwordHash,
      },
    });
    users.push(user);
  }

  // 3️⃣ Create random transactions for each user
  for (const user of users) {
    // Create 5 random incomes
    for (let j = 0; j < 5; j++) {
      await prisma.income.create({
        data: {
          userId: user.id,
          amount: getRandomAmount(100, 2000),
          currency: "EUR",
          categoryId: pickRandom(incomeCategories).id,
          description: "Random income",
        },
      });
    }

    // Create 5 random expenses
    for (let j = 0; j < 5; j++) {
      await prisma.expense.create({
        data: {
          userId: user.id,
          amount: getRandomAmount(20, 500),
          currency: "EUR",
          categoryId: pickRandom(expenseCategories).id,
          description: "Random expense",
        },
      });
    }
  }

  console.log("✅ Seed completed with multiple users and random transactions!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
