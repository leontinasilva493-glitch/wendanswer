import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const pageSource = read("src/app/linkedin-wend-statistics/page.tsx");
assert.match(pageSource, /LinkedIn Wend Statistics: Puzzle Sizes, Words & Difficulty/, "statistics title and H1 should target the distinct statistics intent");
assert.match(pageSource, /path:\s*"\/linkedin-wend-statistics"/, "statistics page should self-canonical through pageMetadata");
assert.match(pageSource, /aggregateWendStatistics\(wendPuzzles\)/, "statistics should derive from the verified public dataset");
assert.match(pageSource, /How these Wend statistics are calculated/, "statistics page should explain its methodology");
assert.match(pageSource, /Difficulty is an editorial label/, "difficulty limitations should be transparent");
assert.match(pageSource, /breadcrumbJson/, "statistics page should publish breadcrumb structured data");

const sitemapSource = read("src/app/sitemap.ts");
assert.match(sitemapSource, /"\/linkedin-wend-statistics"/, "statistics page should be in the sitemap");
assert.match(read("scripts/smoke-local.mjs"), /"\/linkedin-wend-statistics"/, "statistics page should stay in release smoke checks");

for (const file of ["src/components/Header.tsx", "src/app/linkedin-wend-archive/page.tsx"]) {
  assert.match(read(file), /href="\/linkedin-wend-statistics"/, `${file} should link to the statistics page`);
}
assert.match(
  read("src/components/RelatedGames.tsx"),
  /\["Wend Statistics", "\/linkedin-wend-statistics"\]/,
  "related resources should link to the statistics page",
);

console.log("wend statistics page SEO and internal-link test passed");
