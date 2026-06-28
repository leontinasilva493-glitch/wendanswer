import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const exists = (file) => fs.existsSync(path.join(root, file));

const seoSource = read("src/lib/seo.ts");
assert.match(seoSource, /howToJson/, "SEO helper should expose HowTo schema generation");
assert.match(seoSource, /FAQPage/, "SEO helper should expose FAQPage schema generation");

for (const file of ["src/app/how-to-play-linkedin-wend/page.tsx", "src/app/how-to-solve-linkedin-wend/page.tsx"]) {
  const source = read(file);
  assert.match(source, /howToJson/, `${file} should emit HowTo schema`);
  assert.match(source, /<JsonLd/, `${file} should render structured data`);
}

const archiveDetail = read("src/app/[slug]/page.tsx");
assert.match(archiveDetail, /faqJson/, "archive detail pages should emit FAQPage schema");
assert.match(archiveDetail, /Archived Wend FAQ/, "archive detail pages should show visible FAQ content");
assert.match(archiveDetail, /FaqDetails/, "archive detail pages should use the shared FAQ disclosure component");

const todaySource = read("src/app/linkedin-wend-answer-today/page.tsx");
assert.match(todaySource, /expectedWendDisplay/, "Today page metadata should keep date and puzzle number even before verification");
assert.match(todaySource, /LinkedIn Wend Answer Today - \$\{expectedWend\.dateLabel\}/, "Today fallback title should include expected date");
assert.match(todaySource, /puzzle #\$\{expectedWend\.puzzleNumber\}/, "Today fallback description should include expected puzzle number");
assert.match(todaySource, /revalidate\s*=\s*60/, "Today page should use ISR");
assert.doesNotMatch(todaySource, /force-dynamic/, "Today page should not force dynamic rendering");

const homeSource = read("src/app/page.tsx");
assert.match(homeSource, /revalidate\s*=\s*60/, "Homepage should use ISR");
assert.doesNotMatch(homeSource, /force-dynamic/, "Homepage should not force dynamic rendering");

const nextConfig = read("next.config.ts");
assert.match(nextConfig, /Content-Security-Policy/, "Next config should send CSP headers");
assert.match(nextConfig, /Strict-Transport-Security/, "Next config should send HSTS headers");
assert.match(nextConfig, /plausible\.io/, "CSP should allow Plausible script and event requests");
assert.match(nextConfig, /poweredByHeader:\s*false/, "Next powered-by header should stay disabled");

assert.equal(exists("src/components/Analytics.tsx"), true, "analytics component should exist");
assert.equal(exists("src/lib/analytics.ts"), true, "analytics event helper should exist");
const layout = read("src/app/layout.tsx");
const analyticsComponent = read("src/components/Analytics.tsx");
const analyticsHelper = read("src/lib/analytics.ts");
assert.match(layout, /<Analytics \/>/, "root layout should load analytics once");
assert.match(analyticsComponent, /plausible\.io\/js\/script\.tagged-events\.js/, "analytics should use Plausible tagged events script");
assert.match(analyticsComponent, /NEXT_PUBLIC_PLAUSIBLE_DISABLED/, "analytics should have an environment kill switch");
assert.match(analyticsHelper, /trackEvent/, "analytics helper should expose custom event tracking");

const answerReveal = read("src/components/WendAnswerReveal.tsx");
const solver = read("src/components/WendSolver.tsx");
assert.match(answerReveal, /Wend Reveal/, "answer reveal should track reveal funnel events");
assert.match(solver, /Wend Solver Reveal/, "solver should track reveal funnel events");
assert.match(solver, /wend-answer-panel/, "solver controls should use the same compact panel styling as Today");
assert.match(solver, /grid gap-2 sm:grid-cols-2/, "solver answer cards should use the compact responsive grid");

const solverPage = read("src/app/linkedin-wend-solver/page.tsx");
assert.match(solverPage, /faqJson/, "solver page should emit FAQPage schema");
assert.match(solverPage, /FaqDetails/, "solver page should use the shared FAQ disclosure component");

assert.equal(exists("scripts/submit-indexnow.mjs"), true, "IndexNow submission script should exist");
assert.equal(exists("src/app/indexnow-key.txt/route.ts"), true, "IndexNow key route should exist");
const indexNowScript = read("scripts/submit-indexnow.mjs");
const indexNowRoute = read("src/app/indexnow-key.txt/route.ts");
const publishWorkflow = read(".github/workflows/publish-wend-daily.yml");
const packageJson = JSON.parse(read("package.json"));
assert.equal(packageJson.scripts["indexnow:submit"], "node scripts/submit-indexnow.mjs", "package should expose IndexNow submission");
assert.match(indexNowScript, /api\.indexnow\.org\/indexnow/, "IndexNow script should use the global endpoint by default");
assert.match(indexNowScript, /keyLocation/, "IndexNow script should submit the key location");
assert.match(indexNowScript, /urlList/, "IndexNow script should submit a URL set");
assert.match(indexNowRoute, /INDEXNOW_KEY/, "IndexNow key route should serve only the configured key");
assert.match(publishWorkflow, /npm run indexnow:submit/, "daily publish workflow should submit IndexNow after deploy checks");

const privacy = read("src/app/privacy-policy/page.tsx");
assert.match(privacy, /privacy-friendly analytics/, "privacy policy should describe analytics collection");
assert.match(privacy, /reveal button clicks/, "privacy policy should describe reveal click events");

console.log("growth guardrails test passed");
