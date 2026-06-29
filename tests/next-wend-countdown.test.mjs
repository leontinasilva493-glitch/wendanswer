import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

const component = read("src/components/NextWendCountdown.tsx");
const homePage = read("src/app/page.tsx");
const statusLib = read("src/lib/wend-status.ts");

assert.match(component, /"use client"/, "countdown must run client-side so seconds update after hydration");
assert.match(component, /LinkedIn Wend #\{puzzleNumber\} unlocks in/, "countdown should expose a concise next-puzzle heading");
assert.match(component, /Next Wend answer for \{dateLabel\}/, "countdown should expose the next answer date");
assert.match(component, /expected at 8:00 UTC/, "countdown should show the public Wend release-time expectation");
assert.match(component, /Hours/, "countdown should include an hours box");
assert.match(component, /Minutes/, "countdown should include a minutes box");
assert.match(component, /Seconds/, "countdown should include a seconds box");
assert.match(component, /releaseAtIso/, "countdown should receive a server-computed release timestamp");
assert.match(component, /useEffect/, "countdown should update after mount");
assert.match(component, /setInterval/, "countdown should tick every second");
assert.match(component, /flex max-w-4xl flex-col items-center text-center/, "countdown should use stacked centered layout");
assert.doesNotMatch(component, /lg:grid-cols/, "countdown should not revert to desktop left-right columns");
assert.doesNotMatch(component, /tomorrow's Wend answer and next-puzzle searches/, "countdown copy should stay concise");

assert.match(statusLib, /export function nextWendRelease/, "status lib should expose the next Wend release time");
assert.match(statusLib, /export function nextWendDisplay/, "status lib should expose the next Wend display metadata");
assert.match(statusLib, /WEND_RELEASE_HOUR_UTC = 8/, "next Wend display must be tied to the 8:00 UTC release rule");

assert.match(homePage, /NextWendCountdown/, "homepage should render the next Wend countdown module");
assert.match(homePage, /nextWendDisplay/, "homepage should compute next date and puzzle number from shared status logic");
assert.ok(
  homePage.indexOf("<NextWendCountdown") < homePage.indexOf("All Wend Answers"),
  "countdown should sit before the full archive block",
);
