import { execFileSync, execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const startedAt = Date.now();
const MAX_PUBLISH_WINDOW_MS = Number(process.env.MAX_PUBLISH_WINDOW_MS || 5 * 60 * 1000);
const sourceUrl = process.env.WEND_DAILY_SOURCE_URL;
const inputFile = process.env.WEND_DAILY_INPUT_FILE;
const deployCommand = process.env.WEND_DEPLOY_COMMAND;
const allowUnverified = process.env.ALLOW_UNVERIFIED_WEND_PUBLISH === "true";

// Wend's daily target is 8:00 UTC. This script is designed to run immediately
// after that release and finish inside MAX_PUBLISH_WINDOW_MS.
const requiredFields = [
  "game",
  "puzzleNumber",
  "date",
  "dateLabel",
  "updatedAt",
  "difficulty",
  "grid",
  "hints",
  "answers",
  "explanation",
  "quickHint",
  "fastTip",
  "commonMistake",
  "difficultyNote",
  "relatedGames",
  "isVerified",
];

function utcDateStamp(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function run(command, args) {
  execFileSync(command, args, { cwd: root, stdio: "inherit" });
}

function capture(command, args) {
  return execFileSync(command, args, { cwd: root, encoding: "utf8" });
}

async function readSource() {
  if (sourceUrl) {
    const response = await fetch(sourceUrl, {
      headers: { accept: "application/json,text/html;q=0.9,*/*;q=0.8" },
    });
    if (!response.ok) {
      throw new Error(`WEND_DAILY_SOURCE_URL returned ${response.status}`);
    }
    return response.text();
  }

  const fallbackFile = inputFile || path.join(root, "data", "puzzles", "wend", `${utcDateStamp()}.json`);
  if (!fs.existsSync(fallbackFile)) {
    throw new Error(
      `No source found. Set WEND_DAILY_SOURCE_URL, WEND_DAILY_INPUT_FILE, or create ${path.relative(root, fallbackFile)}.`,
    );
  }
  return fs.readFileSync(fallbackFile, "utf8");
}

function extractJson(source) {
  const trimmed = source.trim();
  if (trimmed.startsWith("{")) return JSON.parse(trimmed);

  const scriptMatch = trimmed.match(
    /<script[^>]+id=["']wend-puzzle-data["'][^>]*>([\s\S]*?)<\/script>/i,
  );
  if (scriptMatch) return JSON.parse(scriptMatch[1]);

  throw new Error(
    "Unable to extract Wend JSON. Point WEND_DAILY_SOURCE_URL at a normalized official-page capture that returns the daily puzzle JSON.",
  );
}

function validatePuzzle(puzzle) {
  for (const field of requiredFields) {
    if (!(field in puzzle)) throw new Error(`Missing required Wend field: ${field}`);
  }
  if (puzzle.game !== "wend") throw new Error("Expected puzzle.game to be wend");
  if (!Array.isArray(puzzle.grid) || puzzle.grid.length === 0) throw new Error("Expected a non-empty grid");
  if (!Array.isArray(puzzle.answers) || puzzle.answers.length === 0) throw new Error("Expected at least one answer");
  if (!puzzle.isVerified && !allowUnverified) {
    throw new Error("Refusing to publish unverified Wend data. Set ALLOW_UNVERIFIED_WEND_PUBLISH=true only for private dry runs.");
  }
}

function writePuzzle(puzzle) {
  const outputDir = path.join(root, "data", "puzzles", "wend");
  fs.mkdirSync(outputDir, { recursive: true });
  const outputFile = path.join(outputDir, `${puzzle.date}.json`);
  if (fs.existsSync(outputFile)) {
    const existing = JSON.parse(fs.readFileSync(outputFile, "utf8"));
    if (JSON.stringify(existing) === JSON.stringify(puzzle)) {
      console.log(`No data changes for ${path.relative(root, outputFile)}`);
      return;
    }
  }
  fs.writeFileSync(outputFile, `${JSON.stringify(puzzle, null, 2)}\n`);
  console.log(`Wrote ${path.relative(root, outputFile)}`);
}

function runDeployCommand(command) {
  if (!command) return;
  execSync(command, { cwd: root, stdio: "inherit", shell: true });
}

function verifyLatestDate(expectedDate) {
  const output = capture(process.execPath, ["scripts/latest-date.mjs", "data/puzzles/wend", "--json"]);
  const result = JSON.parse(output);
  if (result.latestDate !== expectedDate) {
    throw new Error(`Expected latest Wend date ${expectedDate}, got ${result.latestDate}`);
  }
}

const source = await readSource();
const puzzle = extractJson(source);
validatePuzzle(puzzle);
writePuzzle(puzzle);
run(process.execPath, ["scripts/generate-wend-puzzles.mjs"]);
verifyLatestDate(puzzle.date);
run(process.execPath, ["tests/wend-archive-url.test.mjs"]);
runDeployCommand(deployCommand);

const elapsed = Date.now() - startedAt;
if (elapsed > MAX_PUBLISH_WINDOW_MS) {
  throw new Error(`Wend publish exceeded the ${MAX_PUBLISH_WINDOW_MS}ms target window; elapsed ${elapsed}ms.`);
}

console.log(`Wend publish completed in ${Math.round(elapsed / 1000)}s.`);
