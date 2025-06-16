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
        // Add any other user fields you want to track
      });
    } else {
      // Clear user context if no session
      Sentry.setUser(null);
    }
  } catch (error) {
    // If there's an error getting the session, clear the user context
    Sentry.setUser(null);
  }
  next();
};
