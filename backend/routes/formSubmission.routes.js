import { Router } from "express";
import {
  addFormSubmission,
  formSubmissionResponses,
  getFormSubmission,
} from "../controllers/formSubmission.controller.js";

const formSubmissionRouter = Router();

formSubmissionRouter
  .post("/add", addFormSubmission)
  .get("/get/:id", getFormSubmission)
  .put("/response/:id", formSubmissionResponses);

export default formSubmissionRouter;
