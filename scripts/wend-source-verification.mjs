import { createHash } from "node:crypto";

function normalizedWords(puzzle) {
  if (!Array.isArray(puzzle?.answers)) throw new Error("Puzzle answers are required for source verification.");
  return puzzle.answers.map((answer) => String(answer.word || "").trim().toUpperCase()).sort();
}

function normalizedSource(puzzle) {
  const answers = puzzle.answers
    .map((answer) => ({
      path: Array.isArray(answer.path) ? answer.path : null,
      word: String(answer.word || "").trim().toUpperCase(),
    }))
    .sort((a, b) => a.word.localeCompare(b.word));
  return {
    answers,
    date: puzzle.date,
    grid: Array.isArray(puzzle.grid) ? puzzle.grid : null,
    puzzleNumber: Number(puzzle.puzzleNumber),
  };
}

export function sourceHash(puzzle) {
  return createHash("sha256").update(JSON.stringify(normalizedSource(puzzle))).digest("hex");
}

export function parseSecondaryAnswerData(source, expectedDate) {
  const escapedDate = expectedDate.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const entry = source.match(new RegExp(`\\{[^{}]*\\bdate\\s*:\\s*["']${escapedDate}["'][^{}]*\\}`, "i"))?.[0];
  if (!entry) throw new Error(`Secondary Wend source does not contain ${expectedDate}.`);

  const puzzleNumber = Number(entry.match(/\bnumber\s*:\s*(\d+)/i)?.[1]);
  const wordsSource = entry.match(/\bwords\s*:\s*\[([\s\S]*?)\]/i)?.[1];
  const words = wordsSource ? [...wordsSource.matchAll(/["']([^"']+)["']/g)].map((match) => match[1]) : [];
  if (!Number.isInteger(puzzleNumber) || words.length === 0) {
    throw new Error(`Secondary Wend source entry for ${expectedDate} is missing a puzzle number or answer words.`);
  }

  return { date: expectedDate, puzzleNumber, words };
}

function publication(puzzle, options, sourceType, verificationMethod, verifiedBy) {
  const capturedAt = options.capturedAt || new Date().toISOString();
  return {
    ...puzzle,
    isVerified: true,
    publication: {
      capturedAt,
      sourceHash: sourceHash(puzzle),
      sourceType,
      sourceUrls: options.sourceUrls || [],
      state: "verified",
      verificationMethod,
      verifiedAt: capturedAt,
      verifiedBy,
    },
    updatedAt: capturedAt,
  };
}

export function prepareTrustedPuzzle(puzzle, { capturedAt, sourceUrl, verifiedBy } = {}) {
  if (!verifiedBy?.trim()) throw new Error("Trusted Wend JSON requires a verifier identity.");
  return publication(
    puzzle,
    { capturedAt, sourceUrls: sourceUrl ? [sourceUrl] : [] },
    "trusted-json",
    "trusted-workflow-input",
    verifiedBy.trim(),
  );
}

export function preparePublicPuzzle(
  puzzle,
  secondary,
  { capturedAt, primarySourceUrl, secondarySourceUrl } = {},
) {
  if (puzzle.date !== secondary.date) {
    throw new Error(`Primary and secondary Wend dates do not match: ${puzzle.date} vs ${secondary.date}.`);
  }
  if (Number(puzzle.puzzleNumber) !== Number(secondary.puzzleNumber)) {
    throw new Error(`Primary and secondary Wend puzzle numbers do not match: ${puzzle.puzzleNumber} vs ${secondary.puzzleNumber}.`);
  }

  const primaryWords = normalizedWords(puzzle);
  const secondaryWords = secondary.words.map((word) => String(word).trim().toUpperCase()).sort();
  if (JSON.stringify(primaryWords) !== JSON.stringify(secondaryWords)) {
    throw new Error("Primary and secondary Wend answer words do not match.");
  }

  return publication(
    puzzle,
    {
      capturedAt,
      sourceUrls: [primarySourceUrl, secondarySourceUrl].filter(Boolean),
    },
    "public-html-quorum",
    "two-source-agreement",
    "public-source-quorum",
  );
}
