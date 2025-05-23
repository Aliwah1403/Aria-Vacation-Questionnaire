import { auth } from "../lib/auth.js";
import { Router } from "express";
import { toNodeHandler } from "better-auth/node";

const authRouter = Router();

authRouter.all("/*", toNodeHandler(auth));

export default authRouter;
