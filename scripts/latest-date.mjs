import fs from "node:fs";
import path from "node:path";

const [, , inputDir = "data/puzzles/wend", ...flags] = process.argv;
const asJson = flags.includes("--json");

if (!fs.existsSync(inputDir)) {
  console.error(`Directory not found: ${inputDir}`);
  process.exit(1);
}

const files = fs
  .readdirSync(inputDir)
  .filter((file) => /^\d{4}-\d{2}-\d{2}\.json$/.test(file))
  .sort();

if (files.length === 0) {
  console.error(`No YYYY-MM-DD.json files found in ${inputDir}`);
  process.exit(1);
}

const latestName = files.at(-1);
const latestDate = latestName.replace(/\.json$/, "");
const latestFile = path.normalize(path.join(inputDir, latestName));

if (asJson) {
  console.log(
    JSON.stringify(
      {
        latestDate,
        latestFile,
        count: files.length,
      },
      null,
      2,
    ),
  );
} else {
  console.log(latestDate);
}
