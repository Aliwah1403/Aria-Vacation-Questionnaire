import { Router } from "express";
import {
  sendFeedbackEmail,
  sendTestMail,
} from "../controllers/emailSend.controller.js";

const emailRouter = Router();

emailRouter
  .post("/send-feedback", sendFeedbackEmail)
  .post("/send-test-email", sendTestMail);

export default emailRouter;
