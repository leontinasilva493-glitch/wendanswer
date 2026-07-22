import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const legacyRouteDir = path.join(root, "src/app/linkedin-games-answers-today");
const legacyPagePath = path.join(legacyRouteDir, "page.tsx");
const legacyRoutePath = path.join(legacyRouteDir, "route.ts");
const sitemapPath = path.join(root, "src/app/sitemap.ts");
const statusRoutePath = path.join(root, "src/app/api/wend-status/route.ts");
const dispatchRoutePath = path.join(root, "src/app/api/ops/wend-dispatch/route.ts");
const smokePath = path.join(root, "scripts/smoke-local.mjs");
const indexNowPath = path.join(root, "scripts/submit-indexnow.mjs");
const todayRouteDir = path.join(root, "src/app/linkedin-wend-answer-today");
const todayPagePath = path.join(todayRouteDir, "page.tsx");
const todayRoutePath = path.join(todayRouteDir, "route.ts");

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

assert.equal(fs.existsSync(statusRoutePath), true, "public Wend freshness status route should exist");
assert.equal(fs.existsSync(dispatchRoutePath), true, "secured external Wend dispatch route should exist");
assert.equal(sitemapSource.includes('"/api/wend-status"'), false, "machine status endpoints must stay out of the sitemap");
const smokeSource = fs.readFileSync(smokePath, "utf8");
const indexNowSource = fs.readFileSync(indexNowPath, "utf8");

assert.equal(todayPagePath && fs.existsSync(todayPagePath), false, "duplicate Today URL must not keep an indexable page");
assert.equal(fs.existsSync(todayRoutePath), true, "duplicate Today URL should keep a permanent redirect route");
const todayRouteSource = fs.existsSync(todayRoutePath) ? fs.readFileSync(todayRoutePath, "utf8") : "";
assert.match(todayRouteSource, /NextResponse\.redirect/, "duplicate Today route should use an explicit redirect response");
assert.match(todayRouteSource, /new URL\("\/", request\.url\)/, "duplicate Today route should redirect to the homepage canonical");
assert.match(todayRouteSource, /,\s*301\s*\)/, "duplicate Today route should return a permanent 301 redirect");
assert.equal(
  sitemapSource.includes('"/linkedin-wend-answer-today"'),
  false,
  "sitemap must not include the duplicate Today URL",
);
assert.match(
  smokeSource,
  /path:\s*"\/linkedin-wend-answer-today",\s*status:\s*301,\s*destinationPath:\s*"\/"/,
  "local smoke should verify the duplicate Today URL as a 301 redirect",
);
assert.equal(
  indexNowSource.includes("`${siteUrl}/linkedin-wend-answer-today`"),
  false,
  "IndexNow must not submit the duplicate Today URL",
);

for (const file of [
  "src/components/Header.tsx",
  "src/components/BottomNav.tsx",
  "src/components/RelatedGames.tsx",
  "src/lib/puzzles.ts",
  "src/app/error.tsx",
  "src/app/not-found.tsx",
  "src/app/faq/page.tsx",
  "src/app/how-to-play-linkedin-wend/page.tsx",
  "src/app/linkedin-wend-solver/page.tsx",
  "src/app/linkedin-zip-answer-today/page.tsx",
  "src/app/linkedin-patches-answer-today/page.tsx",
  "src/app/[slug]/page.tsx",
  "src/app/where-is-linkedin-wend/page.tsx",
  "src/app/page.tsx",
]) {
  assert.doesNotMatch(
    fs.readFileSync(path.join(root, file), "utf8"),
    /href=["']\/linkedin-wend-answer-today(?:#answer)?["']/,
    `${file} should link directly to the homepage canonical`,
  );
}

console.log("seo routes test passed");
