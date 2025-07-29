import { Router } from "express";
import { getSingleUser } from "../controllers/users.controller.js";

const usersRouter = Router();

usersRouter.get("/get/:userId", getSingleUser);

export default usersRouter;
