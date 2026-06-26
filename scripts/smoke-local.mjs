import fs from "node:fs";
import path from "node:path";

const baseUrl = process.env.SMOKE_BASE_URL || "http://127.0.0.1:3000";
const root = process.cwd();

function monthSlug(dateLabel) {
  return dateLabel.toLowerCase().replace(",", "").replace(/\s+/g, "-");
}

function wendArchivePath(puzzle) {
  return `/wend-answer-puzzle-${puzzle.puzzleNumber}-${monthSlug(puzzle.dateLabel)}`;
}

function legacyWendArchivePath(puzzle) {
  return `/linkedin-wend-answer-${puzzle.puzzleNumber}-${monthSlug(puzzle.dateLabel)}`;
}

function readRecentWendPuzzles(limit = 2) {
  const inputDir = path.join(root, "data", "puzzles", "wend");
  return fs
    .readdirSync(inputDir)
    .filter((file) => /^\d{4}-\d{2}-\d{2}\.json$/.test(file))
    .sort()
    .reverse()
    .slice(0, limit)
    .map((file) => JSON.parse(fs.readFileSync(path.join(inputDir, file), "utf8")));
}

const recentWendPuzzles = readRecentWendPuzzles();
const latestWendPuzzle = recentWendPuzzles[0];
const archivePaths = recentWendPuzzles.map(wendArchivePath);

const paths = [
  "/",
  "/linkedin-wend-answer-today",
  "/linkedin-wend-solver",
  "/linkedin-wend-archive",
  ...archivePaths,
  "/where-is-linkedin-wend",
  "/how-to-play-linkedin-wend",
  "/how-to-solve-linkedin-wend",
  "/faq",
  "/contact",
  "/status",
  "/disclaimer",
  "/privacy-policy",
  "/terms",
  "/sitemap.xml",
  "/robots.txt",
  "/llms.txt",
];

const noindexPaths = [
  "/linkedin-patches-answer-today",
  "/linkedin-patches-archive",
  "/linkedin-zip-answer-today",
  "/linkedin-zip-solver",
  "/wend-unlimited",
];

const redirectChecks = [
  {
    path: "/linkedin-games-answers-today",
    status: 301,
    destinationPath: "/",
  },
  {
    path: legacyWendArchivePath(latestWendPuzzle),
    status: 308,
    destinationPath: wendArchivePath(latestWendPuzzle),
  },
];

const failures = [];
const requiredHeaders = [
  "x-content-type-options",
  "x-frame-options",
  "referrer-policy",
  "permissions-policy",
];

for (const check of redirectChecks) {
  const response = await fetch(`${baseUrl}${check.path}`, { redirect: "manual" });
  if (response.status !== check.status) {
    failures.push(`expected ${check.status} redirect ${check.path}, got ${response.status}`);
    continue;
  }

  const location = response.headers.get("location");
  if (!location) {
    failures.push(`missing redirect location ${check.path}`);
    continue;
  }

  const destination = new URL(location, baseUrl);
  if (destination.pathname !== check.destinationPath) {
    failures.push(`expected redirect ${check.path} -> ${check.destinationPath}, got ${destination.pathname}`);
  }
}

for (const path of noindexPaths) {
  const response = await fetch(`${baseUrl}${path}`);
  if (!response.ok) {
    failures.push(`${response.status} ${path}`);
    continue;
  }

  const text = await response.text();
  if (!text.includes('name="robots" content="noindex, follow"')) {
    failures.push(`missing expected noindex ${path}`);
  }
  if (!text.includes("WendAnswerToday")) {
    failures.push(`missing brand text ${path}`);
  }
}

for (const path of paths) {
  const response = await fetch(`${baseUrl}${path}`);
  if (!response.ok) {
    failures.push(`${response.status} ${path}`);
    continue;
  }

  const text = await response.text();
  if (path.endsWith(".xml") || path.endsWith(".txt")) continue;
  for (const header of requiredHeaders) {
    if (!response.headers.get(header)) {
      failures.push(`missing ${header} header ${path}`);
    }
  }
  if (text.includes('name="robots" content="noindex"')) {
    failures.push(`unexpected noindex ${path}`);
  }
  if (!text.includes("WendAnswerToday")) {
    failures.push(`missing brand text ${path}`);
  }
}

if (failures.length) {
  console.error("Smoke check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Smoke check passed for ${paths.length} routes at ${baseUrl}`);
