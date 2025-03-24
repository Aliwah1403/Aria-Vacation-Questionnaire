import express from "express";
import { PORT } from "./config/env.js";
import { readdirSync } from "fs";
import connectToDb from "./database/mongoDb.js";

const app = express();

// middlewares
app.use(express.json());

// routes
// readdirSync("./routes").map((route) =>
//   app.use("/", require("./routes/" + route))
// );

const server = () => {
  app.listen(PORT, async () => {
    console.log(`Listening on port ${PORT}`);
    await connectToDb();
  });
};

server();
