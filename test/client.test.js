const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const SOURCE = fs.readFileSync(
  path.join(__dirname, "..", "public", "assets", "js", "drpepper.js"),
  "utf8"
);

test("missing submit button logs an error instead of throwing", () => {
  const errors = [];
  const form = { querySelector: () => null, addEventListener: () => {} };
  const document = {
    getElementById: (id) => (id === "ipsum-form" ? form : { innerHTML: "" }),
  };
  const context = { document, console: { error: (...args) => errors.push(args) } };
  assert.doesNotThrow(() => vm.runInNewContext(SOURCE, context));
  assert.equal(errors.length, 1);
});
