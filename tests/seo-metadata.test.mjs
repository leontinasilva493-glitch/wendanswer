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
  /Wend Answer Today - \$\{heroWend\.dateLabel\} \| Wend #\$\{heroWend\.puzzleNumber\} Answer/,
  "homepage title should include the displayed date and puzzle number",
);
assert.match(
  homeSource,
  /Wend answer today for \$\{heroWend\.dateLabel\} puzzle no \$\{heroWend\.puzzleNumber\}/,
  "homepage description should include the dynamic hero search phrase",
);
assert.match(
  homeSource,
  /wend answer today[\s\S]*wend answers[\s\S]*wend full answer[\s\S]*wend answer for date[\s\S]*wend answer for LinkedIn Games/,
  "homepage should include the requested keyword set",
);
assert.match(homeSource, /absoluteTitle:\s*true/, "homepage title should render as the exact requested title");
assert.doesNotMatch(homeSource, /todayWend\.grid\.flatMap/, "homepage should not show a fake interactive grid preview");
assert.doesNotMatch(homeSource, /Today Snapshot/, "homepage should not add a separate snapshot card");
assert.doesNotMatch(homeSource, /Wend plan/i, "homepage should not add a separate plan card");
assert.doesNotMatch(homeSource, /wend-unlimited/, "homepage should not promote paused practice mode");
assert.match(homeSource, /max-w-4xl py-12 text-center/, "homepage hero should use a centered single-column layout");
assert.match(
  homeSource,
  /Wend answer today for \{heroWend\.dateLabel\} puzzle no \{heroWend\.puzzleNumber\}/,
  "homepage H1 should use the displayed one-sentence Wend answer phrase",
);
assert.match(
  homeSource,
  /Wend #\{heroWend\.puzzleNumber\} answer/,
  "homepage status bar should include the dynamic Wend number query",
);
assert.match(homeSource, /<WendAnswerReveal archived=\{!wendReady\} puzzle=\{displayWend\}/, "homepage should surface the real answer reveal module with latest verified fallback support");
assert.match(homeSource, /Get Today's Answer/, "homepage primary CTA should jump to the answer reveal");
assert.match(homeSource, /Start with a Hint/, "homepage secondary CTA should jump to spoiler-safe hints");
for (const secondaryGame of ["Patches", "Zip", "Tango", "Queens", "Mini Sudoku", "Pinpoint", "Crossclimb"]) {
  assert.equal(homeSource.includes(secondaryGame), false, `homepage should not promote ${secondaryGame}`);
}

const answerRevealSource = read("src/components/WendAnswerReveal.tsx");
assert.match(answerRevealSource, /Today's LinkedIn Wend Answer/, "answer reveal should use the homepage module heading");
assert.match(answerRevealSource, /Reveal all/, "answer reveal should include the full reveal action");
assert.match(answerRevealSource, /Clear all/, "answer reveal should include the reset action");
assert.match(answerRevealSource, /Reveal Word/, "answer reveal should reveal one word at a time");

const todayWendSource = read("src/app/linkedin-wend-answer-today/page.tsx");
assert.match(todayWendSource, /generateMetadata/, "today page should generate metadata from current Wend readiness");
assert.match(todayWendSource, /LinkedIn Wend Answer Today - \$\{todayWend\.dateLabel\}/, "today page title should include date when the puzzle is verified");
assert.match(todayWendSource, /Wend #\$\{todayWend\.puzzleNumber\}/, "today page metadata should include the puzzle number when verified");
assert.match(todayWendSource, /revalidate\s*=\s*60/, "today page should use ISR instead of force-dynamic rendering");

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
assert.match(ogRoute, /\/images\/wend-logo-64\.png/, "OG image should use the small logo asset to stay under Edge size limits");
assert.doesNotMatch(ogRoute, /site\.logo\.src/, "OG route should avoid importing the full site config into the Edge function");

const sitemapSource = read("src/app/sitemap.ts");
for (const excluded of [
  "/linkedin-patches-answer-today",
  "/linkedin-patches-archive",
  "/linkedin-zip-answer-today",
  "/linkedin-zip-solver",
  "/wend-unlimited",
]) {
  assert.equal(
    sitemapSource.includes(`"${excluded}"`),
    false,
    `sitemap should not include noindex sample route ${excluded}`,
  );
}
assert.match(sitemapSource, /priorityForPath/, "sitemap should use route-specific priorities");

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
  ["src/app/linkedin-wend-answer-today/page.tsx", 68],
  ["src/app/linkedin-wend-solver/page.tsx", 68],
  ["src/app/[slug]/page.tsx", 68],
]) {
  const source = read(file);
  const longStaticTitle = source.match(/title:\s*`([^`]+)`/)?.[1] ?? "";
  assert.ok(longStaticTitle.length <= maxLength, `${file} title template is too long before date interpolation`);
}

console.log("seo metadata test passed");
