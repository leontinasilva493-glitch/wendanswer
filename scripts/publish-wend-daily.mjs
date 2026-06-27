import { execFileSync, execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { sendOpsAlert } from "./ops-alert.mjs";
import { validateWendPuzzle } from "./validate-wend-puzzle.mjs";

const root = process.cwd();
const startedAt = Date.now();
const MAX_PUBLISH_WINDOW_MS = Number(process.env.MAX_PUBLISH_WINDOW_MS || 5 * 60 * 1000);
const inputFile = process.env.WEND_DAILY_INPUT_FILE;
const defaultSourceUrl = process.env.WEND_DAILY_FALLBACK_SOURCE_URL || "https://wendanswertoday.me/";
const sourceUrl = process.env.WEND_DAILY_SOURCE_URL || (inputFile ? "" : defaultSourceUrl);
const deployCommand = process.env.WEND_DEPLOY_COMMAND;
const allowUnverified = process.env.ALLOW_UNVERIFIED_WEND_PUBLISH === "true";
const persistGeneratedData = process.env.WEND_PERSIST_TO_GIT === "true";
const expectedDate = process.env.WEND_EXPECTED_DATE || utcDateStamp();

// Wend's daily target is 8:00 UTC. This script is designed to run immediately
// after that release and finish inside MAX_PUBLISH_WINDOW_MS.
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

  return extractPuzzleFromHtml(trimmed);
}

function attr(source, name) {
  const match = source.match(new RegExp(`${name}=["']([^"']*)["']`));
  return match?.[1];
}

function dateFromLabel(dateLabel) {
  const match = dateLabel.match(/^([A-Za-z]+)\s+(\d{1,2}),\s+(\d{4})$/);
  if (!match) throw new Error(`Unable to parse Wend date label: ${dateLabel}`);
  const months = new Map([
    ["january", "01"],
    ["february", "02"],
    ["march", "03"],
    ["april", "04"],
    ["may", "05"],
    ["june", "06"],
    ["july", "07"],
    ["august", "08"],
    ["september", "09"],
    ["october", "10"],
    ["november", "11"],
    ["december", "12"],
  ]);
  const month = months.get(match[1].toLowerCase());
  if (!month) throw new Error(`Unknown Wend month in date label: ${dateLabel}`);
  return `${match[3]}-${month}-${match[2].padStart(2, "0")}`;
}

function extractPuzzleMeta(html) {
  const heading =
    html.match(/Wend answer today for ([A-Za-z]+\s+\d{1,2},\s+\d{4}) puzzle no (\d+)/i) ||
    html.match(/LinkedIn Wend #(\d+)\s+.\s+([A-Za-z]{3,9}\s+\d{1,2})/i);

  if (heading?.[1] && heading?.[2] && Number.isNaN(Number(heading[1]))) {
    const dateLabel = heading[1];
    return { dateLabel, date: dateFromLabel(dateLabel), puzzleNumber: Number(heading[2]) };
  }

  const schemaMatch = html.match(/LinkedIn Wend #(\d+)\s+.\s+([A-Za-z]{3,9})\s+(\d{1,2})/i);
  if (schemaMatch) {
    const dateLabel = `${schemaMatch[2]} ${schemaMatch[3]}, ${new Date().getUTCFullYear()}`;
    return { dateLabel, date: dateFromLabel(dateLabel), puzzleNumber: Number(schemaMatch[1]) };
  }

  throw new Error("Unable to extract Wend puzzle number and date from HTML source.");
}

function extractPuzzleFromHtml(html) {
  const cellTags = [...html.matchAll(/<(button|div)\b([^>]*data-row=["'][^"']+["'][^>]*)>/gi)].map(
    (match) => match[2],
  );
  if (cellTags.length === 0) {
    throw new Error(
      "Unable to extract Wend JSON. Source must be JSON, a wend-puzzle-data script tag, or HTML with data-row/data-col puzzle cells.",
    );
  }

  const cells = new Map();
  const wordPaths = new Map();
  for (const tag of cellTags) {
    const row = Number(attr(tag, "data-row"));
    const col = Number(attr(tag, "data-col"));
    if (!Number.isInteger(row) || !Number.isInteger(col)) continue;

    const key = `${row}-${col}`;
    if (cells.has(key)) continue;

    const letter = attr(tag, "data-cell-letter") || null;
    const wordIndexValue = attr(tag, "data-word-index");
    const letterIndexValue = attr(tag, "data-letter-index");
    cells.set(key, { row, col, letter });

    if (letter && wordIndexValue !== undefined && letterIndexValue !== undefined) {
      const wordIndex = Number(wordIndexValue);
      const letterIndex = Number(letterIndexValue);
      if (!Number.isInteger(wordIndex) || !Number.isInteger(letterIndex)) continue;
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
    .sort(([a], [b]) => a - b)
    .map(([, path]) => ({
      word: path.map((step) => step?.letter).join(""),
      path: path.map((step) => step?.path),
    }));

  const { date, dateLabel, puzzleNumber } = extractPuzzleMeta(html);
  const shortest = answers.reduce((best, answer) => (answer.word.length < best.word.length ? answer : best), answers[0]);
  const longest = answers.reduce((best, answer) => (answer.word.length > best.word.length ? answer : best), answers[0]);
  const allSameLength = answers.every((answer) => answer.word.length === shortest.word.length);

  return {
    game: "wend",
    puzzleNumber,
    date,
    dateLabel,
    updatedAt: `${date}T08:01:00Z`,
    difficulty: "Medium",
    grid,
    hints: [
      {
        level: 1,
        title: "Gentle nudge",
        text: `Start with ${shortest.word}; it uses one of the most constrained paths on the board.`,
      },
      {
        level: 2,
        title: "Direction clue",
        text: "Use the blocked cells to split the board into narrow lanes before tracing the longer answers.",
      },
      {
        level: 3,
        title: "Almost there",
        text: allSameLength
          ? "All answer paths have the same length, so use the blocked-cell lanes instead of word length to choose your next route."
          : `${longest.word} is one of the longest paths, so save it until the shorter routes are locked in.`,
      },
    ],
    answers,
    explanation: `The ${dateLabel} Wend solution uses every open cell exactly once across ${answers.map((answer) => answer.word).join(", ")}. Follow the colored paths from each start marker and the blocked cells keep every route constrained.`,
    quickHint: `Start by locating ${shortest.word}, then use the blocked cells to narrow the remaining paths.`,
    fastTip: allSameLength
      ? "When every word has the same length, solve by lane shape: lock the edge paths first, then fill the middle routes."
      : `Confirm ${shortest.word} first; shorter constrained paths make the longer Wend routes easier to place.`,
    commonMistake: "Do not read the board like a normal word search. Wend paths can turn through adjacent cells and must avoid every blocked cell.",
    difficultyNote: allSameLength
      ? `Medium because all ${answers.length} answers have the same length, so the board shape matters more than word length.`
      : `Medium because several paths run along narrow lanes and the longest answer is easier after the shorter routes are fixed.`,
    relatedGames: ["patches", "zip", "tango", "queens"],
    isVerified: true,
  };
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

function gitHasStagedChanges() {
  const output = capture("git", ["diff", "--cached", "--name-only"]).trim();
  return output.length > 0;
}

function persistToGit(puzzle) {
  if (!persistGeneratedData) return;

  run("git", ["config", "user.name", "wend-publish-bot"]);
  run("git", ["config", "user.email", "wend-publish-bot@users.noreply.github.com"]);
  run("git", ["add", `data/puzzles/wend/${puzzle.date}.json`, "src/lib/generated/wend-puzzles.ts"]);

  if (!gitHasStagedChanges()) {
    console.log("No generated Wend data changes to commit.");
    return;
  }

  run("git", ["commit", "-m", `chore(wend): publish ${puzzle.date} puzzle`]);
  const branch = process.env.GITHUB_REF_NAME || capture("git", ["branch", "--show-current"]).trim();
  if (!branch) throw new Error("Unable to determine branch for git push.");
  run("git", ["push", "origin", `HEAD:${branch}`]);
}

function verifyLatestDate(expectedDate) {
  const output = capture(process.execPath, ["scripts/latest-date.mjs", "data/puzzles/wend", "--json"]);
  const result = JSON.parse(output);
  if (result.latestDate !== expectedDate) {
    throw new Error(`Expected latest Wend date ${expectedDate}, got ${result.latestDate}`);
  }
}

async function notifyFailure(error) {
  await sendOpsAlert({
    title: "Wend publish failed",
    message: `Expected date: ${expectedDate}`,
    details: [
      `Elapsed: ${Math.round((Date.now() - startedAt) / 1000)}s`,
      `Error: ${error instanceof Error ? error.message : String(error)}`,
    ],
  });
}

async function main() {
  const source = await readSource();
  const puzzle = extractJson(source);
  validateWendPuzzle(puzzle, { allowUnverified, expectedDate });
  writePuzzle(puzzle);
  run(process.execPath, ["scripts/generate-wend-puzzles.mjs"]);
  verifyLatestDate(puzzle.date);
  run(process.execPath, ["tests/wend-archive-url.test.mjs"]);
  persistToGit(puzzle);
  runDeployCommand(deployCommand);

  const elapsed = Date.now() - startedAt;
  if (elapsed > MAX_PUBLISH_WINDOW_MS) {
    throw new Error(`Wend publish exceeded the ${MAX_PUBLISH_WINDOW_MS}ms target window; elapsed ${elapsed}ms.`);
  }

  console.log(`Wend publish completed in ${Math.round(elapsed / 1000)}s.`);
}

try {
  await main();
} catch (error) {
  await notifyFailure(error);
  throw error;
}
