const test = require("node:test");
const assert = require("node:assert/strict");
const DrPepperIpsumGenerator = require("../lib/DrPepperIpsumGenerator");

test("default generator opens with the opener sentence", () => {
  const [first] = new DrPepperIpsumGenerator().generateParagraphs(1);
  assert.match(first, /^Dr Pepper lorem ipsum\./);
});

test("constructor rejects invalid options", () => {
  const bad = [
    { themeWeight: 2.5 },
    { themeWeight: -1 },
    { themeWeight: "3" },
    { themeWords: [], fillerWords: [] },
    { themeWords: "cola" },
    { fillerWords: ["ok", ""] },
    { wordsPerSentence: { min: 5, max: 2 } },
    { wordsPerSentence: { min: 0, max: 2 } },
    { sentencesPerParagraph: { min: 1.5, max: 3 } },
    { opener: 42 },
    { random: 0.5 },
  ];
  for (const options of bad) {
    assert.throws(() => new DrPepperIpsumGenerator(options), /TypeError|RangeError/, JSON.stringify(options));
  }
});

test("theme words alone are a valid word bank", () => {
  const gen = new DrPepperIpsumGenerator({ fillerWords: [], themeWords: ["fizz"] });
  assert.doesNotMatch(gen.generateParagraphs(2).join(" "), /undefined/i);
});
