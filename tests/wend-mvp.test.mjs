import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const exists = (file) => fs.existsSync(path.join(root, file));

assert.equal(exists("src/components/WendAnswerReveal.tsx"), true, "Wend answer reveal component should exist");

const revealSource = exists("src/components/WendAnswerReveal.tsx")
  ? read("src/components/WendAnswerReveal.tsx")
  : "";
for (const expected of ["Show word", "Next letter", "Reveal all", "Clear all", "Today's LinkedIn Wend Answer"]) {
  assert.match(revealSource, new RegExp(expected, "i"), `WendAnswerReveal should include ${expected}`);
}
assert.match(revealSource, /visibleWords/, "WendAnswerReveal should track revealed words");
assert.match(revealSource, /visibleLetters/, "WendAnswerReveal should track revealed letters");
assert.match(revealSource, /Words found/, "WendAnswerReveal should show progress like the reference solver");
assert.match(revealSource, /wend-letter-bubble/, "WendAnswerReveal should render circular answer bubbles");
assert.match(revealSource, /WendGrid/, "WendAnswerReveal should reuse the existing Wend grid");
assert.match(revealSource, /content-card/, "WendAnswerReveal should use the shared section card style");
assert.match(revealSource, /section-icon/, "WendAnswerReveal should use an icon-led section header");

const globalCss = read("src/app/globals.css");
for (const expected of ["content-card", "section-heading", "section-icon", "inner-card"]) {
  assert.match(globalCss, new RegExp(expected), `global styles should define ${expected}`);
}
for (const expected of ["wend-word-card", "wend-letter-bubble", "wend-word-action", "max-width: 420px"]) {
  assert.match(globalCss, new RegExp(expected), `global styles should define ${expected}`);
}

const solverSource = read("src/components/WendSolver.tsx");
for (const expected of ["wend-word-card", "wend-letter-bubble", "wend-word-action", "Words found"]) {
  assert.match(solverSource, new RegExp(expected), `WendSolver should reuse the upgraded reveal UI: ${expected}`);
}

const packageJson = JSON.parse(read("package.json"));
for (const [groupName, group] of Object.entries({
  dependencies: packageJson.dependencies,
  devDependencies: packageJson.devDependencies,
})) {
  for (const [name, version] of Object.entries(group)) {
    assert.notEqual(version, "latest", `${groupName}.${name} should be pinned, not latest`);
    assert.doesNotMatch(version, /^[\^~]/, `${groupName}.${name} should use an exact version`);
  }
}

const homeSource = read("src/app/page.tsx");
assert.match(homeSource, /Open the official LinkedIn Wend game/, "Homepage hero should lead with a useful play, hint, and answer summary");
assert.match(homeSource, /<WendAnswerReveal archived=\{!wendReady\} latestVerified=\{!wendReady\} puzzle=\{displayWend\}/, "Homepage should place the real answer reveal under the hero with latest verified fallback support");
assert.doesNotMatch(homeSource, /Today Snapshot|Wend plan/i, "Homepage should not use a separate right-side plan or snapshot card");
assert.doesNotMatch(homeSource, /wend-unlimited/, "Homepage should not promote paused practice mode");

const archiveDetailSource = read("src/app/[slug]/page.tsx");
assert.match(archiveDetailSource, /WendAnswerReveal/, "History detail pages should use WendAnswerReveal");

const faqSource = read("src/app/faq/page.tsx");
for (const expected of [
  "Where is LinkedIn Wend",
  "Why can’t I see Wend",
  "LinkedIn Games not loading",
  "streak",
]) {
  assert.match(faqSource, new RegExp(expected), `FAQ should cover ${expected}`);
}

assert.equal(exists("src/app/where-is-linkedin-wend/page.tsx"), true, "Where-is-Wend access page should exist");
const whereSource = exists("src/app/where-is-linkedin-wend/page.tsx")
  ? read("src/app/where-is-linkedin-wend/page.tsx")
  : "";
for (const expected of ["Where is LinkedIn Wend", "linkedin.com/games/wend", "not showing", "mobile", "desktop"]) {
  assert.match(whereSource, new RegExp(expected, "i"), `Where-is page should cover ${expected}`);
}

const sitemapSource = read("src/app/sitemap.ts");
assert.match(sitemapSource, /\/where-is-linkedin-wend/, "sitemap should include the Wend access page");

for (const file of [
  "data/puzzles/wend/2026-06-24.json",
  "data/puzzles/wend/2026-06-23.json",
  "data/puzzles/wend/2026-06-22.json",
]) {
  const data = JSON.parse(read(file));
  assert.equal(typeof data.fastTip, "string", `${file} should include fastTip`);
  assert.equal(typeof data.commonMistake, "string", `${file} should include commonMistake`);
  assert.equal(typeof data.difficultyNote, "string", `${file} should include difficultyNote`);
}

const headerSource = read("src/components/Header.tsx");
const bottomNavSource = read("src/components/BottomNav.tsx");
assert.doesNotMatch(headerSource, /Practice/, "Practice should not be in the primary desktop nav");
assert.doesNotMatch(bottomNavSource, /Practice/, "Practice should not be in the primary mobile nav");

console.log("wend mvp test passed");
