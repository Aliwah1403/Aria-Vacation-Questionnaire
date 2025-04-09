import { Router } from "express";
import {
  addFormTemplate,
  getFormTemplate,
  updateFormTemplate,
  deleteFormTemplate,
} from "../controllers/formTemplate.controllers.js";

const formTemplateRouter = Router();

formTemplateRouter
  .post("/add", addFormTemplate)
  .get("/get", getFormTemplate)
  .put("/update/:id", updateFormTemplate)
  .delete("/delete/:id", deleteFormTemplate);

export default formTemplateRouter;
