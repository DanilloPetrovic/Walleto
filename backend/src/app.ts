import express from "express";
import cors from "cors";
import helmet from "helmet";
import userRoutes from "./routes/userRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import authMiddleware from "./middlewares/authMiddleware";
import errorHandler from "./middlewares/errorHandler";
import { AuthenticatedRequest } from "./types/AuthenticatedRequest";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running" });
});

app.get("/protected", authMiddleware, (req: AuthenticatedRequest, res) => {
  res.status(200).json({ message: "You are authenticated!", user: req.user });
});

app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/transaction", transactionRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

export default app;
