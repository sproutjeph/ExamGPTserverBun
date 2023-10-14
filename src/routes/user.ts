import express from "express";
import { registerUser } from "../controllers/user/registerUser";

const userRouter = express.Router();

userRouter.post("/register-user", registerUser);

export default userRouter;
