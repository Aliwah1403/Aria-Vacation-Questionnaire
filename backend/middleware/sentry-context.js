import * as Sentry from "@sentry/node";
import { auth } from "../lib/auth.js";

export const setSentryUserContext = async (req, res, next) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (session?.user) {
      Sentry.setUser({
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      });
    } else {
      Sentry.setUser(null);
    }
  } catch (error) {
    Sentry.setUser(null);
  }
  next();
};
