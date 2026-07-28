import assert from "node:assert/strict";
import {
  extractArchivePuzzle,
  parseWendAnswerPageSecondary,
} from "../scripts/backfill-wend-history.mjs";
import { preparePublicPuzzle } from "../scripts/wend-source-verification.mjs";
import { validateWendPuzzle } from "../scripts/validate-wend-puzzle.mjs";

const archiveHtml = `
<div class="archive-puzzle-item" id="archive-puzzle-2" data-puzzle-number="2">
  <h2>Wend #2</h2><span class="puzzle-date">June 10, 2026</span>
  <button data-row="0" data-col="0" data-word-index="0" data-letter-index="0" data-cell-letter="C"></button>
  <button data-row="0" data-col="1" data-word-index="0" data-letter-index="1" data-cell-letter="A"></button>
  <button data-row="0" data-col="2" data-word-index="0" data-letter-index="2" data-cell-letter="T"></button>
  <button data-row="1" data-col="0" data-word-index="1" data-letter-index="0" data-cell-letter="D"></button>
  <div data-row="1" data-col="1" class="wend-cell--blocked"></div>
  <button data-row="1" data-col="2" data-word-index="1" data-letter-index="4" data-cell-letter="S"></button>
  <button data-row="2" data-col="0" data-word-index="1" data-letter-index="1" data-cell-letter="O"></button>
  <button data-row="2" data-col="1" data-word-index="1" data-letter-index="2" data-cell-letter="G"></button>
  <button data-row="2" data-col="2" data-word-index="1" data-letter-index="3" data-cell-letter="S"></button>
</div>
<div class="archive-puzzle-item" id="archive-puzzle-1" data-puzzle-number="1">
  <h2>Wend #1</h2><span class="puzzle-date">June 9, 2026</span>
  <button data-row="0" data-col="0" data-word-index="0" data-letter-index="0" data-cell-letter="I"></button>
  <button data-row="0" data-col="1" data-word-index="0" data-letter-index="1" data-cell-letter="T"></button>
</div>`;

const puzzle = extractArchivePuzzle(archiveHtml, 2, "2026-07-28T00:00:00.000Z");
assert.equal(puzzle.puzzleNumber, 2);
assert.equal(puzzle.date, "2026-06-10");
assert.equal(puzzle.dateLabel, "June 10, 2026");
assert.deepEqual(puzzle.grid, [["C", "A", "T"], ["D", null, "S"], ["O", "G", "S"]]);
assert.deepEqual(puzzle.answers, [
  { word: "CAT", path: [[0, 0], [0, 1], [0, 2]] },
  { word: "DOGSS", path: [[1, 0], [2, 0], [2, 1], [2, 2], [1, 2]] },
]);
assert.doesNotThrow(() => validateWendPuzzle({ ...puzzle, isVerified: true }, { expectedDate: "2026-06-10" }));

assert.throws(() => extractArchivePuzzle(archiveHtml, 99), /archive item for Wend #99/);

const pageSecondary = parseWendAnswerPageSecondary(
  '<h1>Wend #9</h1><p>June 17, 2026</p>answerWords\\":[\\"HOLE\\",\\"MAGIC\\",\\"CHERRY\\",\\"PANTHER\\"]',
  "2026-06-17",
  9,
);
assert.deepEqual(pageSecondary, {
  date: "2026-06-17",
  puzzleNumber: 9,
  words: ["HOLE", "MAGIC", "CHERRY", "PANTHER"],
});

assert.throws(
  () => preparePublicPuzzle(puzzle, { date: puzzle.date, puzzleNumber: 2, words: ["CAT", "WRONG"] }),
  /answer words do not match/,
);

console.log("wend history backfill parser test passed");
