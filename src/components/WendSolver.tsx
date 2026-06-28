"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { Eye, RotateCcw } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import type { Cell, WendAnswer, WendPuzzle } from "@/lib/puzzles";
import { WendGrid } from "./WendGrid";

const wordColors = ["#e8572a", "#d4449a", "#4dbdba", "#98c21f", "#5b8dd9", "#f05a28"];
type WordStyle = CSSProperties & Record<"--word-color", string>;

function cellKey(cell: Cell) {
  return `${cell[0]}-${cell[1]}`;
}

export function WendSolver({ puzzle }: { puzzle: WendPuzzle }) {
  const [visibleWords, setVisibleWords] = useState<Set<string>>(new Set());
  const [visibleLetters, setVisibleLetters] = useState<Set<string>>(new Set());

  const completedWords = useMemo(() => {
    return puzzle.answers.filter((answer) => {
      if (visibleWords.has(answer.word)) return true;
      return answer.path.every((cell) => visibleLetters.has(cellKey(cell)));
    });
  }, [puzzle.answers, visibleLetters, visibleWords]);

  const nextWord = puzzle.answers.find((answer) => !completedWords.includes(answer));
  const wordSet = useMemo(() => new Set(visibleWords), [visibleWords]);
  const progress = puzzle.answers.length === 0 ? 0 : Math.round((completedWords.length / puzzle.answers.length) * 100);

  function trackSolverReveal(action: string, answer?: WendAnswer) {
    trackEvent("Wend Solver Reveal", {
      action,
      pageType: "solver",
      puzzleNumber: puzzle.puzzleNumber,
      word: answer?.word ?? "all",
    });
  }

  function revealCell(answer: WendAnswer, cell: Cell) {
    if (!answer.path.some((candidate) => candidate[0] === cell[0] && candidate[1] === cell[1])) return;
    trackSolverReveal("cell", answer);
    setVisibleLetters((current) => new Set([...current, cellKey(cell)]));
  }

  function revealWord(word?: string) {
    const target = word ?? nextWord?.word;
    if (!target) return;
    const answer = puzzle.answers.find((candidate) => candidate.word === target);
    trackSolverReveal("word", answer);
    setVisibleWords((current) => new Set([...current, target]));
  }

  function revealLetter(answer = nextWord) {
    if (!answer) return;
    const nextCell = answer.path.find((cell) => !visibleLetters.has(cellKey(cell)));
    if (!nextCell) return;
    trackSolverReveal("letter", answer);
    setVisibleLetters((current) => new Set([...current, cellKey(nextCell)]));
  }

  function revealAll() {
    trackSolverReveal("all");
    setVisibleWords(new Set(puzzle.answers.map((answer) => answer.word)));
  }

  function clearAll() {
    setVisibleWords(new Set());
    setVisibleLetters(new Set());
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(320px,520px)_1fr] lg:items-start">
      <div className="order-1">
        <WendGrid
          answers={puzzle.answers}
          grid={puzzle.grid}
          onCellClick={revealCell}
          visibleLetters={visibleLetters}
          visibleWords={wordSet}
        />
      </div>

      <div className="order-2 wend-answer-panel space-y-5">
        <div className="grid gap-2 sm:grid-cols-2">
          <button className="btn btn-ghost rounded-full border-brand text-brand" onClick={() => revealLetter()} type="button">
            Reveal One Letter
          </button>
          <button className="btn btn-primary rounded-full" onClick={() => revealWord()} type="button">
            Reveal One Word
          </button>
          <button className="btn btn-success gap-2 rounded-full" onClick={revealAll} type="button">
            <Eye aria-hidden className="h-5 w-5" />
            Reveal Full Path
          </button>
          <button className="btn btn-ghost gap-2 rounded-full border-brand text-brand" onClick={clearAll} type="button">
            <RotateCcw aria-hidden className="h-5 w-5" />
            Clear All
          </button>
        </div>

        <div>
          <div className="flex items-center justify-between gap-4">
            <p className="font-black text-ink">Words found</p>
            <p aria-live="polite" className="text-sm font-semibold text-slate-600" data-testid="wend-words-found">
              {completedWords.length} / {puzzle.answers.length}
            </p>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-700 to-cyan-400 transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-2">
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
                <p className="text-lg font-black uppercase tracking-wide" style={{ color }}>
                  {isComplete ? answer.word : "Hidden word"}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button className="wend-word-action wend-word-action-light" disabled={isComplete} onClick={() => revealLetter(answer)} type="button">
                    Reveal Letter
                  </button>
                  <button className="wend-word-action wend-word-action-solid" disabled={isComplete} onClick={() => revealWord(answer.word)} type="button">
                    Reveal Word
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
