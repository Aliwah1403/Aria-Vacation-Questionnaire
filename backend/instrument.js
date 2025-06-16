import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import { NODE_ENV } from "./config/env.js";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    nodeProfilingIntegration(),
    Sentry.consoleLoggingIntegration({
      levels: ["log", "info", "warn", "error"],
    }),
  ],
  tracesSampleRate: NODE_ENV === "development" ? 1.0 : 0.3,
  profilesSampleRate: NODE_ENV === "development" ? 1.0 : 0.3,
  environment: NODE_ENV,
  sendDefaultPii: true,
  debug: NODE_ENV !== "production",
  _experiments: { enableLogs: true },
});
