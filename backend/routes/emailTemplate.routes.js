import { Router } from "express";
import {
  addEmailTemplate,
  getEmailTemplate,
} from "../controllers/emailTemplate.controller.js";

const emailTemplateRouter = Router();

emailTemplateRouter
  .post("/add", addEmailTemplate)
  .get("/get", getEmailTemplate);

export default emailTemplateRouter;
