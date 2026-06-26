import { execFileSync, execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { validateWendPuzzle } from "./validate-wend-puzzle.mjs";

const root = process.cwd();
const startedAt = Date.now();
const MAX_PUBLISH_WINDOW_MS = Number(process.env.MAX_PUBLISH_WINDOW_MS || 5 * 60 * 1000);
const sourceUrl = process.env.WEND_DAILY_SOURCE_URL;
const inputFile = process.env.WEND_DAILY_INPUT_FILE;
const deployCommand = process.env.WEND_DEPLOY_COMMAND;
const alertWebhookUrl = process.env.WEND_ALERT_WEBHOOK_URL;
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

  throw new Error(
    "Unable to extract Wend JSON. Point WEND_DAILY_SOURCE_URL at a normalized official-page capture that returns the daily puzzle JSON.",
  );
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
  if (!alertWebhookUrl) return;
  const message = [
    "Wend publish failed",
    `Expected date: ${expectedDate}`,
    `Elapsed: ${Math.round((Date.now() - startedAt) / 1000)}s`,
    `Error: ${error instanceof Error ? error.message : String(error)}`,
  ].join("\n");

  await fetch(alertWebhookUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ content: message }),
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
