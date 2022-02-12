import { Buffer } from "buffer";

import { api, data, params } from "@serverless/cloud";

import cors from "cors";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";



api.use(cors());

Sentry.init({
  dsn: "https://6177f670126f47dcabb3e01dbabbcf3a@o1142222.ingest.sentry.io/6201128",
  environment: params.INSTANCE_NAME,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ api }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

api.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
api.use(Sentry.Handlers.tracingHandler());

api.get("/l/:shortUrl", async (req, res) => {
  let shortUrl = req.params.shortUrl;
  var result = await data.get(shortUrl);
  result.clicks++
  let updatedObj = await data.set(shortUrl, { clicks: result.clicks });
  let fullUrl = `https://${result.url}`;
  console.log(`Short URL: ${shortUrl}, Updated Obj: ${JSON.stringify(updatedObj)}`);
  res.redirect(fullUrl);
});

api.post("/s/:longUrl", async (req, res) => {
  let bufferObj = Buffer.from(req.params.longUrl, "utf8");
  let shortenedUrl = bufferObj.toString("base64");
  console.log(`The encoded base64 string is: ${shortenedUrl}`);
  let result = await data.set(shortenedUrl, { url: req.params.longUrl, clicks: 0 });

  res.send(`Result: ${JSON.stringify(result)}<br><br>Short URL: ${shortenedUrl}`);
});

api.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

// The error handler must be before any other error middleware and after all controllers
api.use(Sentry.Handlers.errorHandler());

// Optional fallthrough error handler
api.use(function onError(err, req, res, next) {
  // The error id is attached to `res.sentry` to be returned
  // and optionally displayed to the user for support.
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});
