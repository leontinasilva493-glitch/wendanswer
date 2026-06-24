import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const legacyRouteDir = path.join(root, "src/app/linkedin-games-answers-today");
const legacyPagePath = path.join(legacyRouteDir, "page.tsx");
const legacyRoutePath = path.join(legacyRouteDir, "route.ts");
const sitemapPath = path.join(root, "src/app/sitemap.ts");

assert.equal(
  fs.existsSync(legacyPagePath),
  false,
  "legacy /linkedin-games-answers-today must not have an indexable page.tsx",
);

assert.equal(
  fs.existsSync(legacyRoutePath),
  true,
  "legacy /linkedin-games-answers-today should keep a route handler for redirects",
);

const legacyRouteSource = fs.readFileSync(legacyRoutePath, "utf8");
assert.match(
  legacyRouteSource,
  /NextResponse\.redirect/,
  "legacy route should use an explicit redirect response",
);
assert.match(
  legacyRouteSource,
  /,\s*301\s*\)/,
  "legacy route should return a 301 redirect",
);

const sitemapSource = fs.readFileSync(sitemapPath, "utf8");
assert.equal(
  sitemapSource.includes('"/linkedin-games-answers-today"'),
  false,
  "sitemap must not include the duplicate legacy route",
);

console.log("seo routes test passed");
