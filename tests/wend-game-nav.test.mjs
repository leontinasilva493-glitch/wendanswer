import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const headerSource = read("src/components/Header.tsx");
const bottomNavSource = read("src/components/BottomNav.tsx");
const unlimitedSource = read("src/app/wend-unlimited/page.tsx");

assert.match(headerSource, /Wend Game/, "desktop nav should expose a Wend Game menu");
assert.match(
  headerSource,
  /https:\/\/www\.linkedin\.com\/games\/wend/,
  "Wend Game menu should include the official LinkedIn Wend link",
);
assert.match(headerSource, /Official/, "official Wend link should be labeled as official");
assert.match(headerSource, /\/wend-unlimited/, "Wend Game menu should link to the internal unlimited page");
assert.match(headerSource, /target="_blank"/, "official Wend link should open in a new tab");
assert.match(headerSource, /rel="nofollow noopener"/, "official Wend link should use safe external-link rel values");
assert.doesNotMatch(headerSource, /<details/, "Wend Game menu should not rely on native details state");
assert.doesNotMatch(headerSource, /<summary/, "Wend Game menu should not require a second click to close");
assert.match(headerSource, /AUTO_CLOSE_DELAY_MS\s*=\s*2500/, "Wend Game menu should auto-hide after a 2.5 second mouse-leave delay");
assert.match(headerSource, /onMouseEnter=\{openMenu\}/, "Wend Game menu should open on hover");
assert.match(headerSource, /onMouseLeave=\{scheduleCloseMenu\}/, "Wend Game menu should schedule close on mouse leave");
assert.match(headerSource, /onFocus=\{openMenu\}/, "Wend Game menu should open for keyboard focus");
assert.match(headerSource, /aria-expanded=\{isWendGameOpen\}/, "Wend Game menu trigger should expose expanded state");

assert.doesNotMatch(bottomNavSource, /Wend Game/, "mobile bottom nav should not add a Wend Game item in phase 1");
assert.doesNotMatch(bottomNavSource, /wend-unlimited/, "mobile bottom nav should keep the existing three-item structure");
assert.match(unlimitedSource, /robots:\s*noindexFollow/, "Wend Unlimited should remain noindex in phase 1");

console.log("wend game nav test passed");
