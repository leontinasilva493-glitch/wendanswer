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
assert.match(
  archiveDetailSource,
  /wendArchiveSlug/,
  "archive detail pages should use canonical Wend archive slugs",
);
assert.match(
  archiveDetailSource,
  /slug\.startsWith\("wend-answer-puzzle-"\)/,
  "dynamic archive route should accept canonical Wend puzzle URL prefixes",
);
assert.match(
  archiveDetailSource,
  /slug\.startsWith\("linkedin-wend-answer-"\)/,
  "dynamic archive route should handle legacy Wend archive URLs directly",
);
assert.match(
  archiveDetailSource,
  /permanentRedirect\(/,
  "legacy Wend archive redirects should be permanent 308 redirects",
);
assert.doesNotMatch(
  archiveDetailSource,
  /NextResponse\.redirect\(/,
  "legacy Wend archive redirects should not rely on proxy middleware",
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
  /readRecentWendPuzzles/,
  "smoke test should derive recent Wend archive URLs from puzzle data",
);
assert.match(
  smokeSource,
  /legacyWendArchivePath\(latestWendPuzzle\)/,
  "smoke test should verify the latest old Wend archive URL redirects",
);

console.log("wend archive URL test passed");
