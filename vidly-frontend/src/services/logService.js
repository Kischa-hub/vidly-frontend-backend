import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

function init() {
  Sentry.init({
    dsn:
      "https://e0f7c72efd2e4153b0e8286c3ba0f08a@o470305.ingest.sentry.io/5500778",
    integrations: [new Integrations.BrowserTracing()],

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
  });
}

function log(error) {
  console.error(error);
  Sentry.captureException(error);
}

export default {
  init,
  log,
};
