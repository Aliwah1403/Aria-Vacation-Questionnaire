import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
// import connectToDb from "../database/mongoDb.js";
import { MongoClient } from "mongodb";
import { DB_URI } from "../config/env.js";
import { sendMail } from "../services/emailService.js";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const client = new MongoClient(DB_URI);
const db = client.db();

// Cleaning up expired sessions from DB every 24hrs
const cleanupExpiredSessions = async () => {
  try {
    const sessions = db.collection("session");
    const result = await sessions.deleteMany({
      expiresAt: { $lt: new Date() },
    });
    console.log(`Cleaned up ${result.deletedCount} expired sessions`);
  } catch (error) {
    console.error("Error cleaning up expired sessions from DB: ", error);
  }
};

setInterval(cleanupExpiredSessions, 24 * 60 * 60 * 1000);

export const auth = betterAuth({
  database: mongodbAdapter(db),
  trustedOrigins: [FRONTEND_URL],
  basePath: "/api/auth",
  session: {
    expiresIn: 60 * 60 * 24 * 3, // 3 days
  },
  advanced: {
    defaultCookieAttributes: {
      // secure: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      httpOnly: true,
      // sameSite: "none", // Allows CORS-based cookie sharing across subdomains
    },
  },
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      await sendMail({
        to: user.email,
        subject: "Aria Feedback Panel password reset",
        // text: `Click the link to reset your password: ${url}`,
        html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
    <!--$-->
    <style>
      @font-face {
        font-family: "Poppins";
        font-style: normal;
        font-weight: 400;
        mso-font-alt: "Helvetica";
        src: url(https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap)
          format("woff2");
      }

      * {
        font-family: "Poppins", Helvetica;
      }
    </style>
  </head>

  <body
    style="
      margin: 0;
      margin-left: 12px;
      margin-right: 12px;
      background-color: #ffffff;
    "
  >
    <table
      align="center"
      width="100%"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="
        max-width: 37.5em;
        margin-left: auto;
        margin-right: auto;
        box-sizing: border-box;
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
        height: 100vh;
      "
    >
      <tbody>
        <tr style="width: 100%">
          <td>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="text-align: center"
            >
              <tbody>
                <tr>
                  <td>
                    <h1
                      style="
                        font-size: 24px;
                        font-weight: 600;
                        line-height: 32px;
                        color: rgb(17, 24, 39);
                      "
                    >
                      Reset Your Password
                    </h1>
                    <p
                      style="
                        font-size: 16px;
                        line-height: 24px;
                        color: rgb(107, 114, 128);
                        margin-top: 16px;
                        margin: 16px 0;
                      "
                    >
                      You are receiving this email because we received a
                      password reset request for your account.
                    </p>
                    <a
                      href="${url}"
                      style="
                        background-color: #4abec6;
                        color: rgb(255, 255, 255);
                        font-weight: 600;
                        border-radius: 8px;
                        padding-left: 20px;
                        padding-right: 20px;
                        padding-top: 12px;
                        padding-bottom: 12px;
                        margin-top: 24px;
                        line-height: 100%;
                        text-decoration: none;
                        display: inline-block;
                        max-width: 100%;
                        mso-padding-alt: 0px;
                        padding: 12px 20px 12px 20px;
                      "
                      target="_blank"
                      ><span
                        ><!--[if mso
                          ]><i
                            style="mso-font-width: 500%; mso-text-raise: 18"
                            hidden
                            >&#8202;&#8202;</i
                          ><!
                        [endif]--></span
                      ><span
                        style="
                          max-width: 100%;
                          display: inline-block;
                          line-height: 120%;
                          mso-padding-alt: 0px;
                          mso-text-raise: 9px;
                        "
                      >
                        Reset Password </span
                      ><span
                        ><!--[if mso
                          ]><i style="mso-font-width: 500%" hidden
                            >&#8202;&#8202;&#8203;</i
                          ><!
                        [endif]--></span
                      ></a
                    >
                    <p
                      style="
                        font-size: 16px;
                        line-height: 24px;
                        color: rgb(107, 114, 128);
                        margin-top: 16px;
                        margin: 16px 0;
                      "
                    >
                      This password reset link will expire in 1 hour.
                    </p>
                    <p
                      style="
                        font-size: 16px;
                        line-height: 24px;
                        color: rgb(107, 114, 128);
                        margin-top: 16px;
                        margin: 16px 0;
                      "
                    >
                      If you did not request a password reset, no further action
                      is required.
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <!--/$-->
  </body>
</html>
`,
      });
    },
    resetPasswordTokenExpiresIn: 3600, // 1 hour

    // disableSignUp: true,
  },
});
