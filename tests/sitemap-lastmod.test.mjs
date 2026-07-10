import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const sitemapSource = read("src/app/sitemap.ts");

assert.doesNotMatch(
  sitemapSource,
  /lastModified:\s*new Date\(\)/,
  "static sitemap pages should not use deploy-time new Date() lastmod values",
);

assert.match(sitemapSource, /function lastModifiedForPath/, "sitemap should route static page lastmod through a helper");
assert.match(
  sitemapSource,
  /const latestWendUpdatedAt\s*=\s*wendPuzzles\[0\]\?\.updatedAt/,
  "Wend-driven pages should use the latest verified Wend update timestamp",
);

const wendDrivenPathsBlock = sitemapSource.match(/const wendDrivenPaths[\s\S]*?\]\);/)?.[0] ?? "";
for (const route of ["/", "/linkedin-wend-answer-today", "/linkedin-wend-solver", "/linkedin-wend-archive"]) {
  assert.match(sitemapSource, new RegExp(`"${route.replace(/\//g, "\\/")}"`), `${route} should remain in the sitemap`);
  assert.match(
    wendDrivenPathsBlock,
    new RegExp(`"${route.replace(/\//g, "\\/")}"`),
    `${route} should use latest verified Wend updatedAt for sitemap lastmod`,
  );
}

for (const route of [
  "/where-is-linkedin-wend",
  "/how-to-play-linkedin-wend",
  "/how-to-solve-linkedin-wend",
  "/faq",
  "/contact",
  "/press",
  "/disclaimer",
  "/privacy-policy",
  "/terms",
]) {
  assert.match(sitemapSource, new RegExp(`"${route.replace(/\//g, "\\/")}":\\s*"20\\d{2}-\\d{2}-\\d{2}T`), `${route} should have a fixed content lastmod`);
}

assert.match(
  sitemapSource,
  /lastModified:\s*new Date\(puzzle\.updatedAt\)/,
  "archive detail sitemap entries should continue using each puzzle updatedAt timestamp",
);

console.log("sitemap lastmod test passed");
