"use client";

import { useMemo, useState } from "react";
import { Eye, Puzzle } from "lucide-react";
import type { Cell, WendAnswer, WendPuzzle } from "@/lib/puzzles";
import { WendGrid } from "./WendGrid";

function cellKey(cell: Cell) {
  return `${cell[0]}-${cell[1]}`;
}

function letterKey(answer: WendAnswer, index: number) {
  return `${answer.word}-${index}`;
}

function classNames(...items: Array<string | false | null | undefined>) {
  return items.filter(Boolean).join(" ");
}

export function WendAnswerReveal({ puzzle, archived = false }: { puzzle: WendPuzzle; archived?: boolean }) {
  const [visibleWords, setVisibleWords] = useState<Set<string>>(new Set());
  const [visibleLetters, setVisibleLetters] = useState<Set<string>>(new Set());

  const wordSet = useMemo(() => new Set(visibleWords), [visibleWords]);
  const cellSet = useMemo(() => {
    const keys = new Set<string>();
    for (const answer of puzzle.answers) {
      answer.path.forEach((cell, index) => {
        if (visibleWords.has(answer.word) || visibleLetters.has(letterKey(answer, index))) {
          keys.add(cellKey(cell));
        }
      });
    }
    return keys;
  }, [puzzle.answers, visibleLetters, visibleWords]);

  function revealWord(answer: WendAnswer) {
    setVisibleWords((current) => new Set([...current, answer.word]));
  }

  function revealCell(answer: WendAnswer, cell: Cell) {
    const index = answer.path.findIndex((candidate) => candidate[0] === cell[0] && candidate[1] === cell[1]);
    if (index < 0) return;
    setVisibleLetters((current) => new Set([...current, letterKey(answer, index)]));
  }

  function revealAll() {
    setVisibleWords(new Set(puzzle.answers.map((answer) => answer.word)));
  }

  function clearAll() {
    setVisibleWords(new Set());
    setVisibleLetters(new Set());
  }

  return (
    <section className="content-card">
      <div className="flex flex-wrap items-start gap-4">
        <span className="section-icon">
          <Puzzle aria-hidden className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h2 className="text-2xl font-black tracking-normal text-ink md:text-3xl">
            {archived ? `Wend #${puzzle.puzzleNumber} Answer` : "Today's LinkedIn Wend Answer"}
          </h2>
          <p className="mt-2 text-sm font-semibold text-slate-600">
            {puzzle.dateLabel} - Wend #{puzzle.puzzleNumber} - {puzzle.difficulty} - {puzzle.answers.length} words
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(280px,440px)_1fr] lg:items-start">
        <div className="mx-auto w-full max-w-[440px]">
          <WendGrid
            answers={puzzle.answers}
            grid={puzzle.grid}
            onCellClick={revealCell}
            visibleLetters={cellSet}
            visibleWords={wordSet}
          />
        </div>

        <div className="border-line lg:border-l lg:pl-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <button className="btn btn-primary gap-2" onClick={revealAll} type="button">
              <Eye aria-hidden className="h-5 w-5" />
              Reveal all
            </button>
            <button className="btn btn-ghost gap-2 border-brand text-brand" onClick={clearAll} type="button">
              Clear all
            </button>
          </div>

          <p aria-live="polite" className="mt-4 text-sm font-semibold text-slate-600">
            {visibleWords.size} of {puzzle.answers.length} words revealed
          </p>

          <div className="mt-4 space-y-3">
            {puzzle.answers.map((answer) => {
              const isWordVisible = visibleWords.has(answer.word);
              return (
                <div className="grid items-center gap-3 sm:grid-cols-[1fr_auto]" key={answer.word}>
                  <div className="flex flex-wrap gap-1.5" aria-label={`${answer.word.length} letter answer`}>
                    {answer.word.split("").map((letter, index) => {
                      const isLetterVisible = isWordVisible || visibleLetters.has(letterKey(answer, index));
                      return (
                        <span
                          className={classNames(
                            "flex h-9 w-9 items-center justify-center rounded-md border text-sm font-black",
                            isLetterVisible
                              ? "border-blue-200 bg-blue-100 text-blue-950"
                              : "border-slate-200 bg-slate-100 text-slate-100",
                          )}
                          key={`${answer.word}-${index}`}
                        >
                          {isLetterVisible ? letter : ""}
                        </span>
                      );
                    })}
                  </div>
                  <button className="btn btn-ghost min-h-9 px-4 py-1.5 text-brand" onClick={() => revealWord(answer)} type="button">
                    Get Word
                  </button>
                  {isWordVisible ? (
                    <p className="text-sm font-semibold text-slate-700 sm:col-span-2">
                      {answer.word}: {answer.path.map((cell) => `r${cell[0] + 1}c${cell[1] + 1}`).join(" -> ")}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
