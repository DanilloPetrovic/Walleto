import { Router } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import authMiddleware from "../middlewares/authMiddleware";
import {
  create,
  edit,
  remove,
  listAll,
} from "../controllers/transactionController";

const router = Router();

router.post("/", authMiddleware, asyncHandler(create));
router.put("/:id", authMiddleware, asyncHandler(edit));
router.delete("/:id", authMiddleware, asyncHandler(remove));
router.get("/user/:userId", asyncHandler(listAll));

export default router;
