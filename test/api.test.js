const test = require("node:test");
const assert = require("node:assert/strict");
const { withServer } = require("./helpers");
const { parseParagraphCount } = require("../routes/api");

test("POST /api returns JSON paragraphs for a valid count", async () => {
  await withServer({}, async (url) => {
    const res = await fetch(`${url}/api`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ paragraphs: 3 }),
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.paragraphs.length, 3);
  });
});

test("malformed JSON body gets a plain 400 without a stack trace", async () => {
  await withServer({}, async (url) => {
    const res = await fetch(`${url}/api`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{bad",
    });
    const text = await res.text();
    assert.equal(res.status, 400);
    assert.match(res.headers.get("content-type"), /^text\/plain/);
    assert.doesNotMatch(text, /SyntaxError|node_modules|\bat\s/);
  });
});

test("a file field in a multipart body gets a plain 400 without a stack trace", async () => {
  await withServer({}, async (url) => {
    const form = new FormData();
    form.append("file", new Blob(["x"]), "x.txt");
    const res = await fetch(`${url}/api`, { method: "POST", body: form });
    const text = await res.text();
    assert.equal(res.status, 400);
    assert.match(res.headers.get("content-type"), /^text\/plain/);
    assert.doesNotMatch(text, /MulterError|node_modules|\bat\s/);
  });
});

test("responses hide X-Powered-By and send security headers", async () => {
  await withServer({}, async (url) => {
    const res = await fetch(`${url}/`);
    assert.equal(res.status, 200);
    assert.equal(res.headers.get("x-powered-by"), null);
    assert.equal(res.headers.get("x-content-type-options"), "nosniff");
    assert.equal(res.headers.get("x-frame-options"), "DENY");
    assert.match(res.headers.get("content-security-policy") ?? "", /default-src 'self'/);
  });
});

test("parseParagraphCount accepts only whole numbers in range", () => {
  assert.equal(parseParagraphCount("5"), 5);
  assert.equal(parseParagraphCount(" 7 "), 7);
  assert.equal(parseParagraphCount(12), 12);
  assert.equal(parseParagraphCount("5abc"), 4);
  assert.equal(parseParagraphCount("1e3"), 4);
  assert.equal(parseParagraphCount(2.7), 4);
  assert.equal(parseParagraphCount("2.7"), 4);
  assert.equal(parseParagraphCount(undefined), 4);
  assert.equal(parseParagraphCount("0"), 4);
  assert.equal(parseParagraphCount("101"), 4);
});

test("POST /api is rate limited per client", async () => {
  const deps = { rateLimit: { windowMs: 60_000, max: 2 } };
  await withServer(deps, async (url) => {
    const post = () => fetch(`${url}/api`, { method: "POST" });
    assert.equal((await post()).status, 200);
    assert.equal((await post()).status, 200);
    const limited = await post();
    assert.equal(limited.status, 429);
    assert.ok(Number(limited.headers.get("retry-after")) >= 1);
  });
});
