import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const seoSource = read("src/lib/seo.ts");
const siteSource = read("src/lib/site.ts");
const layoutSource = read("src/app/layout.tsx");
const headerSource = read("src/components/Header.tsx");
const footerSource = read("src/components/DisclaimerFooter.tsx");
for (const asset of [
  "public/images/wend-logo.png",
  "public/images/wend-logo-512.png",
  "public/images/wend-logo-192.png",
  "public/images/wend-logo-180.png",
  "public/images/wend-logo-128.png",
  "public/images/wend-logo-64.png",
]) {
  assert.equal(fs.existsSync(path.join(root, asset)), true, `${asset} should exist`);
}
assert.match(siteSource, /blue path W over yellow and white puzzle tiles logo/, "site config should describe the new logo");
assert.match(siteSource, /wend-logo-180\.png/, "site config should expose the apple touch logo");
assert.match(layoutSource, /wend-logo-64\.png/, "metadata should use the new PNG favicon");
assert.match(layoutSource, /site\.logo\.appleSrc/, "metadata should use the shared apple touch icon");
assert.match(headerSource, /site\.logo\.headerSrc/, "header should render the shared logo asset");
assert.match(footerSource, /site\.logo\.description/, "footer should describe the shared logo asset");
assert.match(seoSource, /images:\s*\[/, "pageMetadata should add Open Graph images");
assert.match(seoSource, /summary_large_image/, "Twitter card should use summary_large_image");
assert.match(seoSource, /publishedTime/, "pageMetadata should support article publishedTime");
assert.match(seoSource, /modifiedTime/, "pageMetadata should support article modifiedTime");
assert.match(seoSource, /robots\?/, "pageMetadata should support per-page robots settings");
assert.match(seoSource, /keywords\?/, "pageMetadata should support page keywords when supplied");
assert.match(seoSource, /absoluteTitle\?/, "pageMetadata should support exact homepage titles");

const homeSource = read("src/app/page.tsx");
assert.match(homeSource, /generateMetadata/, "homepage should generate metadata from the displayed Wend data state");
assert.match(homeSource, /displayWend/, "homepage should share one displayed puzzle source across hero and answer module");
assert.doesNotMatch(homeSource, /const heroWend = expectedWendDisplay/, "homepage hero should not advance by calendar before verified data exists");
assert.match(
  homeSource,
  /LinkedIn Wend Answer Today #\$\{heroWend\.puzzleNumber\} \u2014 \$\{heroWend\.dateLabel\}/,
  "homepage ready title should lead with LinkedIn Wend Answer Today and include the puzzle number and date",
);
assert.match(
  homeSource,
  /LinkedIn Wend Answer Today #\$\{heroWend\.puzzleNumber\} \u2014 \$\{shortDateLabel\(heroWend\.dateLabel\)\} \(Verifying\)/,
  "homepage pending title should stay query-focused while clearly marking verification",
);
assert.match(
  homeSource,
  /Get the verified LinkedIn Wend answer today for \$\{heroWend\.dateLabel\} \(Wend #\$\{heroWend\.puzzleNumber\}\)/,
  "homepage ready description should describe the verified answer and puzzle identity",
);
assert.match(
  homeSource,
  /The LinkedIn Wend answer for \$\{heroWend\.dateLabel\} \(Wend #\$\{heroWend\.puzzleNumber\}\) is being verified/,
  "homepage pending description should state that the expected answer is still being verified",
);
assert.match(
  homeSource,
  /linkedin wend[\s\S]*linkedin wend answer[\s\S]*wend linkedin[\s\S]*wend linkedin answer[\s\S]*wend answer today[\s\S]*wend answers[\s\S]*wend full answer[\s\S]*wend answer for date[\s\S]*wend answer for LinkedIn Games/,
  "homepage should include the requested LinkedIn Wend keyword set",
);
assert.match(homeSource, /absoluteTitle:\s*true/, "homepage title should render as the exact requested title");
assert.doesNotMatch(homeSource, /todayWend\.grid\.flatMap/, "homepage should not show a fake interactive grid preview");
assert.doesNotMatch(homeSource, /Today Snapshot/, "homepage should not add a separate snapshot card");
assert.doesNotMatch(homeSource, /Wend plan/i, "homepage should not add a separate plan card");
assert.doesNotMatch(homeSource, /wend-unlimited/, "homepage should not promote paused practice mode");
assert.match(homeSource, /max-w-4xl py-12 text-center/, "homepage hero should use a centered single-column layout");
assert.match(
  homeSource,
  /LinkedIn Wend Answer Today #\{heroWend\.puzzleNumber\} \u2014 \{heroWend\.dateLabel\}/,
  "homepage H1 should match the core LinkedIn Wend answer title in both states",
);
const normalizedHomeSource = homeSource.replace(/\s+/g, " ");
for (const expected of [
  "LinkedIn Wend hints without full spoilers",
  "How today’s LinkedIn Wend answer is solved",
  "LinkedIn Wend questions and answers",
  "What is the LinkedIn Wend game?",
  "How to use today’s LinkedIn Wend answer",
  "A practical Wend solving checklist",
  "How we verify each LinkedIn Wend answer",
  "Where to play the LinkedIn Wend game",
  "Recent LinkedIn Wend Answers",
]) {
  assert.match(homeSource, new RegExp(expected), `homepage should include ${expected}`);
}
assert.match(
  homeSource,
  /Wend #\{heroWend\.puzzleNumber\} \{wendReady \? "answer" : "status"\}/,
  "homepage status bar should distinguish current answer and pending status",
);
assert.match(homeSource, /data-nosnippet=\{!wendReady/, "homepage should keep fallback answer details out of pending-state search snippets");
assert.match(homeSource, /<WendAnswerReveal archived=\{!wendReady\} latestVerified=\{!wendReady\} puzzle=\{displayWend\}/, "homepage should surface the real answer reveal module with latest verified fallback support");
assert.match(homeSource, /Get Today's Answer/, "homepage primary CTA should jump to the answer reveal");
assert.match(homeSource, /Official Wend Game/, "homepage secondary CTA should open the official Wend game");
assert.match(homeSource, /href="https:\/\/www\.linkedin\.com\/games\/wend"/, "homepage secondary CTA should use the official Wend game URL");
assert.match(homeSource, /rel="noopener noreferrer"/, "homepage official game CTA should use safe external-link attributes");
assert.doesNotMatch(homeSource, /nofollow/, "homepage should not nofollow the trusted official LinkedIn Wend source");
assert.match(homeSource, /target="_blank"/, "homepage official game CTA should open in a new tab");
for (const secondaryGame of ["Patches", "Zip", "Tango", "Queens", "Mini Sudoku", "Pinpoint", "Crossclimb"]) {
  assert.equal(homeSource.includes(secondaryGame), false, `homepage should not promote ${secondaryGame}`);
}

const answerRevealSource = read("src/components/WendAnswerReveal.tsx");
assert.match(answerRevealSource, /Today's LinkedIn Wend Answer/, "answer reveal should use the homepage module heading");
assert.match(answerRevealSource, /Latest verified LinkedIn Wend answer/, "answer reveal should label pending fallback content precisely");
assert.match(answerRevealSource, /Reveal all/, "answer reveal should include the full reveal action");
assert.match(answerRevealSource, /Clear all/, "answer reveal should include the reset action");
assert.match(answerRevealSource, /Not revealed/, "answer reveal should avoid repeating hidden-word filler text");
assert.match(answerRevealSource, /Next letter/, "answer reveal should offer a concise letter action");
assert.match(answerRevealSource, /Show word/, "answer reveal should offer a concise word action");
assert.match(answerRevealSource, /aria-label=\{`Reveal next letter/, "answer reveal should retain a descriptive accessible letter label");
assert.match(answerRevealSource, /aria-label=\{`Reveal answer word/, "answer reveal should retain a descriptive accessible word label");

for (const expected of [
  "Open the official LinkedIn Wend game",
  "This page is a spoiler-safe companion to the official Wend game",
  "The help controls are ordered from the lightest clue to the strongest reveal",
  "Before using a reveal, scan the board as a set of constrained routes rather than a normal word search",
  "Compare the unsolved cells with the remaining word lengths after every confirmed path",
  "Every published LinkedIn Wend answer is tied to one puzzle number and one Pacific Time date",
  "WendAnswerToday.org is an independent, fan-made help site",
  "The archive groups every verified LinkedIn Wend answer by puzzle number and date",
  "Why does the page say verification pending?",
  "Where can I find older LinkedIn Wend answers?",
]) {
  assert.match(normalizedHomeSource, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), `homepage should include approved copy: ${expected}`);
}
assert.doesNotMatch(homeSource, /Why is today's solution valid\?/, "homepage FAQ must not call a fallback puzzle today's solution");
for (const path of ["/where-is-linkedin-wend", "/how-to-play-linkedin-wend", "/linkedin-wend-solver", "/linkedin-wend-archive"]) {
  assert.match(homeSource, new RegExp(`href="${path}"`), `homepage long-form copy should link to ${path}`);
}

const archiveSource = read("src/app/linkedin-wend-archive/page.tsx");
assert.match(archiveSource, /All LinkedIn Wend Answers/, "archive page should label the answer list with LinkedIn Wend");
assert.match(archiveSource, /Browse LinkedIn Wend by month/, "archive page should label month browsing with LinkedIn Wend");

const archiveDetailSource = read("src/app/[slug]/page.tsx");
assert.match(archiveDetailSource, /LinkedIn Wend spoiler-safe hints/, "archive detail hints H2 should include LinkedIn Wend");
assert.match(archiveDetailSource, /LinkedIn Wend answer explanation/, "archive detail explanation H2 should include LinkedIn Wend answer");
assert.match(archiveDetailSource, /Archived LinkedIn Wend FAQ/, "archive detail FAQ H2 should include LinkedIn Wend");

const solverPageSource = read("src/app/linkedin-wend-solver/page.tsx");
assert.match(solverPageSource, /LinkedIn Wend Solver FAQ/, "solver FAQ H2 should include LinkedIn Wend");

const faqPageSource = read("src/app/faq/page.tsx");
assert.match(faqPageSource, /title:\s*"LinkedIn Wend FAQ"/, "FAQ metadata title should target LinkedIn Wend FAQ");
assert.match(faqPageSource, /LinkedIn Wend FAQ/, "FAQ H1 should target LinkedIn Wend FAQ");
assert.match(faqPageSource, /Wend LinkedIn answer site/, "FAQ should include one natural exact-ish Wend LinkedIn answer phrase");

const relatedGamesSource = read("src/components/RelatedGames.tsx");
assert.doesNotMatch(relatedGamesSource, /wend-unlimited/, "related links should not promote paused practice mode");
for (const secondaryGame of ["Patches", "Zip", "Tango", "Queens", "Mini Sudoku", "Pinpoint", "Crossclimb"]) {
  assert.equal(relatedGamesSource.includes(secondaryGame), false, `related links should not promote ${secondaryGame}`);
}

const llmsSource = read("public/llms.txt");
assert.doesNotMatch(llmsSource, /wend-unlimited/, "llms.txt should not promote paused practice mode");
for (const secondaryGame of ["Patches", "Zip", "Tango", "Queens", "Mini Sudoku", "Pinpoint", "Crossclimb"]) {
  assert.equal(llmsSource.includes(secondaryGame), false, `llms.txt should not promote ${secondaryGame}`);
}

const ogRoute = read("src/app/api/og/route.tsx");
assert.match(ogRoute, /ImageResponse/, "OG route should generate images with ImageResponse");
assert.match(ogRoute, /width:\s*1200/, "OG image width should be 1200");
assert.match(ogRoute, /height:\s*630/, "OG image height should be 630");
assert.match(ogRoute, /wendanswertoday\.org/, "OG image should include the final domain");
assert.match(ogRoute, /site\.logo\.src/, "OG image should render the shared logo asset");

const sitemapSource = read("src/app/sitemap.ts");
for (const excluded of [
  "/linkedin-patches-answer-today",
  "/linkedin-patches-archive",
  "/linkedin-zip-answer-today",
  "/linkedin-zip-solver",
  "/wend-unlimited",
  "/linkedin-wend-answer-today",
]) {
  assert.equal(
    sitemapSource.includes(`"${excluded}"`),
    false,
    `sitemap should not include noindex sample route ${excluded}`,
  );
}
assert.match(sitemapSource, /priorityForPath/, "sitemap should use route-specific priorities");
assert.match(sitemapSource, /new Date\(todayWend\.updatedAt\)/, "daily sitemap pages should use the latest verified content timestamp");
assert.doesNotMatch(sitemapSource, /lastModified:\s*new Date\(\)/, "sitemap must not pretend every static page changed on every request");

for (const file of [
  "src/app/linkedin-patches-answer-today/page.tsx",
  "src/app/linkedin-patches-archive/page.tsx",
  "src/app/linkedin-zip-answer-today/page.tsx",
  "src/app/linkedin-zip-solver/page.tsx",
  "src/app/wend-unlimited/page.tsx",
]) {
  const source = read(file);
  assert.match(source, /robots:\s*noindexFollow/, `${file} should be noindex,follow until daily data is verified`);
}

for (const [file, maxLength] of [
  ["src/app/linkedin-wend-solver/page.tsx", 68],
  ["src/app/[slug]/page.tsx", 68],
]) {
  const source = read(file);
  const longStaticTitle = source.match(/title:\s*`([^`]+)`/)?.[1] ?? "";
  assert.ok(longStaticTitle.length <= maxLength, `${file} title template is too long before date interpolation`);
}

console.log("seo metadata test passed");
