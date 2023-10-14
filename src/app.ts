import express from "express";
import cors from "cors";
import userRouter from "./routes/user";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/error";

const app = express();
app.use(cookieParser());
app.use(cors());

app.use(express.json());

app.use("/api/v1", userRouter);

app.use(ErrorMiddleware);
export default app;
