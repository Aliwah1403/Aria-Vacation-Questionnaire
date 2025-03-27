import express from "express";
import { PORT } from "./config/env.js";
import formTypeRouter from "./routes/formType.routes.js";
import connectToDb from "./database/mongoDb.js";
import formTemplateRouter from "./routes/formTemplate.routes.js";
import formSubmissionRouter from "./routes/formSubmission.routes.js";

const app = express();

// middlewares
app.use(express.json());

// routes
app.use("/api/v1/form-type", formTypeRouter);
app.use("/api/v1/form-template", formTemplateRouter);
app.use("/api/v1/form-submission", formSubmissionRouter);

const server = () => {
  app.listen(PORT, async () => {
    console.log(`Listening on port ${PORT}`);
    await connectToDb();
  });
};

server();
