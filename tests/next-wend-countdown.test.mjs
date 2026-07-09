import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

const component = read("src/components/NextWendCountdown.tsx");
const ticker = read("src/components/NextWendCountdownTicker.tsx");
const homePage = read("src/app/page.tsx");
const statusLib = read("src/lib/wend-status.ts");

assert.doesNotMatch(component, /"use client"/, "countdown shell should stay server-rendered for SEO-visible copy");
assert.match(ticker, /"use client"/, "countdown ticker must run client-side so seconds update after hydration");
assert.match(component, /Next Wend #\$\{puzzleNumber\} unlocks in/, "countdown should expose a concise next-puzzle heading");
assert.match(component, /Expected \$\{dateLabel\} at 8:00 UTC/, "countdown should expose the next answer date");
assert.match(component, /placeholder\?: boolean/, "countdown should support a placeholder state");
assert.match(component, /max-w-\[760px\]/, "countdown should use the compact hero-card width");
assert.match(component, /shadow-lg shadow-slate-200\/60/, "countdown should keep the previous image-style soft card treatment");
assert.match(component, /px-5 py-4/, "countdown shell should keep reduced vertical padding inside the Hero");
assert.match(ticker, /Hours/, "countdown should include an hours box");
assert.match(ticker, /Minutes/, "countdown should include a minutes box");
assert.match(ticker, /Seconds/, "countdown should include a seconds box");
assert.match(ticker, /flex items-baseline justify-center gap-2/, "time value and unit should sit in one horizontal row");
assert.match(ticker, /px-3 py-3/, "time boxes should use reduced vertical padding");
assert.doesNotMatch(ticker, /mt-2 text-xs/, "time labels should not sit below the numbers");
assert.match(ticker, /releaseAtIso/, "countdown should receive a server-computed release timestamp");
assert.match(ticker, /useEffect/, "countdown should update after mount");
assert.match(ticker, /setInterval/, "countdown should tick every second");
assert.match(component, /<aside/, "countdown should render as a compact Hero aside");
assert.doesNotMatch(component, /lg:grid-cols/, "countdown should not revert to desktop left-right columns");
assert.doesNotMatch(component, /tomorrow's Wend answer and next-puzzle searches/, "countdown copy should stay concise");
assert.match(component, /Next Wend update placeholder/, "countdown should render a visible placeholder state when data is not ready");

assert.match(statusLib, /export function nextWendRelease/, "status lib should expose the next Wend release time");
assert.match(statusLib, /export function nextWendDisplay/, "status lib should expose the next Wend display metadata");
assert.match(statusLib, /WEND_RELEASE_HOUR_UTC = 8/, "next Wend display must be tied to the 8:00 UTC release rule");

assert.match(homePage, /NextWendCountdown/, "homepage should render the next Wend countdown module");
assert.match(homePage, /nextWendDisplay/, "homepage should compute next date and puzzle number from shared status logic");
assert.match(homePage, /placeholder=\{!wendReady\}/, "homepage should keep the countdown visible and switch to placeholder mode when data is missing");
assert.ok(
  homePage.indexOf("<NextWendCountdown") < homePage.indexOf('<section className="section" id="answer">'),
  "countdown should sit inside the Hero before the answer module",
);
