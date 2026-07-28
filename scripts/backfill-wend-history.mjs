import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  parseSecondaryAnswerData,
  preparePublicPuzzle,
} from "./wend-source-verification.mjs";
import { validateWendPuzzle } from "./validate-wend-puzzle.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const primarySourceUrl = "https://wendanswertoday.me/archive";
const defaultSecondarySourceUrl = "https://wendgames.org/src/answers-data.js";
const approvedPuzzleNumbers = new Set([
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 37, 39, 40, 41, 43, 46,
]);
const auditedSecondaryOverrides = new Map([
  [
    7,
    {
      date: "2026-06-15",
      puzzleNumber: 7,
      sourceUrl: "https://www.followchain.org/linkedin-wend-answer-today-june-15-2026/",
      words: ["SIX", "SCALE", "SPLASH", "CONSIST"],
    },
  ],
  [
    9,
    {
      date: "2026-06-17",
      puzzleNumber: 9,
      sourceUrl: "https://wendanswer.com/archive/9",
      words: ["HOLE", "MAGIC", "CHERRY", "PANTHER"],
    },
  ],
]);

function attr(source, name) {
  return source.match(new RegExp(`${name}=["']([^"']*)["']`, "i"))?.[1];
}

function dateFromLabel(dateLabel) {
  const parsed = new Date(`${dateLabel} 00:00:00 UTC`);
  if (Number.isNaN(parsed.getTime())) throw new Error(`Unable to parse Wend date label: ${dateLabel}`);
  return parsed.toISOString().slice(0, 10);
}

function archiveItem(html, puzzleNumber) {
  const itemPattern = new RegExp(`<div\\b[^>]*id=["']archive-puzzle-${puzzleNumber}["'][^>]*>`, "i");
  const match = itemPattern.exec(html);
  if (!match) throw new Error(`Unable to find archive item for Wend #${puzzleNumber}.`);

  const remainder = html.slice(match.index + match[0].length);
  const nextItem = /<div\b[^>]*class=["'][^"']*\barchive-puzzle-item\b[^"']*["'][^>]*>/i.exec(remainder);
  return html.slice(match.index, nextItem ? match.index + match[0].length + nextItem.index : html.length);
}

function editorialFields(dateLabel, answers) {
  const shortest = answers.reduce((best, answer) => (answer.word.length < best.word.length ? answer : best), answers[0]);
  const longest = answers.reduce((best, answer) => (answer.word.length > best.word.length ? answer : best), answers[0]);
  const allSameLength = answers.every((answer) => answer.word.length === shortest.word.length);
  const words = answers.map((answer) => answer.word).join(", ");

  return {
    difficulty: "Medium",
    hints: [
      {
        level: 1,
        title: "Gentle nudge",
        text: `Start with ${shortest.word}; it is one of the shortest paths on this board.`,
      },
      {
        level: 2,
        title: "Direction clue",
        text: "Use the blocked cells to split the board into lanes, then trace only orthogonally adjacent letters.",
      },
      {
        level: 3,
        title: "Almost there",
        text: allSameLength
          ? `All ${answers.length} answer paths have the same length, so use lane shape rather than word length.`
          : `${longest.word} is the longest path; place the shorter answers before committing to it.`,
      },
    ],
    explanation: `The ${dateLabel} Wend solution uses every open cell exactly once across ${words}. The stored paths follow only horizontal or vertical neighbors and never enter a blocked cell.`,
    quickHint: `Locate ${shortest.word} first, then use the remaining open lanes to constrain the other paths.`,
    fastTip: allSameLength
      ? "When every answer has the same length, solve the edge lanes first and leave the most flexible center route until last."
      : `Confirm ${shortest.word} first; removing that short route makes ${longest.word} easier to place.`,
    commonMistake: `Do not force ${longest.word} through a diagonal move; every Wend step must be horizontal or vertical.`,
    difficultyNote: allSameLength
      ? `Medium because all ${answers.length} answers have the same length and the board shape must separate them.`
      : `Medium because the answer lengths range from ${shortest.word.length} to ${longest.word.length} letters and every open cell must be assigned once.`,
  };
}

export function extractArchivePuzzle(html, puzzleNumber, capturedAt = new Date().toISOString()) {
  const source = archiveItem(html, puzzleNumber);
  const headingNumber = Number(source.match(/<h2[^>]*>\s*Wend\s+#(\d+)\s*<\/h2>/i)?.[1]);
  const dateLabel = source.match(/class=["'][^"']*puzzle-date[^"']*["'][^>]*>\s*([^<]+?)\s*</i)?.[1]?.trim();
  if (headingNumber !== puzzleNumber || !dateLabel) {
    throw new Error(`Archive metadata for Wend #${puzzleNumber} is incomplete.`);
  }

  const cellTags = [...source.matchAll(/<(button|div)\b([^>]*data-row=["'][^"']+["'][^>]*)>/gi)].map(
    (match) => match[2],
  );
  if (cellTags.length === 0) throw new Error(`Archive item for Wend #${puzzleNumber} has no puzzle cells.`);

  const cells = new Map();
  const wordPaths = new Map();
  for (const tag of cellTags) {
    const row = Number(attr(tag, "data-row"));
    const col = Number(attr(tag, "data-col"));
    if (!Number.isInteger(row) || !Number.isInteger(col)) continue;

    const key = `${row}-${col}`;
    if (cells.has(key)) continue;
    const letter = attr(tag, "data-cell-letter") || null;
    cells.set(key, { row, col, letter });

    const wordIndex = Number(attr(tag, "data-word-index"));
    const letterIndex = Number(attr(tag, "data-letter-index"));
    if (letter && Number.isInteger(wordIndex) && Number.isInteger(letterIndex)) {
      if (!wordPaths.has(wordIndex)) wordPaths.set(wordIndex, []);
      wordPaths.get(wordIndex)[letterIndex] = { letter, path: [row, col] };
    }
  }

  const maxRow = Math.max(...[...cells.values()].map((cell) => cell.row));
  const maxCol = Math.max(...[...cells.values()].map((cell) => cell.col));
  const grid = Array.from({ length: maxRow + 1 }, (_, row) =>
    Array.from({ length: maxCol + 1 }, (_, col) => cells.get(`${row}-${col}`)?.letter ?? null),
  );
  const answers = [...wordPaths.entries()]
    .sort(([left], [right]) => left - right)
    .map(([, steps]) => {
      if (steps.some((step) => !step)) throw new Error(`Archive item for Wend #${puzzleNumber} has an incomplete word path.`);
      return {
        word: steps.map((step) => step.letter).join(""),
        path: steps.map((step) => step.path),
      };
    });
  if (answers.length === 0) throw new Error(`Archive item for Wend #${puzzleNumber} has no answer paths.`);

  return {
    game: "wend",
    puzzleNumber,
    date: dateFromLabel(dateLabel),
    dateLabel,
    updatedAt: capturedAt,
    ...editorialFields(dateLabel, answers),
    grid,
    answers,
    relatedGames: ["patches", "zip", "tango", "queens"],
    isVerified: false,
  };
}

export function parseWendAnswerPageSecondary(source, expectedDate, expectedPuzzleNumber) {
  const normalized = source.replace(/\\+"/g, '"').replaceAll("&quot;", '"');
  const dateLabel = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
    year: "numeric",
  }).format(new Date(`${expectedDate}T00:00:00Z`));
  if (!normalized.includes(dateLabel) || !new RegExp(`Wend\\s+#${expectedPuzzleNumber}\\b`, "i").test(normalized)) {
    throw new Error(`Secondary Wend page does not identify ${dateLabel} / Wend #${expectedPuzzleNumber}.`);
  }

  const wordsSource = normalized.match(/"?answerWords"?\s*:\s*\[([^\]]+)\]/i)?.[1];
  const words = wordsSource ? [...wordsSource.matchAll(/"([^"]+)"/g)].map((match) => match[1]) : [];
  if (words.length === 0) throw new Error(`Secondary Wend page for #${expectedPuzzleNumber} has no answer words.`);
  return { date: expectedDate, puzzleNumber: expectedPuzzleNumber, words };
}

async function fetchText(url) {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, { headers: { "user-agent": "Mozilla/5.0 WendAnswerToday history verifier" } });
      if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`);
      return await response.text();
    } catch (error) {
      lastError = error;
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, attempt * 1_000));
    }
  }
  throw lastError;
}

function requestedNumbers(args) {
  const value = args.find((arg) => arg.startsWith("--numbers="))?.slice("--numbers=".length);
  if (!value) throw new Error("Pass an explicit --numbers=1,2,... allowlist for historical backfill.");
  const numbers = [...new Set(value.split(",").map(Number))];
  if (numbers.some((number) => !Number.isInteger(number) || !approvedPuzzleNumbers.has(number))) {
    throw new Error(`Historical backfill is restricted to: ${[...approvedPuzzleNumbers].join(", ")}.`);
  }
  return numbers.sort((left, right) => left - right);
}

async function main() {
  const numbers = requestedNumbers(process.argv.slice(2));
  const dryRun = process.argv.includes("--dry-run");
  const capturedAt = new Date().toISOString();
  const [archiveHtml, secondarySource] = await Promise.all([
    fetchText(primarySourceUrl),
    fetchText(defaultSecondarySourceUrl),
  ]);

  const verified = [];
  for (const puzzleNumber of numbers) {
    const extracted = extractArchivePuzzle(archiveHtml, puzzleNumber, capturedAt);
    let secondary;
    let corroboratingUrl = defaultSecondarySourceUrl;
    if (auditedSecondaryOverrides.has(puzzleNumber)) {
      const override = auditedSecondaryOverrides.get(puzzleNumber);
      corroboratingUrl = override.sourceUrl;
      secondary = {
        date: override.date,
        puzzleNumber: override.puzzleNumber,
        words: override.words,
      };
    } else {
      secondary = parseSecondaryAnswerData(secondarySource, extracted.date);
    }

    const puzzle = preparePublicPuzzle(extracted, secondary, {
      capturedAt,
      primarySourceUrl,
      secondarySourceUrl: corroboratingUrl,
    });
    validateWendPuzzle(puzzle, { expectedDate: puzzle.date });
    verified.push(puzzle);
    console.log(`Verified Wend #${puzzleNumber} (${puzzle.date}): ${puzzle.answers.map((answer) => answer.word).join(", ")}`);
  }

  if (dryRun) {
    console.log(`Dry run complete: ${verified.length} historical puzzles passed source quorum and geometry validation.`);
    return;
  }

  const outputDir = path.join(root, "data", "puzzles", "wend");
  for (const puzzle of verified) {
    const outputFile = path.join(outputDir, `${puzzle.date}.json`);
    fs.writeFileSync(outputFile, `${JSON.stringify(puzzle, null, 2)}\n`);
    console.log(`Wrote ${path.relative(root, outputFile)}`);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
