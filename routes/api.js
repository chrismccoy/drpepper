const express = require("express");
const multer = require("multer");
const DrPepperIpsumGenerator = require("../lib/DrPepperIpsumGenerator");
const { toHtml } = require("../lib/format");
const createRateLimiter = require("../lib/rateLimit");
const {
  DEFAULT_PARAGRAPHS,
  MIN_PARAGRAPHS,
  MAX_PARAGRAPHS,
  RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX,
} = require("../config");

function parseParagraphCount(raw) {
  let count = Number.NaN;
  if (typeof raw === "number") {
    count = raw;
  } else if (typeof raw === "string" && /^\s*\d+\s*$/.test(raw)) {
    count = Number(raw);
  }
  const inRange = Number.isInteger(count) && count >= MIN_PARAGRAPHS && count <= MAX_PARAGRAPHS;
  return inRange ? count : DEFAULT_PARAGRAPHS;
}

function createApiRouter({
  generator = new DrPepperIpsumGenerator(),
  rateLimit = { windowMs: RATE_LIMIT_WINDOW_MS, max: RATE_LIMIT_MAX },
} = {}) {
  const router = express.Router();

  router.use(createRateLimiter(rateLimit));

  router.use(express.json(), express.urlencoded({ extended: false }), multer().none());

  router.post("/", (req, res) => {
    try {
      const paragraphs = generator.generateParagraphs(parseParagraphCount(req.body?.paragraphs));

      res.format({
        html: () => res.send(toHtml(paragraphs)),
        json: () => res.json({ paragraphs }),
        default: () => res.type("html").send(toHtml(paragraphs)),
      });
    } catch (error) {
      console.error("Error during ipsum generation:", error);
      res.status(500).type("text").send("An unexpected error occurred. Please try again later.");
    }
  });

  router.use((req, res) => {
    res.status(404).json({ error: `Cannot ${req.method} ${req.baseUrl}${req.path}` });
  });

  return router;
}

module.exports = createApiRouter;
module.exports.parseParagraphCount = parseParagraphCount;
