import express from "express";
import { PORT } from "./config/env.js";

const app = express();

const server = () => {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
};

server();
