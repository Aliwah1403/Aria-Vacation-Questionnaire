import { Router } from "express";
import { sendFeedbackEmail } from "../controllers/emailSend.controller.js";

const emailRouter = Router();

emailRouter.post("/send-feedback", sendFeedbackEmail);

export default emailRouter;
