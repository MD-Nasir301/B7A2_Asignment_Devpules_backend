import { Router } from "express";
import { userConroller } from "./user.controller";

const router = Router();

router.post("/signup", userConroller.registerUser);

export const userRouter = router;

