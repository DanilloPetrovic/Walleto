import { Router } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import authMiddleware from "../middlewares/authMiddleware";
import {
  create,
  edit,
  remove,
  getAll,
} from "../controllers/categoryController";

const router = Router();

router.post("/", authMiddleware, asyncHandler(create));

router.put("/:id", authMiddleware, asyncHandler(edit));

router.delete("/:id", authMiddleware, asyncHandler(remove));

router.get("/", authMiddleware, asyncHandler(getAll));

export default router;
