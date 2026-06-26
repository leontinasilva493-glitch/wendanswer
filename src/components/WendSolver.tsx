"use client";

import { useMemo, useState } from "react";
import type { WendPuzzle } from "@/lib/puzzles";
import { WendGrid } from "./WendGrid";

export function WendSolver({ puzzle }: { puzzle: WendPuzzle }) {
  const [visibleWords, setVisibleWords] = useState<Set<string>>(new Set());
  const [visibleLetters, setVisibleLetters] = useState<Set<string>>(new Set());

  const nextWord = puzzle.answers.find((answer) => !visibleWords.has(answer.word));
  const firstLetter = puzzle.answers[0]?.path[0];
  const progress = puzzle.answers.length === 0 ? 0 : (visibleWords.size / puzzle.answers.length) * 100;

  const wordSet = useMemo(() => new Set(visibleWords), [visibleWords]);
  const letterSet = useMemo(() => new Set(visibleLetters), [visibleLetters]);

  function revealWord(word?: string) {
    const target = word ?? nextWord?.word;
    if (!target) return;
    setVisibleWords((current) => new Set([...current, target]));
  }

  function revealLetter() {
    if (!firstLetter) return;
    setVisibleLetters((current) => new Set([...current, `${firstLetter[0]}-${firstLetter[1]}`]));
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
      <div className="order-2 space-y-4 lg:order-1">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <button className="btn btn-secondary" onClick={revealLetter} type="button">
            Reveal One Letter
          </button>
          <button className="btn btn-primary" onClick={() => revealWord()} type="button">
            Reveal One Word
          </button>
          <button
            className="btn btn-success"
            onClick={() => setVisibleWords(new Set(puzzle.answers.map((answer) => answer.word)))}
            type="button"
          >
            Reveal Full Path
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => {
              setVisibleWords(new Set());
              setVisibleLetters(new Set());
            }}
            type="button"
          >
            Clear All
          </button>
        </div>

        <div className="rounded-lg border border-line bg-white p-4">
          <div className="flex items-center justify-between gap-4">
            <p className="font-semibold text-ink">Words Found</p>
            <p aria-live="polite" className="text-sm text-slate-600" data-testid="wend-words-found">
              {visibleWords.size} / {puzzle.answers.length}
            </p>
          </div>
          <div className="mt-3 h-2 rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full bg-success"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {puzzle.answers.map((answer) => (
              <button
                className="min-h-11 rounded-lg border border-line px-3 py-2 text-left text-sm font-semibold hover:border-brand"
                key={answer.word}
                onClick={() => revealWord(answer.word)}
                type="button"
              >
                {visibleWords.has(answer.word) ? answer.word : "Hidden word"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="order-1 lg:order-2">
        <WendGrid
          answers={puzzle.answers}
          grid={puzzle.grid}
          onCellClick={(answer) => revealWord(answer.word)}
          visibleLetters={letterSet}
          visibleWords={wordSet}
        />
      </div>
    </section>
  );
}
