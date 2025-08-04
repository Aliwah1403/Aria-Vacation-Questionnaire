import { Router } from "express";
import { getSingleUser, updateUser } from "../controllers/users.controller.js";

const usersRouter = Router();

usersRouter
  .get("/get/:userId", getSingleUser)
  .patch("/update/:userId", updateUser);

export default usersRouter;
