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

assert.ok(puzzles.length >= 6, "Wend archive should include the first verified launch week");

const generatedSource = read("src/lib/generated/wend-puzzles.ts");
const sitemapSource = read("src/app/sitemap.ts");
const detailSource = read("src/app/[slug]/page.tsx");
const homeSource = read("src/app/page.tsx");
const archiveSource = read("src/app/linkedin-wend-archive/page.tsx");

for (const file of files) {
  assert.match(generatedSource, new RegExp(file.replace(".", "\\.")), `generated index should import ${file}`);
}

for (const puzzle of puzzles) {
  const slug = `wend-answer-puzzle-${puzzle.puzzleNumber}-${monthSlug(puzzle.dateLabel)}`;
  assert.match(generatedSource, new RegExp(`${puzzle.date}\\.json`), `generated index should include ${puzzle.date}`);
  assert.match(sitemapSource, /wendPuzzles\.map/, "sitemap should derive archive URLs from all Wend puzzles");
  assert.match(detailSource, /generateStaticParams[\s\S]*wendPuzzles\.map/, "archive detail static params should derive from all Wend puzzles");
  assert.ok(slug.startsWith("wend-answer-puzzle-"), `canonical slug should be generated for ${puzzle.date}`);
}

assert.doesNotMatch(homeSource, /wendPuzzles\.slice\(0,\s*3\)/, "homepage must not limit Wend archive coverage to three items");
assert.match(homeSource, /const archivePuzzles = wendPuzzles/, "homepage should render every verified Wend puzzle");
assert.match(homeSource, /All Wend Answers/, "homepage archive block should be labeled as a complete archive");
assert.match(homeSource, /Complete verified archive/, "homepage should show first-to-latest coverage copy");
assert.match(homeSource, /<ArchiveList puzzles=\{archivePuzzles\}/, "homepage should use the full archive list component");

assert.match(archiveSource, /All Wend Answers/, "archive page should label the list as complete");
assert.match(archiveSource, /Archive coverage:/, "archive page should show first-to-latest coverage copy");
assert.match(archiveSource, /<ArchiveList puzzles=\{wendPuzzles\}/, "archive page should render all Wend puzzles");

console.log("wend archive coverage test passed");
