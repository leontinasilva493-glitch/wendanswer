import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const exists = (file) => fs.existsSync(path.join(root, file));

const footerSource = read("src/components/DisclaimerFooter.tsx");
assert.match(footerSource, /href="\/press"/, "footer should link to the Press page");
assert.match(footerSource, />Press</, "footer should label the Press link clearly");

assert.equal(exists("src/app/press/page.tsx"), true, "Press page should exist");
const pressSource = exists("src/app/press/page.tsx") ? read("src/app/press/page.tsx") : "";
assert.match(pressSource, /title:\s*"Press"/, "Press page should define metadata title");
assert.match(pressSource, /External Links/, "Press page should include an external links section");
assert.match(pressSource, /Ko-fi Updates/, "Press page should include the Ko-fi link title");
assert.match(pressSource, /https:\/\/ko-fi\.com\/duckweed43816\/posts/, "Press page should include the Ko-fi URL");
assert.match(pressSource, /WendAnswer GitHub Repository/, "Press page should include the GitHub repository link title");
assert.match(
  pressSource,
  /https:\/\/github\.com\/leontinasilva493-glitch\/wendanswer/,
  "Press page should include the GitHub repository URL",
);
assert.match(pressSource, /Linktree/, "Press page should include the Linktree link title");
assert.match(pressSource, /https:\/\/linktr\.ee\/duckweed1014/, "Press page should include the Linktree URL");
assert.match(pressSource, /F6S Founder Profile/, "Press page should include the F6S profile link title");
assert.match(pressSource, /https:\/\/www\.f6s\.com\/leontina-silva/, "Press page should include the F6S profile URL");
assert.match(pressSource, /target="_blank"/, "external press links should open in a new tab");
assert.match(pressSource, /rel="nofollow noopener"/, "external press links should use safe rel values");
assert.match(pressSource, /About WendAnswerToday/, "Press page should include site context");
assert.match(pressSource, /Press Contact/, "Press page should include a contact section");

const sitemapSource = read("src/app/sitemap.ts");
assert.match(sitemapSource, /"\/press"/, "sitemap should include the Press page");

console.log("press page test passed");
