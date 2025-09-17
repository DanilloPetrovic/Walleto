import { Request, Response } from "express";
import * as categoryService from "../services/categoryService";

export const create = async (req: Request, res: Response) => {
  const { name, for: type } = req.body;

  const category = await categoryService.createCategory({ name, for: type });

  res.status(201).json(category);
};

export const edit = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, for: type } = req.body;

  const category = await categoryService.editCategory({
    id: Number(id),
    name,
    for: type,
  });

  res.status(200).json(category);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { for: type } = req.body;

  const category = await categoryService.deleteCategory({
    id: Number(id),
    for: type,
  });

  res.status(200).json(category);
};

export const getAll = async (req: Request, res: Response) => {
  const { for: type } = req.query;

  const categories = await categoryService.getAllCategories(String(type));

  res.status(200).json(categories);
};
