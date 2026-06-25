import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const inputDir = path.join(root, "data", "puzzles", "wend");
const outputFile = path.join(root, "src", "lib", "generated", "wend-puzzles.ts");

if (!fs.existsSync(inputDir)) {
  console.error(`Directory not found: ${path.relative(root, inputDir)}`);
  process.exit(1);
}

const files = fs
  .readdirSync(inputDir)
  .filter((file) => /^\d{4}-\d{2}-\d{2}\.json$/.test(file))
  .sort()
  .reverse();

if (files.length === 0) {
  console.error("No Wend puzzle JSON files found.");
  process.exit(1);
}

fs.mkdirSync(path.dirname(outputFile), { recursive: true });

const imports = files
  .map((file, index) => {
    const name = `wendPuzzle${index}`;
    return `import ${name} from "../../../data/puzzles/wend/${file}";`;
  })
  .join("\n");

const names = files.map((_, index) => `wendPuzzle${index}`).join(", ");
const fileList = files.map((file) => `"${file}"`).join(", ");

const content = `${imports}

export const generatedWendPuzzles = [${names}] as const;
export const generatedWendPuzzleFiles = [${fileList}] as const;
`;

fs.writeFileSync(outputFile, content);
console.log(`Generated ${path.relative(root, outputFile)} from ${files.length} Wend puzzle files.`);
