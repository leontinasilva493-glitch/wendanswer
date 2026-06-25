import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const datesSource = read("src/lib/dates.ts");
assert.match(datesSource, /wendArchiveSlug/, "dates.ts should expose the canonical Wend archive slug helper");
assert.match(
  datesSource,
  /wend-answer-puzzle-\$\{puzzleNumber\}-\$\{monthSlug\(dateLabel\)\}/,
  "canonical Wend archive URLs should use /wend-answer-puzzle-{number}-{date}",
);

const archiveDetailSource = read("src/app/[slug]/page.tsx");
const proxySource = read("src/proxy.ts");
assert.match(
  archiveDetailSource,
  /wendArchiveSlug/,
  "archive detail pages should use canonical Wend archive slugs",
);
assert.match(
  proxySource,
  /legacyWendArchivePrefix = "\/linkedin-wend-answer-"/,
  "proxy should detect legacy Wend archive URLs before page rendering",
);
assert.match(
  proxySource,
  /canonicalWendArchivePrefix = "\/wend-answer-puzzle-"/,
  "legacy Wend archive redirects should point to canonical archive URLs",
);
assert.match(
  proxySource,
  /NextResponse\.redirect\(url,\s*308\)/,
  "legacy Wend archive redirects should be permanent 308 redirects",
);
assert.match(
  archiveDetailSource,
  /slug\.startsWith\("wend-answer-puzzle-"\)/,
  "dynamic archive route should accept canonical Wend puzzle URL prefixes",
);

const sitemapSource = read("src/app/sitemap.ts");
assert.match(
  sitemapSource,
  /wendArchiveSlug/,
  "sitemap should publish canonical Wend archive URLs",
);
assert.doesNotMatch(
  sitemapSource,
  /linkedin-wend-answer-\$\{/,
  "sitemap should not publish legacy /linkedin-wend-answer-{slug} archive URLs",
);

const smokeSource = read("scripts/smoke-local.mjs");
assert.match(
  smokeSource,
  /\/wend-answer-puzzle-17-june-25-2026/,
  "smoke test should cover the newest canonical Wend archive URL",
);
assert.match(
  smokeSource,
  /\/linkedin-wend-answer-17-june-25-2026/,
  "smoke test should verify the old Wend archive URL redirects",
);

console.log("wend archive URL test passed");
