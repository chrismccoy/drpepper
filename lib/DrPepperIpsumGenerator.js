const { toHtml } = require("./format");

const DR_PEPPER_WORDS = Object.freeze([
  "dr", "pepper", "cherry", "creamsoda", "coconut", "dark", "berry",
  "low", "sugar", "classic", "zero", "vanilla", "float", "23-flavors",
  "diet", "ten", "heritage", "waco", "dublin", "alderton", "bubbly",
  "fizzy", "refreshing", "unique", "original", "crave", "misunderstood",
  "ice-cold", "fountain", "maroon", "bold", "authentic", "carbonated",
  "thirst", "be-a-pepper", "pepper-pack", "frosty", "treat", "blend",
  "secret-recipe", "soda", "pop", "cola", "fizz", "crisp", "caffeine",
  "can", "bottle", "glass", "ice", "vending", "slushie",
]);

const LOREM_WORDS = Object.freeze([
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing",
  "elit", "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore",
  "et", "dolore", "magna", "aliqua",
]);



const DEFAULT_OPTIONS = Object.freeze({
  themeWords: DR_PEPPER_WORDS,
  fillerWords: LOREM_WORDS,
  themeWeight: 3,
  opener: "Dr Pepper lorem ipsum.",
  wordsPerSentence: Object.freeze({ min: 5, max: 12 }),
  sentencesPerParagraph: Object.freeze({ min: 3, max: 7 }),
  random: Math.random,
});

function assertWordList(name, words) {
  if (!Array.isArray(words) || !words.every((w) => typeof w === "string" && w !== "")) {
    throw new TypeError(`${name} must be an array of non-empty strings`);
  }
}

function assertRange(name, range) {
  const { min, max } = range ?? {};
  if (!Number.isInteger(min) || !Number.isInteger(max) || min < 1 || max < min) {
    throw new RangeError(`${name} must be { min, max } integers with 1 <= min <= max`);
  }
}

function validateOptions(options) {
  const { themeWords, fillerWords, themeWeight, opener, random } = options;
  assertWordList("themeWords", themeWords);
  assertWordList("fillerWords", fillerWords);
  if (!Number.isInteger(themeWeight) || themeWeight < 0) {
    throw new RangeError("themeWeight must be a non-negative integer");
  }
  if (themeWeight * themeWords.length + fillerWords.length === 0) {
    throw new RangeError("the word bank is empty: supply theme or filler words");
  }
  assertRange("wordsPerSentence", options.wordsPerSentence);
  assertRange("sentencesPerParagraph", options.sentencesPerParagraph);
  if (typeof opener !== "string") throw new TypeError("opener must be a string");
  if (typeof random !== "function") throw new TypeError("random must be a function");
}

class DrPepperIpsumGenerator {
  #wordBank;
  #options;

  constructor(options = {}) {
    this.#options = { ...DEFAULT_OPTIONS, ...options };
    validateOptions(this.#options);
    const { themeWords, fillerWords, themeWeight } = this.#options;

    const weightedThemeWords = Array.from({ length: themeWeight }, () => themeWords).flat();
    this.#wordBank = [...weightedThemeWords, ...fillerWords];
  }

  #randomInt({ min, max }) {
    return Math.floor(this.#options.random() * (max - min + 1)) + min;
  }

  #pickWord() {
    return this.#wordBank[this.#randomInt({ min: 0, max: this.#wordBank.length - 1 })];
  }

  #generateSentence(isOpeningSentence) {
    if (isOpeningSentence) {
      return this.#options.opener;
    }

    const wordCount = this.#randomInt(this.#options.wordsPerSentence);
    const sentence = Array.from({ length: wordCount }, () => this.#pickWord()).join(" ");
    return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
  }

  #generateParagraph(isOpeningParagraph) {
    const sentenceCount = this.#randomInt(this.#options.sentencesPerParagraph);
    return Array.from({ length: sentenceCount }, (_, i) =>
      this.#generateSentence(isOpeningParagraph && i === 0)
    ).join(" ");
  }

  generateParagraphs(paragraphCount) {
    if (!Number.isInteger(paragraphCount) || paragraphCount < 0) {
      throw new RangeError(`paragraphCount must be a non-negative integer, got ${paragraphCount}`);
    }
    return Array.from({ length: paragraphCount }, (_, i) => this.#generateParagraph(i === 0));
  }

  generate(paragraphCount) {
    return toHtml(this.generateParagraphs(paragraphCount));
  }
}

module.exports = DrPepperIpsumGenerator;
module.exports.DR_PEPPER_WORDS = DR_PEPPER_WORDS;
module.exports.LOREM_WORDS = LOREM_WORDS;
