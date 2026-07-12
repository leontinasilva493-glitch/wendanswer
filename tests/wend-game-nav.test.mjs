import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const headerSource = read("src/components/Header.tsx");
const bottomNavSource = read("src/components/BottomNav.tsx");
const unlimitedSource = read("src/app/wend-unlimited/page.tsx");

assert.match(headerSource, /Play Game/, "desktop nav should expose a concise Play Game menu");
assert.doesNotMatch(headerSource, /Wend Game/, "desktop nav should no longer use the longer Wend Game label");
assert.match(
  headerSource,
  /https:\/\/www\.linkedin\.com\/games\/wend/,
  "Play Game menu should include the official LinkedIn Wend link",
);
assert.match(headerSource, /Official/, "official Wend link should be labeled as official");
assert.match(headerSource, /Official Wend/, "official menu item should use the shortened Official Wend label");
assert.doesNotMatch(headerSource, /Play Official Wend/, "official menu item should not use the longer Play Official Wend label");
assert.match(headerSource, /Wend Unlimited/, "unlimited menu item should keep the Wend Unlimited label");
assert.match(headerSource, /\/wend-unlimited/, "Play Game menu should link to the internal unlimited page");
assert.match(headerSource, /target="_blank"/, "official Wend link should open in a new tab");
assert.match(headerSource, /rel="nofollow noopener"/, "official Wend link should use safe external-link rel values");
assert.doesNotMatch(headerSource, /href="\/where-is-linkedin-wend"/, "Find Wend should not remain a top-level desktop nav item");
assert.doesNotMatch(headerSource, /href="\/faq"/, "FAQ should not remain a top-level desktop nav item");

assert.doesNotMatch(bottomNavSource, /Play Game|Wend Game/, "mobile bottom nav should not add a game item");
assert.doesNotMatch(bottomNavSource, /wend-unlimited/, "mobile bottom nav should keep the existing three-item structure");
assert.doesNotMatch(unlimitedSource, /robots:\s*noindexFollow/, "Wend Unlimited should be indexable after the tool upgrade");
assert.match(unlimitedSource, /WendUnlimitedTool/, "Wend Unlimited should render the upgraded interactive tool");

console.log("wend game nav test passed");
