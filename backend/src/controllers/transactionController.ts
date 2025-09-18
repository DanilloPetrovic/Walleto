import { Request, Response } from "express";
import * as transactionService from "../services/transactionService";

export const create = async (req: Request, res: Response) => {
  const transaction = await transactionService.createTransaction(req.body);
  res.status(201).json(transaction);
};

export const edit = async (req: Request, res: Response) => {
  const { id } = req.params;
  const transaction = await transactionService.editTransaction(
    Number(id),
    req.body
  );
  res.status(200).json(transaction);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId, transactionType } = req.body;

  const result = await transactionService.deleteTransaction(
    Number(id),
    Number(userId),
    transactionType
  );
  res.status(200).json(result);
};

export const listAll = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId) return res.status(400).json({ error: "User ID is required" });

  const transactions = await transactionService.getAllTransactions(
    Number(userId)
  );
  res.status(200).json(transactions);
};
