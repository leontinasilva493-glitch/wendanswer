import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const exists = (file) => fs.existsSync(path.join(root, file));

const footerSource = read("src/components/DisclaimerFooter.tsx");
for (const expected of ["/contact", "/press", "/disclaimer", "/privacy-policy", "/terms"]) {
  assert.match(footerSource, new RegExp(`href="${expected}"`), `footer should keep ${expected}`);
}
for (const removed of ["/faq", "/status", "/llms.txt"]) {
  assert.doesNotMatch(footerSource, new RegExp(`href="${removed}"`), `footer should not link ${removed}`);
}

const sitemapSource = read("src/app/sitemap.ts");
const smokeSource = read("scripts/smoke-local.mjs");
assert.doesNotMatch(sitemapSource, /"\/status"/, "sitemap should not include the removed status page");
assert.equal(exists("src/app/status/page.tsx"), false, "status page should be removed");
assert.doesNotMatch(smokeSource, /["']\/status["']/, "local and production smoke must not require the removed status page");

const faqSource = read("src/app/faq/page.tsx");
assert.match(faqSource, /href="\/where-is-linkedin-wend"/, "FAQ page should keep the Find Wend internal link");

const relatedSource = read("src/components/RelatedGames.tsx");
assert.match(relatedSource, /How to Play/, "Related Resources should include How to Play");
assert.match(relatedSource, /Solving Tips/, "Related Resources should include Solving Tips");

console.log("navigation simplification test passed");
