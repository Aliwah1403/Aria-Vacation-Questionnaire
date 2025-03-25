import express from "express";
import { PORT } from "./config/env.js";
import formTypeRouter from "./routes/formType.routes.js";
import connectToDb from "./database/mongoDb.js";

const app = express();

// middlewares
app.use(express.json());

// routes
app.use("/api/v1/form-type", formTypeRouter);

const server = () => {
  app.listen(PORT, async () => {
    console.log(`Listening on port ${PORT}`);
    await connectToDb();
  });
};

server();
