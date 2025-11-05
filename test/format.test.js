const test = require("node:test");
const assert = require("node:assert/strict");
const { toHtml } = require("../lib/format");

test("toHtml escapes HTML special characters", () => {
  assert.equal(
    toHtml(['<img src=x onerror="alert(1)">', "a & 'b'"]),
    "<p>&lt;img src=x onerror=&quot;alert(1)&quot;&gt;</p>\n<p>a &amp; &#39;b&#39;</p>"
  );
});
