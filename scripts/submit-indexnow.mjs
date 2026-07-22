import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const siteUrl = (process.env.INDEXNOW_SITE_URL || "https://wendanswertoday.org").replace(/\/$/, "");
const endpoint = process.env.INDEXNOW_ENDPOINT || "https://api.indexnow.org/indexnow";
const key = process.env.INDEXNOW_KEY;

function monthSlug(dateLabel) {
  return dateLabel.toLowerCase().replace(",", "").replace(/\s+/g, "-");
}

function readLatestWendPuzzle() {
  const inputDir = path.join(root, "data", "puzzles", "wend");
  const latestFile = fs
    .readdirSync(inputDir)
    .filter((file) => /^\d{4}-\d{2}-\d{2}\.json$/.test(file))
    .sort()
    .at(-1);

  if (!latestFile) throw new Error("No Wend puzzle data found for IndexNow submission.");
  return JSON.parse(fs.readFileSync(path.join(inputDir, latestFile), "utf8"));
}

function defaultUrls() {
  const latest = readLatestWendPuzzle();
  return [
    `${siteUrl}/`,
    `${siteUrl}/linkedin-wend-archive`,
    `${siteUrl}/wend-answer-puzzle-${latest.puzzleNumber}-${monthSlug(latest.dateLabel)}`,
  ];
}

async function main() {
  if (!key) {
    console.log("INDEXNOW_KEY is not configured; skipping IndexNow submission.");
    return;
  }

  const urlList = (process.env.INDEXNOW_URLS || "")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);
  const urls = urlList.length > 0 ? urlList : defaultUrls();
  const keyLocation = process.env.INDEXNOW_KEY_LOCATION || `${siteUrl}/indexnow-key.txt`;
  const host = new URL(siteUrl).host;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      host,
      key,
      keyLocation,
      urlList: urls,
    }),
  });

  if (![200, 202].includes(response.status)) {
    const body = await response.text();
    throw new Error(`IndexNow submission failed with ${response.status}: ${body}`);
  }

  console.log(`IndexNow submitted ${urls.length} URLs to ${endpoint}`);
}

await main();
