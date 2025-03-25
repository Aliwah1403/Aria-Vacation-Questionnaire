import { Router } from "express";
import {
  addFormType,
  deleteFormType,
  getFormType,
  updateFormType,
} from "../controllers/formType.controllers.js";

const formTypeRouter = Router();

formTypeRouter
  .post("/add", addFormType)
  .get("/get", getFormType)
  .put("/update/:id", updateFormType)
  .delete("/delete/:id", deleteFormType)

export default formTypeRouter;
