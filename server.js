const http = require("http");
const express = require("express");
const path = require("path");
const createApiRouter = require("./routes/api");
const { PORT, TRUST_PROXY } = require("./config");

const PUBLIC_PATH = path.join(__dirname, "public");
const INDEX_PATH = path.join(PUBLIC_PATH, "index.html");

const SHUTDOWN_TIMEOUT_MS = 10_000;

const SECURITY_HEADERS = Object.freeze({
  "Content-Security-Policy":
    "default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; " +
    "object-src 'none'",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "no-referrer",
});

function securityHeaders(req, res, next) {
  res.set(SECURITY_HEADERS);
  next();
}

function handleError(err, req, res, next) {
  if (res.headersSent) return next(err);

  let status = err.status ?? err.statusCode;
  if (status === undefined && err.name === "MulterError") status = 400;

  if (Number.isInteger(status) && status >= 400 && status < 500) {
    res.status(status).type("text").send(http.STATUS_CODES[status] ?? "Bad Request");
    return;
  }

  console.error("Unhandled error:", err);
  res.status(500).type("text").send("An unexpected error occurred. Please try again later.");
}


function createApp(deps = {}) {
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", TRUST_PROXY);

  app.use(securityHeaders);

  app.use(express.static(PUBLIC_PATH));

  app.use("/api", createApiRouter(deps));

  app.get(/(.*)/, (req, res, next) => {
    if (path.extname(req.path) !== "") return next();
    res.sendFile(INDEX_PATH);
  });

  app.use(handleError);

  return app;
}

if (require.main === module) {
  const server = createApp().listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });

  const shutdown = (signal) => {
    console.log(`Received ${signal}, shutting down`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), SHUTDOWN_TIMEOUT_MS).unref();
  };
  process.once("SIGTERM", shutdown);
  process.once("SIGINT", shutdown);
}

module.exports = createApp;
