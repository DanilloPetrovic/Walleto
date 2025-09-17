import { Request, Response } from "express";
import * as userService from "../services/userService";
import { AuthenticatedRequest } from "../types/AuthenticatedRequest";

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const user = await userService.register({ name, email, password });

  res.status(201).json(user);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { token, user } = await userService.login({ email, password });

  res.status(200).json({ token, user });
};

export const getUserInfo = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  const user = await userService.getUserInfoById(Number(userId));
  res.status(200).json(user);
};
