import { Router } from "express";
import {
  addEmailTemplate,
  deleteEmailTemplate,
  getEmailTemplate,
} from "../controllers/emailTemplate.controller.js";

const emailTemplateRouter = Router();

emailTemplateRouter
  .post("/add", addEmailTemplate)
  .get("/get", getEmailTemplate)
  .delete("/delete/:id", deleteEmailTemplate);

export default emailTemplateRouter;
