import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
// import connectToDb from "../database/mongoDb.js";
import { MongoClient } from "mongodb";
import { DB_URI } from "../config/env.js";
import { sendMail } from "../services/emailService.js";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const client = new MongoClient(DB_URI);
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db),
  trustedOrigins: [FRONTEND_URL],
  basePath: "/api/auth",
  session: {
    expiresIn: 60 * 60 * 24 * 3, // 3 days
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      await sendMail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
      });
    },

    // disableSignUp: true,
  },
});
