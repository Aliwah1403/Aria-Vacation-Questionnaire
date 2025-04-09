import { Router } from "express";
import {
  addFormSubmission,
  formSubmissionResponses,
  getFormSubmission,
  getAllFormSubmissions,
} from "../controllers/formSubmission.controller.js";

const formSubmissionRouter = Router();

formSubmissionRouter
  .post("/add", addFormSubmission)
  .get("/get/:id", getFormSubmission)
  .put("/response/:id", formSubmissionResponses)
  .get("/get-all", getAllFormSubmissions);

export default formSubmissionRouter;
