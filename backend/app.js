import express from "express";
import { PORT } from "./config/env.js";
import formTypeRouter from "./routes/formType.routes.js";
import connectToDb from "./database/mongoDb.js";
import formTemplateRouter from "./routes/formTemplate.routes.js";
import formSubmissionRouter from "./routes/formSubmission.routes.js";
import emailTemplateRouter from "./routes/emailTemplate.routes.js";
import cors from "cors";
import emailRouter from "./routes/email.routes.js";
import authRouter from "./routes/auth.routes.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";

const app = express();

// Will switch to a more robust solution once everything is set up and working
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));

// BetterAuth
app.all("/api/auth/*", toNodeHandler(auth));

// middlewares
app.use(express.json());

// routes
app.use("/api/v1/form-type", formTypeRouter);
app.use("/api/v1/form-template", formTemplateRouter);
app.use("/api/v1/form-submission", formSubmissionRouter);
app.use("/api/v1/email-template", emailTemplateRouter);
app.use("/api/v1/email-send", emailRouter);

const server = () => {
  app.listen(PORT, async () => {
    console.log(`Listening on port ${PORT}`);
    await connectToDb();
  });
};

server();
