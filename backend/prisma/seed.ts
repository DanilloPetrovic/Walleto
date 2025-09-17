import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Kreiraj korisnika
  const passwordHash = await bcrypt.hash("password123", 10);
  const user = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      name: "Test User",
      password: passwordHash,
    },
  });

  // Definiši kategorije prihoda i rashoda
  const incomeCategoryNames = ["Salary", "Freelance", "Investments", "Gifts"];
  const expenseCategoryNames = [
    "Food",
    "Rent",
    "Transport",
    "Entertainment",
    "Utilities",
  ];

  // Kreiraj kategorije prihoda
  const incomeCategories = await Promise.all(
    incomeCategoryNames.map((name) =>
      prisma.incomeCategory.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );

  // Kreiraj kategorije rashoda
  const expenseCategories = await Promise.all(
    expenseCategoryNames.map((name) =>
      prisma.expenseCategory.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );

  // Dodaj primer prihoda
  await prisma.income.create({
    data: {
      userId: user.id,
      amount: 1200,
      currency: "EUR",
      categoryId: incomeCategories[0].id, // Salary
      description: "Monthly salary",
    },
  });

  // Dodaj primer rashoda
  await prisma.expense.create({
    data: {
      userId: user.id,
      amount: 300,
      currency: "EUR",
      categoryId: expenseCategories[1].id, // Rent
      description: "Monthly apartment rent",
    },
  });

  console.log("✅ Seed completed!");
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
