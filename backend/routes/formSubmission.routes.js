import { Router } from "express";
import { addFormSubmission } from "../controllers/formSubmission.controller.js";

const formSubmissionRouter = Router();

formSubmissionRouter
.post("/add", addFormSubmission)
// .put("/response/:id", formSubmissionResponses)

export default formSubmissionRouter;
