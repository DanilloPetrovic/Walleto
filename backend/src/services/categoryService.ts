import prisma from "../utils/prisma";
import createHttpError from "http-errors";

export const createCategory = async (data: { name: string; for: string }) => {
  const { name, for: type } = data;

  if (!name || !type) {
    throw createHttpError(400, "Name and for fields are required");
  }

  if (type !== "income" && type !== "expense") {
    throw createHttpError(
      400,
      "Invalid category type. Must be 'income' or 'expense'"
    );
  }

  try {
    if (type === "income") {
      const existing = await prisma.incomeCategory.findUnique({
        where: { name },
      });
      if (existing)
        throw createHttpError(409, "Income category already exists");

      return await prisma.incomeCategory.create({
        data: { name },
      });
    } else {
      const existing = await prisma.expenseCategory.findUnique({
        where: { name },
      });
      if (existing)
        throw createHttpError(409, "Expense category already exists");

      return await prisma.expenseCategory.create({
        data: { name },
      });
    }
  } catch (error) {
    throw createHttpError(500, "Error creating category");
  }
};

export const deleteCategory = async (data: { id: number; for: string }) => {
  const { id, for: type } = data;

  if (!id || !type) {
    throw createHttpError(400, "Id and for fields are required");
  }

  if (type !== "income" && type !== "expense") {
    throw createHttpError(
      400,
      "Invalid category type. Must be 'income' or 'expense'"
    );
  }

  try {
    if (type === "income") {
      const existing = await prisma.incomeCategory.findUnique({
        where: { id },
      });
      if (!existing) throw createHttpError(404, "Income category not found");

      return await prisma.incomeCategory.delete({
        where: { id },
      });
    } else {
      const existing = await prisma.expenseCategory.findUnique({
        where: { id },
      });
      if (!existing) throw createHttpError(404, "Expense category not found");

      return await prisma.expenseCategory.delete({
        where: { id },
      });
    }
  } catch (error) {
    throw createHttpError(500, "Error deleting category");
  }
};

export const editCategory = async (data: {
  id: number;
  name: string;
  for: string;
}) => {
  const { id, name, for: type } = data;

  if (!id || !name || !type) {
    throw createHttpError(400, "Id, name and for fields are required");
  }

  if (type !== "income" && type !== "expense") {
    throw createHttpError(
      400,
      "Invalid category type. Must be 'income' or 'expense'"
    );
  }

  try {
    if (type === "income") {
      const existing = await prisma.incomeCategory.findUnique({
        where: { id },
      });
      if (!existing) throw createHttpError(404, "Income category not found");

      const duplicate = await prisma.incomeCategory.findUnique({
        where: { name },
      });
      if (duplicate && duplicate.id !== id) {
        throw createHttpError(
          409,
          "Income category with that name already exists"
        );
      }

      return await prisma.incomeCategory.update({
        where: { id },
        data: { name },
      });
    } else {
      const existing = await prisma.expenseCategory.findUnique({
        where: { id },
      });
      if (!existing) throw createHttpError(404, "Expense category not found");

      const duplicate = await prisma.expenseCategory.findUnique({
        where: { name },
      });
      if (duplicate && duplicate.id !== id) {
        throw createHttpError(
          409,
          "Expense category with that name already exists"
        );
      }

      return await prisma.expenseCategory.update({
        where: { id },
        data: { name },
      });
    }
  } catch (error) {
    throw createHttpError(500, "Error editing category");
  }
};

export const getAllCategories = async (type: string) => {
  if (type !== "income" && type !== "expense") {
    throw createHttpError(
      400,
      "Invalid category type. Must be 'income' or 'expense'"
    );
  }

  try {
    if (type === "income") {
      return await prisma.incomeCategory.findMany({
        orderBy: { id: "asc" },
      });
    } else {
      return await prisma.expenseCategory.findMany({
        orderBy: { id: "asc" },
      });
    }
  } catch (error) {
    throw createHttpError(500, "Error fetching categories");
  }
};
