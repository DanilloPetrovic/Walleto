import prisma from "../utils/prisma";
import createHttpError from "http-errors";

export const createTransaction = async (data: {
  userId: number;
  amount: number;
  currency: string;
  transactionType: "income" | "expense";
  categoryId: number;
  description?: string;
}) => {
  const { userId, amount, currency, transactionType, categoryId, description } =
    data;

  if (transactionType !== "income" && transactionType !== "expense") {
    throw createHttpError(
      400,
      "Invalid transaction type. Must be 'income' or 'expense'"
    );
  }

  try {
    if (transactionType === "income") {
      const category = await prisma.incomeCategory.findUnique({
        where: { id: categoryId },
      });

      if (!category) throw createHttpError(404, "Income category not found");
      return await prisma.income.create({
        data: {
          userId,
          amount,
          currency,
          categoryId,
          description: description || "",
        },
      });
    } else {
      const category = await prisma.expenseCategory.findUnique({
        where: { id: categoryId },
      });

      if (!category) throw createHttpError(404, "Expense category not found");

      return await prisma.expense.create({
        data: {
          userId,
          amount,
          currency,
          categoryId,
          description: description || "",
        },
      });
    }
  } catch (error) {
    throw createHttpError(500, "Error creating transaction");
  }
};

export const editTransaction = async (
  id: number,
  data: {
    userId: number;
    amount?: number;
    currency?: string;
    transactionType: "income" | "expense";
    categoryId?: number;
    description?: string;
  }
) => {
  const { userId, amount, currency, transactionType, categoryId, description } =
    data;

  if (transactionType !== "income" && transactionType !== "expense") {
    throw createHttpError(
      400,
      "Invalid transaction type. Must be 'income' or 'expense'"
    );
  }

  try {
    if (transactionType === "income") {
      const existing = await prisma.income.findUnique({
        where: { id },
      });
      if (!existing || existing.userId !== userId) {
        throw createHttpError(404, "Income transaction not found");
      }

      if (categoryId) {
        const category = await prisma.incomeCategory.findUnique({
          where: { id: categoryId },
        });
        if (!category) throw createHttpError(404, "Income category not found");
      }

      return await prisma.income.update({
        where: { id },
        data: { amount, currency, categoryId, description },
      });
    } else {
      const existing = await prisma.expense.findUnique({
        where: { id },
      });
      if (!existing || existing.userId !== userId) {
        throw createHttpError(404, "Expense transaction not found");
      }

      if (categoryId) {
        const category = await prisma.expenseCategory.findUnique({
          where: { id: categoryId },
        });
        if (!category) throw createHttpError(404, "Expense category not found");
      }

      return await prisma.expense.update({
        where: { id },
        data: { amount, currency, categoryId, description },
      });
    }
  } catch (error) {
    throw createHttpError(500, "Error updating transaction");
  }
};

export const deleteTransaction = async (
  id: number,
  userId: number,
  transactionType: "income" | "expense"
) => {
  if (transactionType !== "income" && transactionType !== "expense") {
    throw createHttpError(
      400,
      "Invalid transaction type. Must be 'income' or 'expense'"
    );
  }

  try {
    if (transactionType === "income") {
      const existing = await prisma.income.findUnique({ where: { id } });
      if (!existing || existing.userId !== userId) {
        throw createHttpError(404, "Income transaction not found");
      }

      await prisma.income.delete({ where: { id } });
      return { message: "Income transaction deleted successfully" };
    } else {
      const existing = await prisma.expense.findUnique({ where: { id } });
      if (!existing || existing.userId !== userId) {
        throw createHttpError(404, "Expense transaction not found");
      }

      await prisma.expense.delete({ where: { id } });
      return { message: "Expense transaction deleted successfully" };
    }
  } catch (error) {
    throw createHttpError(500, "Error deleting transaction");
  }
};

export const getAllTransactions = async (userId: number) => {
  try {
    const [incomes, expenses] = await Promise.all([
      prisma.income.findMany({
        where: { userId },
        include: { category: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.expense.findMany({
        where: { userId },
        include: { category: true },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const normalizedIncomes = incomes.map((inc) => ({
      id: inc.id,
      amount: inc.amount,
      currency: inc.currency,
      description: inc.description,
      date: inc.createdAt,
      category: inc.category.name,
      transactionType: "income" as const,
    }));

    const normalizedExpenses = expenses.map((exp) => ({
      id: exp.id,
      amount: exp.amount,
      currency: exp.currency,
      description: exp.description,
      date: exp.createdAt,
      category: exp.category.name,
      transactionType: "expense" as const,
    }));

    return [...normalizedIncomes, ...normalizedExpenses].sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );
  } catch (error) {
    throw createHttpError(500, "Error fetching transactions");
  }
};
