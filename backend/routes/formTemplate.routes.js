import { Router } from "express";
import { addFormTemplate } from "../controllers/formTemplate.controllers.js";

const formTemplateRouter = Router();

formTemplateRouter.post("/add", addFormTemplate);

export default formTemplateRouter;
