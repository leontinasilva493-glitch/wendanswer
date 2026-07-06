import fs from "node:fs";
import path from "node:path";
import { sendOpsAlert } from "./ops-alert.mjs";
import { allowsGlobalCrawl, disallowsGlobalCrawl } from "./robots-policy.mjs";

const root = process.cwd();
const baseUrl = (process.env.MONITOR_BASE_URL || "https://wendanswertoday.org").replace(/\/$/, "");
const canonicalSiteUrl = (process.env.MONITOR_CANONICAL_SITE_URL || "https://wendanswertoday.org").replace(/\/$/, "");
const requestTimeoutMs = Number(process.env.MONITOR_REQUEST_TIMEOUT_MS || 15_000);
const failures = [];

function dateLabel(date) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00.000Z`));
}

function monthSlug(label) {
  return label.toLowerCase().replace(",", "").replace(/\s+/g, "-");
}

function readLatestWendPuzzle() {
  const inputDir = path.join(root, "data", "puzzles", "wend");
  const latestFile = fs
    .readdirSync(inputDir)
    .filter((file) => /^\d{4}-\d{2}-\d{2}\.json$/.test(file))
    .sort()
    .at(-1);

  if (!latestFile) throw new Error("No local Wend puzzle data found for freshness monitoring.");
  return JSON.parse(fs.readFileSync(path.join(inputDir, latestFile), "utf8"));
}

function utcDateStamp(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function expectedWendDate(now = new Date()) {
  const releaseDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  if (now.getUTCHours() < 8) releaseDate.setUTCDate(releaseDate.getUTCDate() - 1);
  return utcDateStamp(releaseDate);
}

function daysBetween(startDate, endDate) {
  const startTime = Date.parse(`${startDate}T00:00:00.000Z`);
  const endTime = Date.parse(`${endDate}T00:00:00.000Z`);
  return Math.round((endTime - startTime) / (24 * 60 * 60 * 1000));
}

function expectedWendDisplay(latestPuzzle) {
  const date = expectedWendDate();
  return {
    date,
    dateLabel: dateLabel(date),
    puzzleNumber: latestPuzzle.puzzleNumber + daysBetween(latestPuzzle.date, date),
  };
}

function archivePath(puzzle) {
  return `/wend-answer-puzzle-${puzzle.puzzleNumber}-${monthSlug(puzzle.dateLabel)}`;
}

function legacyArchivePath(puzzle) {
  return `/linkedin-wend-answer-${puzzle.puzzleNumber}-${monthSlug(puzzle.dateLabel)}`;
}

async function fetchPath(route, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), requestTimeoutMs);
  try {
    return await fetch(`${baseUrl}${route}`, {
      cache: "no-store",
      redirect: options.redirect || "follow",
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function assertOkIndexable(route) {
  const response = await fetchPath(route);
  if (!response.ok) {
    failures.push(`${route} returned ${response.status}`);
    return "";
  }

  const xRobots = response.headers.get("x-robots-tag") || "";
  const text = await response.text();
  if (/noindex/i.test(xRobots)) failures.push(`${route} sends x-robots-tag noindex`);
  if (/name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(text)) {
    failures.push(`${route} contains robots noindex meta`);
  }

  return text;
}

async function checkCorePages(latestPuzzle, expected) {
  const latestArchivePath = archivePath(latestPuzzle);
  const checks = [
    ["/", "WendAnswerToday"],
    ["/linkedin-wend-answer-today", "LinkedIn Wend Answer Today"],
    ["/linkedin-wend-archive", "LinkedIn Wend Answer Archive"],
    [latestArchivePath, `Wend #${latestPuzzle.puzzleNumber}`],
  ];

  for (const [route, requiredText] of checks) {
    const text = await assertOkIndexable(route);
    if (text && !text.includes(requiredText)) failures.push(`${route} missing expected text: ${requiredText}`);
  }

  const homepage = await assertOkIndexable("/");
  if (homepage && !homepage.includes(`Wend answer today for ${expected.dateLabel} puzzle no ${expected.puzzleNumber}`)) {
    failures.push(`homepage hero is not using expected ${expected.dateLabel} / Wend #${expected.puzzleNumber}`);
  }

  const today = await assertOkIndexable("/linkedin-wend-answer-today");
  const expectedPuzzlePattern = new RegExp(`(?:Puzzle|puzzle|Wend)\\s*#${expected.puzzleNumber}\\b`);
  if (today && (!today.includes(expected.dateLabel) || !expectedPuzzlePattern.test(today))) {
    failures.push(`today page appears stale; expected ${expected.dateLabel} / Puzzle #${expected.puzzleNumber}`);
  }
}

async function checkRobotsAndSitemap(latestPuzzle) {
  const robots = await fetchPath("/robots.txt");
  const robotsText = await robots.text();
  if (!robots.ok) failures.push(`/robots.txt returned ${robots.status}`);
  if (!allowsGlobalCrawl(robotsText)) failures.push("robots.txt does not explicitly allow crawling");
  if (disallowsGlobalCrawl(robotsText)) failures.push("robots.txt disallows the whole site");
  if (!robotsText.includes(`${canonicalSiteUrl}/sitemap.xml`)) failures.push("robots.txt does not point to the production sitemap");

  const sitemap = await fetchPath("/sitemap.xml");
  const sitemapText = await sitemap.text();
  if (!sitemap.ok) failures.push(`/sitemap.xml returned ${sitemap.status}`);
  for (const route of ["/", "/linkedin-wend-answer-today", "/linkedin-wend-archive", archivePath(latestPuzzle)]) {
    if (!sitemapText.includes(`${canonicalSiteUrl}${route}`)) failures.push(`sitemap.xml missing ${route}`);
  }
}

async function checkLegacyRedirect(latestPuzzle) {
  const from = legacyArchivePath(latestPuzzle);
  const to = archivePath(latestPuzzle);
  const response = await fetchPath(from, { redirect: "manual" });
  const location = response.headers.get("location") || "";
  const destination = location ? new URL(location, baseUrl) : null;

  if (response.status !== 308) failures.push(`${from} expected 308, got ${response.status}`);
  if (!destination || destination.pathname !== to) {
    failures.push(`${from} expected redirect to ${to}, got ${location || "missing location"}`);
  }
}

async function main() {
  const latestPuzzle = readLatestWendPuzzle();
  const expected = expectedWendDisplay(latestPuzzle);

  await checkCorePages(latestPuzzle, expected);
  await checkRobotsAndSitemap(latestPuzzle);
  await checkLegacyRedirect(latestPuzzle);

  if (failures.length) {
    const message = `Production monitor failed for ${baseUrl}`;
    await sendOpsAlert({
      title: "WendAnswerToday production monitor failed",
      message,
      details: failures.map((failure) => `- ${failure}`),
    });
    console.error(message);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`Production monitor passed for ${baseUrl}`);
}

try {
  await main();
} catch (error) {
  await sendOpsAlert({
    title: "WendAnswerToday production monitor crashed",
    message: error instanceof Error ? error.message : String(error),
  });
  throw error;
}
