import { Router } from "express";
import {
  addFormTemplate,
  getFormTemplate,
} from "../controllers/formTemplate.controllers.js";

const formTemplateRouter = Router();

formTemplateRouter.post("/add", addFormTemplate).get("/get", getFormTemplate);

export default formTemplateRouter;
