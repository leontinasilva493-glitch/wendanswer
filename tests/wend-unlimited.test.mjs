import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { validateWendPuzzle } from "../scripts/validate-wend-puzzle.mjs";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const exists = (file) => fs.existsSync(path.join(root, file));

const unlimitedFile = "data/puzzles/wend-unlimited/puzzles.json";
assert.equal(exists(unlimitedFile), true, "Wend Unlimited should ship a pregenerated puzzle bank");

const puzzles = JSON.parse(read(unlimitedFile));
assert.equal(Array.isArray(puzzles), true, "Wend Unlimited puzzle bank should be an array");
assert.ok(puzzles.length >= 50, "Wend Unlimited should include at least 50 pregenerated puzzles");
assert.ok(puzzles.length <= 100, "Wend Unlimited MVP should stay within the 50-100 puzzle target");

const puzzleNumbers = new Set();
const puzzleFingerprints = new Set();

function hasTurn(pathCells) {
  for (let index = 2; index < pathCells.length; index += 1) {
    const [aRow, aCol] = pathCells[index - 2];
    const [bRow, bCol] = pathCells[index - 1];
    const [cRow, cCol] = pathCells[index];
    const firstDirection = [bRow - aRow, bCol - aCol].join(",");
    const secondDirection = [cRow - bRow, cCol - bCol].join(",");
    if (firstDirection !== secondDirection) return true;
  }
  return false;
}

function openingDirection(pathCells) {
  if (pathCells.length < 2) return "0,0";
  const [startRow, startCol] = pathCells[0];
  const [nextRow, nextCol] = pathCells[1];
  return [nextRow - startRow, nextCol - startCol].join(",");
}

for (const puzzle of puzzles) {
  validateWendPuzzle(puzzle);
  assert.match(puzzle.date, /^unlimited-\d{3}$/, "Unlimited puzzles should not masquerade as daily LinkedIn dates");
  assert.match(puzzle.dateLabel, /^Unofficial Practice #\d+$/, "Unlimited puzzles should be labeled unofficial");
  assert.equal(puzzle.relatedGames.includes("wend-unlimited"), false, "Unlimited puzzle data should not self-link as a related daily game");
  assert.ok(
    puzzle.grid.flat().some((cell) => cell === null),
    `Puzzle ${puzzle.puzzleNumber} should include blocked obstacle cells`,
  );
  assert.ok(
    puzzle.answers.every((answer) => hasTurn(answer.path)),
    `Puzzle ${puzzle.puzzleNumber} should make every answer turn at least once`,
  );
  assert.ok(
    new Set(puzzle.answers.map((answer) => openingDirection(answer.path))).size >= Math.min(3, puzzle.answers.length),
    `Puzzle ${puzzle.puzzleNumber} should open words in multiple directions like a real Wend board`,
  );

  const fingerprint = JSON.stringify({ grid: puzzle.grid, answers: puzzle.answers });
  assert.equal(puzzleFingerprints.has(fingerprint), false, `Puzzle ${puzzle.puzzleNumber} should be unique`);
  puzzleFingerprints.add(fingerprint);

  assert.equal(puzzleNumbers.has(puzzle.puzzleNumber), false, `Puzzle number ${puzzle.puzzleNumber} should be unique`);
  puzzleNumbers.add(puzzle.puzzleNumber);
}

const unlimitedLibSource = read("src/lib/wend-unlimited.ts");
assert.match(unlimitedLibSource, /unlimitedWendPuzzles/, "Unlimited library should expose the verified puzzle bank");
assert.doesNotMatch(unlimitedLibSource, /todayWend/, "Unlimited library should not derive games from today's Wend");

const gameSource = read("src/components/WendUnlimitedGame.tsx");
for (const expected of ["useState", "Next Puzzle", "Previous Puzzle", "New Puzzle", "Choose Puzzle", "Difficulty", "Saved locally"]) {
  assert.match(gameSource, new RegExp(expected), `Unlimited game should include ${expected}`);
}
assert.match(gameSource, /WendPlayableGame/, "Unlimited game should render the playable submit interaction");
assert.doesNotMatch(gameSource, /WendSolver/, "Unlimited game should not use the answer reveal solver as the primary game");
assert.match(gameSource, /Unofficial practice tool/, "Unlimited game UI should visibly say Unofficial");

assert.equal(exists("src/components/WendPlayableGame.tsx"), true, "Unlimited should have a dedicated playable Wend component");
const playableSource = read("src/components/WendPlayableGame.tsx");
for (const expected of [
  "Submit Word",
  "Clear Path",
  "Undo",
  "Hint",
  "Share result",
  "Solved",
  "selectedCells",
  "foundWords",
  "Words found",
  "data-testid=\"wend-unlimited-status\"",
  "WendGrid",
]) {
  assert.match(playableSource, new RegExp(expected), `Playable Unlimited game should include ${expected}`);
}
assert.doesNotMatch(playableSource, /Reveal Full Path|Reveal One Word|Reveal One Letter/, "Playable Unlimited game should not expose solver reveal controls");

const gridSource = read("src/components/WendGrid.tsx");
assert.match(gridSource, /translate="no"/, "WendGrid should opt puzzle cells out of browser translation overlays");
assert.match(gridSource, /notranslate/, "WendGrid should use the Google Translate notranslate class on puzzle cells");
assert.match(gridSource, /data-letter=\{letter\}/, "WendGrid should render puzzle letters through non-translatable data attributes");
assert.match(gridSource, /selectedCells\?/, "WendGrid should support selected gameplay cells without revealing answers");
assert.match(gridSource, /wend-cell-selected/, "WendGrid should style selected gameplay cells");
assert.doesNotMatch(gridSource, /aria-label=\{`Letter /, "WendGrid should not put verbose translatable labels on every letter cell");
assert.doesNotMatch(
  gridSource,
  /wend-cell-letter-text[^>]*>\{letter\}<\/span>/,
  "WendGrid should not expose puzzle letters as text nodes that browser translation can rewrite",
);
const cssSource = read("src/app/globals.css");
assert.match(cssSource, /content:\s*attr\(data-letter\)/, "WendGrid letters should be painted from CSS generated content");

const pageSource = read("src/app/wend-unlimited/route.ts");
assert.match(pageSource, /NextResponse\.redirect/, "Legacy unlimited route should redirect to the canonical tool page");
assert.match(pageSource, /308/, "Legacy unlimited route should use a permanent redirect");

const canonicalSource = read("src/app/play-wend/page.tsx");
assert.match(canonicalSource, /Play Wend Unlimited/, "Canonical page should be presented as Play Wend Unlimited");
assert.match(canonicalSource, /wend game online/i, "Canonical page should target the wend game online intent");
assert.match(canonicalSource, /no login/i, "Canonical page should disclose no-login play");
assert.match(canonicalSource, /local progress/i, "Canonical page should mention local progress");
assert.match(canonicalSource, /How to play/i, "Canonical page should include a how-to section");
assert.match(canonicalSource, /Official Wend vs Play Wend Unlimited/i, "Canonical page should include the official compare section");
assert.match(canonicalSource, /Today Answer/i, "Canonical page should link to today's answer");
assert.match(canonicalSource, /unlimitedWendPuzzles/, "Canonical page should load the pregenerated bank");
assert.doesNotMatch(canonicalSource, /noindexFollow/, "Canonical page should be indexable");

console.log("wend unlimited test passed");
