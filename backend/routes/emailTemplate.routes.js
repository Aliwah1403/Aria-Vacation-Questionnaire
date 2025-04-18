import { Router } from "express";
import { addEmailTemplate } from "../controllers/emailTemplate.controller.js";

const emailTemplateRouter = Router();

emailTemplateRouter.post("/add", addEmailTemplate);

export default emailTemplateRouter;
