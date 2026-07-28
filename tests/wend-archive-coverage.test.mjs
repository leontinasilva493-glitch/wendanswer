import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

function monthSlug(dateLabel) {
  return dateLabel.toLowerCase().replace(",", "").replace(/\s+/g, "-");
}

const puzzleDir = path.join(root, "data", "puzzles", "wend");
const files = fs
  .readdirSync(puzzleDir)
  .filter((file) => /^\d{4}-\d{2}-\d{2}\.json$/.test(file))
  .sort();
const puzzles = files.map((file) => JSON.parse(read(path.join("data", "puzzles", "wend", file))));
const verifiedPuzzles = puzzles.filter((puzzle) => puzzle.isVerified);

assert.ok(puzzles.length >= verifiedPuzzles.length, "Raw Wend data may include a pending unverified puzzle outside the public archive");
const latestPuzzleNumber = Math.max(...verifiedPuzzles.map((puzzle) => puzzle.puzzleNumber));
assert.deepEqual(
  verifiedPuzzles.map((puzzle) => puzzle.puzzleNumber).sort((left, right) => left - right),
  Array.from({ length: latestPuzzleNumber }, (_, index) => index + 1),
  "Public Wend archive should have no missing puzzle numbers from launch through the latest verified puzzle",
);

const generatedSource = read("src/lib/generated/wend-puzzles.ts");
const sitemapSource = read("src/app/sitemap.ts");
const detailSource = read("src/app/[slug]/page.tsx");
const homeSource = read("src/app/page.tsx");
const archiveSource = read("src/app/linkedin-wend-archive/page.tsx");

for (const file of files) {
  assert.match(generatedSource, new RegExp(file.replace(".", "\\.")), `generated index should import ${file}`);
}

for (const puzzle of verifiedPuzzles) {
  const slug = `wend-answer-puzzle-${puzzle.puzzleNumber}-${monthSlug(puzzle.dateLabel)}`;
  assert.match(generatedSource, new RegExp(`${puzzle.date}\\.json`), `generated index should include ${puzzle.date}`);
  assert.match(sitemapSource, /wendPuzzles\.map/, "sitemap should derive archive URLs from all Wend puzzles");
  assert.match(detailSource, /generateStaticParams[\s\S]*wendPuzzles\.map/, "archive detail static params should derive from all Wend puzzles");
  assert.ok(slug.startsWith("wend-answer-puzzle-"), `canonical slug should be generated for ${puzzle.date}`);
}

const puzzleSource = read("src/lib/puzzles.ts");
assert.match(puzzleSource, /allWendPuzzles/, "puzzles module should keep a raw internal Wend dataset");
assert.match(puzzleSource, /verifiedWendPuzzles/, "puzzles module should expose a verified public Wend dataset");
assert.match(puzzleSource, /wendPuzzles\s*=\s*verifiedWendPuzzles/, "public wendPuzzles should only contain verified data");
assert.match(puzzleSource, /todayWend\s*=\s*verifiedWendPuzzles\[0\]/, "todayWend should default to the latest verified puzzle");

assert.match(homeSource, /const archivePuzzles = wendPuzzles/, "homepage should source recent answers from verified Wend puzzles");
assert.match(homeSource, /const recentArchivePuzzles = archivePuzzles\.slice\(0,\s*4\)/, "homepage should limit the archive preview to recent puzzles");
assert.match(homeSource, /Recent LinkedIn Wend Answers/, "homepage archive block should be labeled as a recent LinkedIn Wend preview");
assert.match(homeSource, /<ArchiveList puzzles=\{recentArchivePuzzles\} variant="preview" \/>/, "homepage should use the compact archive preview");
assert.match(homeSource, /href="\/linkedin-wend-archive"/, "homepage should link to the full archive");
assert.match(homeSource, /View Full Archive/, "homepage should label the full archive CTA clearly");

assert.match(archiveSource, /All LinkedIn Wend Answers/, "archive page should label the list as complete");
assert.match(archiveSource, /Verified archive coverage:/, "archive page should show first-to-latest verified coverage copy");
assert.match(archiveSource, /<ArchiveList puzzles=\{wendPuzzles\}/, "archive page should render all Wend puzzles");

console.log("wend archive coverage test passed");
