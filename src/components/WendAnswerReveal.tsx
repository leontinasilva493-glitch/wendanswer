"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { Eye, EyeOff, Puzzle, RotateCcw } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import type { Cell, WendAnswer, WendPuzzle } from "@/lib/puzzles";
import { WendGrid } from "./WendGrid";

const wordColors = ["#e8572a", "#d4449a", "#4dbdba", "#98c21f", "#5b8dd9", "#f05a28"];
type WordStyle = CSSProperties & Record<"--word-color", string>;

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
  const completeWords = useMemo(() => {
    return puzzle.answers.filter((answer) => {
      if (visibleWords.has(answer.word)) return true;
      return answer.path.every((_, index) => visibleLetters.has(letterKey(answer, index)));
    });
  }, [puzzle.answers, visibleLetters, visibleWords]);

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
  const progress = puzzle.answers.length === 0 ? 0 : Math.round((completeWords.length / puzzle.answers.length) * 100);
  const pageType = archived ? "archive" : "today";

  function trackReveal(action: string, answer?: WendAnswer) {
    trackEvent("Wend Reveal", {
      action,
      pageType,
      puzzleNumber: puzzle.puzzleNumber,
      word: answer?.word ?? "all",
    });
  }

  function revealWord(answer: WendAnswer) {
    trackReveal("word", answer);
    setVisibleWords((current) => new Set([...current, answer.word]));
  }

  function revealNextLetter(answer: WendAnswer) {
    const nextIndex = answer.path.findIndex((_, index) => !visibleLetters.has(letterKey(answer, index)));
    if (nextIndex < 0) return;
    trackReveal("letter", answer);
    setVisibleLetters((current) => new Set([...current, letterKey(answer, nextIndex)]));
  }

  function revealCell(answer: WendAnswer, cell: Cell) {
    const index = answer.path.findIndex((candidate) => candidate[0] === cell[0] && candidate[1] === cell[1]);
    if (index < 0) return;
    trackReveal("cell", answer);
    setVisibleLetters((current) => new Set([...current, letterKey(answer, index)]));
  }

  function revealAll() {
    trackReveal("all");
    setVisibleWords(new Set(puzzle.answers.map((answer) => answer.word)));
  }

  function clearAll() {
    setVisibleWords(new Set());
    setVisibleLetters(new Set());
  }

  return (
    <section className="content-card wend-answer-card">
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

      <p className="mt-5 max-w-3xl text-base font-semibold leading-7 text-slate-700 md:text-lg md:leading-8">
        Our <strong className="font-black text-ink">Wend solver</strong> helps you reveal hidden words at your own
        pace: click any letter cell to reveal just that letter, use the hint buttons to move through the answer one
        letter at a time, or check the hint cards below when you want an extra nudge.
      </p>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(300px,500px)_minmax(360px,1fr)] lg:items-start xl:grid-cols-[minmax(340px,520px)_minmax(440px,1fr)]">
        <div className="mx-auto flex w-full max-w-[500px] flex-col items-center gap-3">
          <WendGrid
            answers={puzzle.answers}
            grid={puzzle.grid}
            onCellClick={revealCell}
            visibleLetters={cellSet}
            visibleWords={wordSet}
          />
          <button className="btn btn-ghost gap-2 rounded-full px-6" onClick={clearAll} type="button">
            <EyeOff aria-hidden className="h-5 w-5" />
            Clear all
          </button>
        </div>

        <div className="wend-answer-panel lg:pl-1">
          <div className="grid gap-3 sm:grid-cols-2">
            <button className="btn btn-primary gap-2 rounded-full" onClick={revealAll} type="button">
              <Eye aria-hidden className="h-5 w-5" />
              Reveal all
            </button>
            <button className="btn btn-ghost gap-2 rounded-full border-brand text-brand" onClick={clearAll} type="button">
              <RotateCcw aria-hidden className="h-5 w-5" />
              Clear all
            </button>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between gap-4">
              <p aria-live="polite" className="text-base font-black text-slate-700">
                Words found: {completeWords.length} / {puzzle.answers.length}
              </p>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-700 to-cyan-400 transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-2">
            {puzzle.answers.map((answer, wordIndex) => {
              const isWordVisible = visibleWords.has(answer.word);
              const color = wordColors[wordIndex % wordColors.length];
              const isComplete = isWordVisible || answer.path.every((_, index) => visibleLetters.has(letterKey(answer, index)));
              return (
                <div
                  className={`wend-word-card ${isComplete ? "wend-word-card-complete" : ""}`}
                  key={answer.word}
                  style={{ "--word-color": color } as WordStyle}
                >
                  <div className="flex flex-wrap items-center gap-1.5" aria-label={`${answer.word.length} letter answer`}>
                    {answer.word.split("").map((letter, index) => {
                      const isLetterVisible = isWordVisible || visibleLetters.has(letterKey(answer, index));
                      return (
                        <span
                          className={classNames("wend-letter-bubble", isLetterVisible ? "wend-letter-bubble-visible" : "wend-letter-bubble-hidden")}
                          key={`${answer.word}-${index}`}
                        >
                          {isLetterVisible ? letter : ""}
                        </span>
                      );
                    })}
                  </div>
                  <p className="text-base font-black uppercase tracking-wide" style={{ color }}>
                    {isComplete ? answer.word : "Hidden word"}
                  </p>
                  {!isComplete ? (
                    <div className="flex flex-wrap gap-1.5">
                      <button className="wend-word-action wend-word-action-light" onClick={() => revealNextLetter(answer)} type="button">
                        Reveal Letter
                      </button>
                      <button className="wend-word-action wend-word-action-solid" onClick={() => revealWord(answer)} type="button">
                        Reveal Word
                      </button>
                    </div>
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
