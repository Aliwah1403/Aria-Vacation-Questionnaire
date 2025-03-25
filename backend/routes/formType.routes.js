import { Router } from "express";
import {
  addFormType,
  getFormType,
  updateFormType,
} from "../controllers/formType.controllers.js";

const formTypeRouter = Router();

formTypeRouter
  .post("/add", addFormType)
  .get("/get", getFormType)
  .put("/update/:id", updateFormType);

export default formTypeRouter;
