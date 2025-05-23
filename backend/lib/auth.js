import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
// import connectToDb from "../database/mongoDb.js";
import { MongoClient } from "mongodb";
import { DB_URI } from "../config/env.js";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const client = new MongoClient(DB_URI);
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db),
  trustedOrigins: [FRONTEND_URL],
  basePath: "/api/auth",
  emailAndPassword: {
    enabled: true,

    // disableSignUp: true,
  },
});
