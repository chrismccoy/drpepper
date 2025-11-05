function parseTrustProxy(raw) {
  const value = (raw ?? "").trim();
  if (value === "" || value === "false") return false;
  if (value === "true") return true;
  if (/^\d+$/.test(value)) return Number(value);
  return value;
}

module.exports = Object.freeze({
  PORT: Number(process.env.PORT) || 3067,
  DEFAULT_PARAGRAPHS: 4,
  MIN_PARAGRAPHS: 1,
  MAX_PARAGRAPHS: 100,
  RATE_LIMIT_WINDOW_MS: 60_000,
  RATE_LIMIT_MAX: 60,
  TRUST_PROXY: parseTrustProxy(process.env.TRUST_PROXY),
});
