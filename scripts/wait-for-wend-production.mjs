import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

function statusSummary(response, body) {
  const latest = body?.latestVerified;
  return `HTTP ${response?.status ?? "error"}; status ${body?.status ?? "unknown"}; latest ${latest?.date ?? "unknown"} / Wend #${latest?.puzzleNumber ?? "unknown"}`;
}

export async function waitForWendProduction({
  baseUrl,
  expectedDate,
  expectedPuzzleNumber,
  fetchImpl = fetch,
  now = Date.now,
  pollMs = 5_000,
  sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  timeoutMs = 5 * 60 * 1000,
}) {
  const endpoint = `${baseUrl.replace(/\/$/, "")}/api/wend-status`;
  const startedAt = now();
  let lastObservation = "no response";

  while (true) {
    try {
      const response = await fetchImpl(endpoint, {
        cache: "no-store",
        headers: { accept: "application/json" },
      });
      const body = await response.json();
      lastObservation = statusSummary(response, body);
      if (
        response.ok &&
        body?.current === true &&
        body?.status === "current" &&
        body?.expected?.date === expectedDate &&
        Number(body?.expected?.puzzleNumber) === Number(expectedPuzzleNumber) &&
        body?.latestVerified?.date === expectedDate &&
        Number(body?.latestVerified?.puzzleNumber) === Number(expectedPuzzleNumber)
      ) {
        return body;
      }
    } catch (error) {
      lastObservation = error instanceof Error ? error.message : String(error);
    }

    const elapsed = now() - startedAt;
    if (elapsed >= timeoutMs) {
      throw new Error(
        `Timed out waiting for ${expectedDate} / Wend #${expectedPuzzleNumber} in production; last response: ${lastObservation}`,
      );
    }
    await sleep(Math.min(pollMs, timeoutMs - elapsed));
  }
}

function readLatestPuzzle(root = process.cwd()) {
  const inputDir = path.join(root, "data", "puzzles", "wend");
  const latestFile = fs
    .readdirSync(inputDir)
    .filter((file) => /^\d{4}-\d{2}-\d{2}\.json$/.test(file))
    .sort()
    .at(-1);
  if (!latestFile) throw new Error("No local Wend puzzle data found for the production gate.");
  return JSON.parse(fs.readFileSync(path.join(inputDir, latestFile), "utf8"));
}

async function main() {
  const puzzle = readLatestPuzzle();
  const baseUrl = process.env.WEND_PUBLIC_BASE_URL || "https://wendanswertoday.org";
  const timeoutMs = Number(process.env.WEND_PRODUCTION_WAIT_MS || 5 * 60 * 1000);
  await waitForWendProduction({
    baseUrl,
    expectedDate: puzzle.date,
    expectedPuzzleNumber: puzzle.puzzleNumber,
    timeoutMs,
  });
  console.log(`Production is serving ${puzzle.date} / Wend #${puzzle.puzzleNumber}.`);
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  await main();
}
