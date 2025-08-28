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

  // Kreiraj kategorije prihoda
  const incomeCategories = await Promise.all([
    prisma.incomeCategory.upsert({
      where: { name: "Salary" },
      update: {},
      create: { name: "Salary" },
    }),
    prisma.incomeCategory.upsert({
      where: { name: "Freelance" },
      update: {},
      create: { name: "Freelance" },
    }),
  ]);

  // Kreiraj kategorije rashoda
  const expenseCategories = await Promise.all([
    prisma.expenseCategory.upsert({
      where: { name: "Food" },
      update: {},
      create: { name: "Food" },
    }),
    prisma.expenseCategory.upsert({
      where: { name: "Rent" },
      update: {},
      create: { name: "Rent" },
    }),
    prisma.expenseCategory.upsert({
      where: { name: "Transport" },
      update: {},
      create: { name: "Transport" },
    }),
  ]);

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
