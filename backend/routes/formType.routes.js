import { Router } from "express";
import { addFormType } from "../controllers/formType.controllers.js";

const formTypeRouter = Router();

formTypeRouter.post("/add", addFormType);

export default formTypeRouter;
