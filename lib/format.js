function toHtml(paragraphs) {
  return paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("\n");
}

const HTML_ENTITIES = Object.freeze({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
});

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (char) => HTML_ENTITIES[char]);
}

module.exports = { toHtml, escapeHtml };
