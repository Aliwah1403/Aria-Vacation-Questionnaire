import { Router } from "express";
import {
  addEmailTemplate,
  deleteEmailTemplate,
  getEmailTemplate,
  updateEmailTemplate,
} from "../controllers/emailTemplate.controller.js";

const emailTemplateRouter = Router();

emailTemplateRouter
  .post("/add", addEmailTemplate)
  .get("/get", getEmailTemplate)
  .patch("/update/:id", updateEmailTemplate)
  .delete("/delete/:id", deleteEmailTemplate);

export default emailTemplateRouter;
