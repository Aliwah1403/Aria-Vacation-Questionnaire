import express from "express";
import { PORT } from "./config/env.js";
import formTypeRouter from "./routes/formType.routes.js";
import connectToDb from "./database/mongoDb.js";
import formTemplateRouter from "./routes/formTemplate.routes.js";
import formSubmissionRouter from "./routes/formSubmission.routes.js";
import emailTemplateRouter from "./routes/emailTemplate.routes.js";
import cors from "cors";

const app = express();

// Will switch to a more robust solution once everything is set up and working
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
};

// middlewares
app.use(cors(corsOptions));
app.use(express.json());

// routes
app.use("/api/v1/form-type", formTypeRouter);
app.use("/api/v1/form-template", formTemplateRouter);
app.use("/api/v1/form-submission", formSubmissionRouter);
app.use("/api/v1/email-template", emailTemplateRouter);

const server = () => {
  app.listen(PORT, async () => {
    console.log(`Listening on port ${PORT}`);
    await connectToDb();
  });
};

server();
