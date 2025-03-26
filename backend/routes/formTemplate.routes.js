import { Router } from "express";
import {
  addFormTemplate,
  getFormTemplate,
  updateFormTemplate,
  updateQuestion,
} from "../controllers/formTemplate.controllers.js";

const formTemplateRouter = Router();

formTemplateRouter
  .post("/add", addFormTemplate)
  .get("/get", getFormTemplate)
  .put("/update/:id", updateFormTemplate)
  .put("/update/:templateId/question/:questionId", updateQuestion);

export default formTemplateRouter;
