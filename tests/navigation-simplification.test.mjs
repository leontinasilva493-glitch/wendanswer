import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const exists = (file) => fs.existsSync(path.join(root, file));

const footerSource = read("src/components/DisclaimerFooter.tsx");
for (const expected of ["/contact", "/disclaimer", "/privacy-policy", "/terms"]) {
  assert.match(footerSource, new RegExp(`href="${expected}"`), `footer should keep ${expected}`);
}
for (const removed of ["/faq", "/status", "/llms.txt"]) {
  assert.doesNotMatch(footerSource, new RegExp(`href="${removed}"`), `footer should not link ${removed}`);
}

const sitemapSource = read("src/app/sitemap.ts");
assert.doesNotMatch(sitemapSource, /"\/status"/, "sitemap should not include the removed status page");
assert.equal(exists("src/app/status/page.tsx"), false, "status page should be removed");

const todaySource = read("src/app/linkedin-wend-answer-today/page.tsx");
assert.match(todaySource, /Finished today's Wend\?/, "answer page should include the finished-today CTA heading");
assert.match(todaySource, /href="\/how-to-play-linkedin-wend"/, "answer page body should link to How to Play");
assert.match(todaySource, /href="\/how-to-solve-linkedin-wend"/, "answer page body should link to Solving Tips");

const faqSource = read("src/app/faq/page.tsx");
assert.match(faqSource, /href="\/where-is-linkedin-wend"/, "FAQ page should keep the Find Wend internal link");

const relatedSource = read("src/components/RelatedGames.tsx");
assert.match(relatedSource, /How to Play/, "Related Resources should include How to Play");
assert.match(relatedSource, /Solving Tips/, "Related Resources should include Solving Tips");

console.log("navigation simplification test passed");
