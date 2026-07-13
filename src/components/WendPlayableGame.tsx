"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { BadgeCheck, Check, Lightbulb, RotateCcw, Send, Share2, Undo2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import type { Cell, WendAnswer, WendPuzzle } from "@/lib/puzzles";
import { loadWendPlayProgress, saveWendPlayProgress } from "@/lib/wend-play-storage";
import { WendGrid } from "./WendGrid";

const wordColors = ["#e8572a", "#d4449a", "#4dbdba", "#98c21f", "#5b8dd9", "#f05a28"];
type WordStyle = CSSProperties & Record<"--word-color", string>;

function sameCell(a: Cell, b: Cell) {
  return a[0] === b[0] && a[1] === b[1];
}

function cellKey(cell: Cell) {
  return `${cell[0]}-${cell[1]}`;
}

function isAdjacent(a: Cell, b: Cell) {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) === 1;
}

function pathEquals(a: Cell[], b: Cell[]) {
  return a.length === b.length && a.every((cell, index) => sameCell(cell, b[index]));
}

function wordFromPath(grid: WendPuzzle["grid"], path: Cell[]) {
  return path.map(([row, col]) => grid[row]?.[col] ?? "").join("");
}

function sortedWords(words: Iterable<string>) {
  return [...words].sort();
}

function buildShareText(puzzle: WendPuzzle, foundWords: Set<string>) {
  const solved = foundWords.size === puzzle.answers.length;
  const completion = `${foundWords.size}/${puzzle.answers.length}`;
  return [
    `Play Wend Unlimited #${puzzle.puzzleNumber}`,
    `${puzzle.dateLabel} • ${puzzle.difficulty}`,
    solved ? `Solved: ${completion}` : `Progress: ${completion}`,
    "Play at https://wendanswertoday.org/play-wend",
  ].join("\n");
}

export function WendPlayableGame({ puzzle }: { puzzle: WendPuzzle }) {
  const [selectedCells, setSelectedCells] = useState<Cell[]>([]);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [hintIndex, setHintIndex] = useState(0);
  const [status, setStatus] = useState("Select adjacent letters, then submit a word.");
  const [storageReady, setStorageReady] = useState(false);
  const hasTrackedSolved = useRef(false);

  const selectedKeys = useMemo(() => new Set(selectedCells.map(cellKey)), [selectedCells]);
  const foundWordSet = useMemo(() => new Set(foundWords), [foundWords]);
  const currentWord = wordFromPath(puzzle.grid, selectedCells);
  const solved = foundWords.size === puzzle.answers.length && puzzle.answers.length > 0;
  const progress = puzzle.answers.length === 0 ? 0 : Math.round((foundWords.size / puzzle.answers.length) * 100);
  const currentHint = hintIndex > 0 ? puzzle.hints[Math.min(hintIndex - 1, Math.max(puzzle.hints.length - 1, 0))] : null;

  useEffect(() => {
    const saved = loadWendPlayProgress(puzzle.puzzleNumber);
    if (saved) {
      setSelectedCells(saved.selectedCells);
      setFoundWords(new Set(saved.foundWords));
      setHintIndex(Math.min(saved.hintIndex, Math.max(puzzle.hints.length - 1, 0)));
      setStatus(saved.solved ? "Solved locally. You can share your result or play another puzzle." : "Progress restored from this browser.");
    } else {
      setSelectedCells([]);
      setFoundWords(new Set());
      setHintIndex(0);
      setStatus("Select adjacent letters, then submit a word.");
    }
    hasTrackedSolved.current = false;
    setStorageReady(true);
  }, [puzzle.puzzleNumber, puzzle.hints.length]);

  useEffect(() => {
    if (!storageReady) return;
    saveWendPlayProgress(puzzle.puzzleNumber, {
      selectedCells,
      foundWords: sortedWords(foundWords),
      hintIndex,
      solved,
      updatedAt: new Date().toISOString(),
    });
  }, [foundWords, hintIndex, puzzle.puzzleNumber, selectedCells, solved, storageReady]);

  useEffect(() => {
    if (!solved || hasTrackedSolved.current) return;
    hasTrackedSolved.current = true;
    setStatus("Solved locally. Share your result or move to another puzzle.");
    trackEvent("Wend Unlimited Solve", {
      puzzleNumber: puzzle.puzzleNumber,
      wordsFound: foundWords.size,
    });
  }, [foundWords.size, puzzle.puzzleNumber, solved]);

  function handleCellClick(_answer: WendAnswer, cell: Cell) {
    setSelectedCells((current) => {
      const existingIndex = current.findIndex((candidate) => sameCell(candidate, cell));
      if (existingIndex >= 0) {
        setStatus("Path trimmed. Continue from the highlighted end.");
        return current.slice(0, existingIndex + 1);
      }

      const lastCell = current[current.length - 1];
      if (lastCell && !isAdjacent(lastCell, cell)) {
        setStatus("Cells must touch side-to-side. Started a new path.");
        return [cell];
      }

      setStatus("Keep tracing, then submit when the word is complete.");
      return [...current, cell];
    });
  }

  function submitWord() {
    const answer = puzzle.answers.find(
      (candidate) =>
        !foundWords.has(candidate.word) &&
        candidate.word.toUpperCase() === currentWord.toUpperCase() &&
        pathEquals(candidate.path, selectedCells),
    );

    if (!answer) {
      setStatus(currentWord ? `"${currentWord}" is not a verified path yet.` : "Select a path before submitting.");
      return;
    }

    trackEvent("Wend Unlimited Submit", {
      action: "correct",
      puzzleNumber: puzzle.puzzleNumber,
      word: answer.word,
    });
    setFoundWords((current) => new Set([...current, answer.word]));
    setSelectedCells([]);
    setStatus(`Found ${answer.word}.`);
  }

  function clearPath() {
    setSelectedCells([]);
    setStatus("Path cleared. Select adjacent letters, then submit a word.");
  }

  function undoStep() {
    setSelectedCells((current) => {
      if (current.length === 0) {
        setStatus("Nothing to undo.");
        return current;
      }
      setStatus("Undo applied. Keep tracing the path.");
      return current.slice(0, -1);
    });
    trackEvent("Wend Unlimited Undo", { puzzleNumber: puzzle.puzzleNumber });
  }

  function revealHint() {
    if (puzzle.hints.length === 0) return;
    const nextHint = puzzle.hints[Math.min(hintIndex, puzzle.hints.length - 1)];
    if (!nextHint) return;
    setHintIndex((current) => Math.min(current + 1, puzzle.hints.length));
    trackEvent("Wend Unlimited Hint", {
      puzzleNumber: puzzle.puzzleNumber,
      level: nextHint.level,
    });
    setStatus(`${nextHint.title}: ${nextHint.text}`);
  }

  async function shareResult() {
    const shareText = buildShareText(puzzle, foundWords);
    trackEvent("Wend Unlimited Share", {
      puzzleNumber: puzzle.puzzleNumber,
      solved,
      wordsFound: foundWords.size,
    });

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `Play Wend Unlimited #${puzzle.puzzleNumber}`,
          text: shareText,
          url: typeof window !== "undefined" ? window.location.origin + "/play-wend" : "https://wendanswertoday.org/play-wend",
        });
        setStatus("Result shared.");
        return;
      } catch {
        // Fall back to clipboard below.
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareText);
        setStatus("Result copied to clipboard.");
        return;
      } catch {
        // Ignore clipboard failures and leave the status below.
      }
    }

    setStatus("Sharing is unavailable in this browser.");
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(320px,520px)_1fr] lg:items-start">
      <div className="order-1">
        <WendGrid
          answers={puzzle.answers}
          grid={puzzle.grid}
          onCellClick={handleCellClick}
          selectedCells={selectedKeys}
          visibleLetters={new Set()}
          visibleWords={foundWordSet}
        />
      </div>

      <div className="order-2 wend-answer-panel space-y-5">
        <div className="grid gap-2 sm:grid-cols-2">
          <button className="btn btn-primary gap-2 rounded-full" onClick={submitWord} type="button">
            <Send aria-hidden className="h-5 w-5" />
            Submit Word
          </button>
          <button className="btn btn-ghost gap-2 rounded-full border-brand text-brand" onClick={clearPath} type="button">
            <RotateCcw aria-hidden className="h-5 w-5" />
            Clear Path
          </button>
          <button className="btn btn-ghost gap-2 rounded-full border-brand text-brand" onClick={undoStep} type="button">
            <Undo2 aria-hidden className="h-5 w-5" />
            Undo
          </button>
          <button className="btn btn-secondary gap-2 rounded-full" onClick={revealHint} type="button">
            <Lightbulb aria-hidden className="h-5 w-5" />
            Hint
          </button>
        </div>

        <div className="rounded-lg border border-line bg-slate-50 p-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-black uppercase tracking-normal text-slate-500">Selected path</p>
            <p className={`text-xs font-black uppercase tracking-normal ${solved ? "text-success" : "text-brand"}`}>
              {solved ? "Solved" : "In progress"}
            </p>
          </div>
          <p className="mt-1 min-h-8 text-2xl font-black tracking-normal text-ink">{currentWord || "..."}</p>
          <p aria-live="polite" className="mt-1 text-sm font-semibold text-slate-600" data-testid="wend-unlimited-status">
            {status}
          </p>
          <p className="mt-2 text-xs font-black uppercase tracking-normal text-slate-500">
            Saved locally in this browser
          </p>
        </div>

        {currentHint ? (
          <div className="rounded-lg border border-line bg-white p-3">
            <p className="text-xs font-black uppercase tracking-normal text-slate-500">
              Hint {Math.min(hintIndex, puzzle.hints.length)}
            </p>
            <p className="mt-1 text-sm font-black text-ink">{currentHint.title}</p>
            <p className="mt-1 text-sm leading-6 text-slate-700">{currentHint.text}</p>
          </div>
        ) : null}

        <div>
          <div className="flex items-center justify-between gap-4">
            <p className="font-black text-ink">Words found</p>
            <p aria-live="polite" className="text-sm font-semibold text-slate-600" data-testid="wend-words-found">
              {foundWords.size} / {puzzle.answers.length}
            </p>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-700 to-cyan-400 transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
          {solved ? (
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-sm font-black text-success">
              <BadgeCheck aria-hidden className="h-4 w-4" />
              Solved locally
            </div>
          ) : null}
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-2">
          {puzzle.answers.map((answer, wordIndex) => {
            const color = wordColors[wordIndex % wordColors.length];
            const isComplete = foundWords.has(answer.word);

            return (
              <div
                className={`wend-word-card ${isComplete ? "wend-word-card-complete" : ""}`}
                key={answer.word}
                style={{ "--word-color": color } as WordStyle}
              >
                <div className="flex flex-wrap items-center gap-2" aria-label={`${answer.word.length} letter answer`}>
                  {answer.word.split("").map((letter, index) => (
                    <span
                      className={`wend-letter-bubble ${isComplete ? "wend-letter-bubble-visible" : "wend-letter-bubble-hidden"}`}
                      key={`${answer.word}-${index}`}
                    >
                      {isComplete ? letter : ""}
                    </span>
                  ))}
                </div>
                <p className="flex items-center gap-2 text-lg font-black uppercase tracking-wide" style={{ color }}>
                  {isComplete ? (
                    <>
                      <Check aria-hidden className="h-5 w-5" />
                      {answer.word}
                    </>
                  ) : (
                    "Hidden word"
                  )}
                </p>
              </div>
            );
          })}
        </div>

        <button className="btn btn-ghost gap-2 rounded-full border-brand text-brand" onClick={shareResult} type="button">
          <Share2 aria-hidden className="h-5 w-5" />
          Share result
        </button>
      </div>
    </section>
  );
}
