function createRateLimiter({ windowMs, max, now = Date.now }) {
  if (!Number.isInteger(windowMs) || windowMs < 1 || !Number.isInteger(max) || max < 1) {
    throw new RangeError("windowMs and max must be positive integers");
  }

  let windowStart = now();
  let counts = new Map();

  return function rateLimit(req, res, next) {
    const current = now();
    if (current - windowStart >= windowMs) {
      windowStart = current;
      counts = new Map();
    }

    const key = req.ip ?? "unknown";
    const used = (counts.get(key) ?? 0) + 1;
    counts.set(key, used);

    if (used > max) {
      const retryAfter = Math.max(1, Math.ceil((windowStart + windowMs - current) / 1000));
      res.set("Retry-After", String(retryAfter));
      res.status(429).type("text").send("Too many requests. Please try again later.");
      return;
    }
    next();
  };
}

module.exports = createRateLimiter;
