"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Eye, Lightbulb, RotateCcw, Share2, Sparkles, Undo2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type { Cell, WendAnswer, WendPuzzle } from "@/lib/puzzles";
import { WendGrid } from "./WendGrid";

type ProgressSnapshot = {
  visibleLetters: string[];
  visibleWords: string[];
};

type WendUnlimitedToolProps = {
  currentPracticeNumber: number;
  letterCount: number;
  nextHref: string | null;
  previousHref: string | null;
  puzzle: WendPuzzle;
  totalPuzzles: number;
};

type WordStyle = CSSProperties & Record<"--word-color", string>;

const wordColors = ["#e8572a", "#d4449a", "#4dbdba", "#98c21f", "#5b8dd9", "#f05a28"];

function cellKey(cell: Cell) {
  return `${cell[0]}-${cell[1]}`;
}

function storageKey(puzzleNumber: number) {
  return `wend-unlimited-progress-v1:${puzzleNumber}`;
}

function practiceHref(puzzleNumber: number) {
  return `/wend-unlimited?puzzle=${puzzleNumber}`;
}

function snapshotFromSets(visibleLetters: Set<string>, visibleWords: Set<string>): ProgressSnapshot {
  return {
    visibleLetters: [...visibleLetters],
    visibleWords: [...visibleWords],
  };
}

export function WendUnlimitedTool({
  currentPracticeNumber,
  letterCount,
  nextHref,
  previousHref,
  puzzle,
  totalPuzzles,
}: WendUnlimitedToolProps) {
  const router = useRouter();
  const [visibleWords, setVisibleWords] = useState<Set<string>>(new Set());
  const [visibleLetters, setVisibleLetters] = useState<Set<string>>(new Set());
  const [history, setHistory] = useState<ProgressSnapshot[]>([]);
  const [shareState, setShareState] = useState("Share result");
  const [loadedPuzzleNumber, setLoadedPuzzleNumber] = useState<number | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey(puzzle.puzzleNumber));
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as ProgressSnapshot;
        setVisibleLetters(new Set(parsed.visibleLetters ?? []));
        setVisibleWords(new Set(parsed.visibleWords ?? []));
      } catch {
        setVisibleLetters(new Set());
        setVisibleWords(new Set());
      }
    } else {
      setVisibleLetters(new Set());
      setVisibleWords(new Set());
    }
    setHistory([]);
    setShareState("Share result");
    setLoadedPuzzleNumber(puzzle.puzzleNumber);
  }, [puzzle.puzzleNumber]);

  useEffect(() => {
    if (loadedPuzzleNumber !== puzzle.puzzleNumber) return;
    window.localStorage.setItem(storageKey(puzzle.puzzleNumber), JSON.stringify(snapshotFromSets(visibleLetters, visibleWords)));
  }, [loadedPuzzleNumber, puzzle.puzzleNumber, visibleLetters, visibleWords]);

  const completedWords = useMemo(() => {
    return puzzle.answers.filter((answer) => {
      if (visibleWords.has(answer.word)) return true;
      return answer.path.every((cell) => visibleLetters.has(cellKey(cell)));
    });
  }, [puzzle.answers, visibleLetters, visibleWords]);

  const wordSet = useMemo(() => new Set(visibleWords), [visibleWords]);
  const solved = puzzle.answers.length > 0 && completedWords.length === puzzle.answers.length;
  const progress = puzzle.answers.length === 0 ? 0 : Math.round((completedWords.length / puzzle.answers.length) * 100);

  function rememberCurrentState() {
    setHistory((current) => [...current.slice(-9), snapshotFromSets(visibleLetters, visibleWords)]);
  }

  function revealCell(answer: WendAnswer, cell: Cell) {
    if (!answer.path.some((candidate) => candidate[0] === cell[0] && candidate[1] === cell[1])) return;
    const key = cellKey(cell);
    if (visibleLetters.has(key)) return;
    rememberCurrentState();
    setVisibleLetters((current) => new Set([...current, key]));
  }

  function revealHint() {
    const nextAnswer = puzzle.answers.find((answer) => {
      if (visibleWords.has(answer.word)) return false;
      return answer.path.some((cell) => !visibleLetters.has(cellKey(cell)));
    });
    const nextCell = nextAnswer?.path.find((cell) => !visibleLetters.has(cellKey(cell)));
    if (!nextAnswer || !nextCell) return;
    rememberCurrentState();
    setVisibleLetters((current) => new Set([...current, cellKey(nextCell)]));
  }

  function revealWord(answer: WendAnswer) {
    if (visibleWords.has(answer.word)) return;
    rememberCurrentState();
    setVisibleWords((current) => new Set([...current, answer.word]));
  }

  function revealAll() {
    if (solved) return;
    rememberCurrentState();
    setVisibleWords(new Set(puzzle.answers.map((answer) => answer.word)));
  }

  function resetPuzzle() {
    rememberCurrentState();
    setVisibleLetters(new Set());
    setVisibleWords(new Set());
  }

  function undo() {
    const previous = history.at(-1);
    if (!previous) return;
    setVisibleLetters(new Set(previous.visibleLetters));
    setVisibleWords(new Set(previous.visibleWords));
    setHistory((current) => current.slice(0, -1));
  }

  function goToNewPuzzle() {
    const candidates = Array.from({ length: totalPuzzles }, (_, index) => index + 1).filter((number) => number !== currentPracticeNumber);
    const nextNumber = candidates[Math.floor(Math.random() * candidates.length)] ?? currentPracticeNumber;
    router.push(practiceHref(nextNumber));
  }

  async function shareResult() {
    const text = `I practiced Wend #${puzzle.puzzleNumber}: ${completedWords.length}/${puzzle.answers.length} words found on Wend Unlimited.`;
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ text, title: "Wend Unlimited result", url });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${text} ${url}`);
      }
      setShareState("Result copied");
    } catch {
      setShareState("Share result");
    }
  }

  return (
    <section className="section content-card" id="play">
      <div className="grid gap-3 border-b border-line pb-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        {previousHref ? (
          <Link className="btn btn-ghost justify-center border-brand text-brand" href={previousHref}>
            Previous
          </Link>
        ) : (
          <span aria-disabled="true" className="btn btn-ghost justify-center border-slate-200 text-slate-400">
            Previous
          </span>
        )}
        <div className="text-center">
          <p className="text-lg font-black text-ink">
            Wend Unlimited Puzzle {currentPracticeNumber} of {totalPuzzles}
          </p>
          <p className="mt-1 text-xs font-bold uppercase tracking-normal text-slate-500">
            Puzzle #{puzzle.puzzleNumber} / Difficulty {puzzle.difficulty} / Letters {letterCount}
          </p>
        </div>
        {nextHref ? (
          <Link className="btn btn-primary justify-center" href={nextHref}>
            Next
          </Link>
        ) : (
          <span aria-disabled="true" className="btn btn-ghost justify-center border-slate-200 text-slate-400">
            Next
          </span>
        )}
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(320px,520px)_1fr] lg:items-start">
        <div>
          <WendGrid
            answers={puzzle.answers}
            grid={puzzle.grid}
            onCellClick={revealCell}
            visibleLetters={visibleLetters}
            visibleWords={wordSet}
          />
          <p className={`mt-3 text-center text-sm font-black ${solved ? "text-green-700" : "text-slate-600"}`} aria-live="polite">
            {solved ? "Solved. Your local progress is saved on this device." : "Tap letters or use Hint to reveal the path step by step."}
          </p>
        </div>

        <div className="wend-answer-panel space-y-5">
          <div className="grid gap-2 sm:grid-cols-2">
            <button className="btn btn-primary gap-2 rounded-full" onClick={goToNewPuzzle} type="button">
              <Sparkles aria-hidden className="h-5 w-5" />
              New puzzle
            </button>
            <button className="btn btn-ghost gap-2 rounded-full border-brand text-brand" onClick={revealHint} type="button">
              <Lightbulb aria-hidden className="h-5 w-5" />
              Hint
            </button>
            <button className="btn btn-ghost gap-2 rounded-full border-brand text-brand" disabled={history.length === 0} onClick={undo} type="button">
              <Undo2 aria-hidden className="h-5 w-5" />
              Undo
            </button>
            <button className="btn btn-ghost gap-2 rounded-full border-brand text-brand" onClick={shareResult} type="button">
              <Share2 aria-hidden className="h-5 w-5" />
              {shareState}
            </button>
            <button className="btn btn-success gap-2 rounded-full" onClick={revealAll} type="button">
              <Eye aria-hidden className="h-5 w-5" />
              Reveal path
            </button>
            <button className="btn btn-ghost gap-2 rounded-full border-brand text-brand" onClick={resetPuzzle} type="button">
              <RotateCcw aria-hidden className="h-5 w-5" />
              Reset
            </button>
          </div>

          <div>
            <div className="flex items-center justify-between gap-4">
              <p className="font-black text-ink">Solved state</p>
              <p aria-live="polite" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
                {solved ? <CheckCircle2 aria-hidden className="h-4 w-4 text-green-700" /> : null}
                {completedWords.length} / {puzzle.answers.length} words
              </p>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-gradient-to-r from-blue-700 to-cyan-400 transition-all duration-700" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {puzzle.answers.map((answer, wordIndex) => {
              const color = wordColors[wordIndex % wordColors.length];
              const isWordVisible = visibleWords.has(answer.word);
              const isComplete = isWordVisible || answer.path.every((cell) => visibleLetters.has(cellKey(cell)));

              return (
                <div
                  className={`wend-word-card ${isComplete ? "wend-word-card-complete" : ""}`}
                  key={answer.word}
                  style={{ "--word-color": color } as WordStyle}
                >
                  <div className="flex flex-wrap items-center gap-2" aria-label={`${answer.word.length} letter answer`}>
                    {answer.word.split("").map((letter, index) => {
                      const isLetterVisible = isWordVisible || visibleLetters.has(cellKey(answer.path[index]));
                      return (
                        <span
                          className={`wend-letter-bubble ${isLetterVisible ? "wend-letter-bubble-visible" : "wend-letter-bubble-hidden"}`}
                          key={`${answer.word}-${index}`}
                        >
                          {isLetterVisible ? letter : ""}
                        </span>
                      );
                    })}
                  </div>
                  <p className="text-base font-black uppercase tracking-normal" style={{ color }}>
                    {isComplete ? answer.word : "Hidden word"}
                  </p>
                  <button className="wend-word-action wend-word-action-solid" disabled={isComplete} onClick={() => revealWord(answer)} type="button">
                    Reveal Word
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
