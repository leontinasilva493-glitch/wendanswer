"use client";

import type { CSSProperties } from "react";
import type { Cell, WendAnswer } from "@/lib/puzzles";

type WordStyle = CSSProperties & Record<"--word-color", string>;

const colors = [
  "#e8572a",
  "#d4449a",
  "#4dbdba",
  "#98c21f",
  "#5b8dd9",
  "#f05a28",
];

function sameCell(a: Cell, b: Cell) {
  return a[0] === b[0] && a[1] === b[1];
}

function cellKey(cell: Cell) {
  return `${cell[0]}-${cell[1]}`;
}

function pathIndex(cell: Cell, answers: WendAnswer[], visibleWords: Set<string>, visibleLetters: Set<string>) {
  for (let wordIndex = 0; wordIndex < answers.length; wordIndex += 1) {
    const answer = answers[wordIndex];
    const step = answer.path.findIndex((candidate) => sameCell(candidate, cell));
    if (step < 0) continue;
    if (visibleWords.has(answer.word) || visibleLetters.has(cellKey(cell))) return { answer, wordIndex, step };
  }
  return null;
}

function horizontalEdgeStyle(isStart: boolean, isEnd: boolean) {
  if (!isStart && !isEnd) return "0px";
  if (isStart && isEnd) return "999px";
  if (isStart) return "999px 0 0 999px";
  return "0 999px 999px 0";
}

function verticalEdgeStyle(isStart: boolean, isEnd: boolean) {
  if (!isStart && !isEnd) return "0px";
  if (isStart && isEnd) return "999px";
  if (isStart) return "999px 999px 0 0";
  return "0 0 999px 999px";
}

export function WendGrid({
  grid,
  answers,
  visibleWords,
  visibleLetters,
  onCellClick,
  selectedCells,
}: {
  grid: Array<Array<string | null>>;
  answers: WendAnswer[];
  visibleWords: Set<string>;
  visibleLetters: Set<string>;
  onCellClick?: (answer: WendAnswer, cell: Cell) => void;
  selectedCells?: Set<string>;
}) {
  const columnCount = grid[0]?.length ?? 0;

  function isBlockedCell(row: number, col: number) {
    return grid[row]?.[col] === null;
  }

  function blockedBorders(row: number, col: number) {
    return [
      !isBlockedCell(row - 1, col) ? "border-t-[#444] border-t-[5px]" : "border-t-0",
      !isBlockedCell(row + 1, col) ? "border-b-[#444] border-b-[5px]" : "border-b-0",
      !isBlockedCell(row, col - 1) ? "border-l-[#444] border-l-[5px]" : "border-l-0",
      !isBlockedCell(row, col + 1) ? "border-r-[#444] border-r-[5px]" : "border-r-0",
    ].join(" ");
  }

  return (
    <div className="notranslate mx-auto w-full max-w-[520px]" lang="en" translate="no">
      <div
        className="notranslate grid aspect-square overflow-hidden rounded-2xl border-[3px] border-[#2f2f2f] bg-white shadow-[0_14px_42px_rgba(15,23,42,0.16)]"
        style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
        translate="no"
      >
        {grid.flatMap((row, rowIndex) =>
          row.map((letter, colIndex) => {
            const cell: Cell = [rowIndex, colIndex];
            const key = `${rowIndex}-${colIndex}`;
            if (letter === null) {
              return (
                <div
                  aria-label={`blocked r${rowIndex + 1} c${colIndex + 1}`}
                  className={`notranslate wend-cell wend-cell-blocked ${blockedBorders(rowIndex, colIndex)}`}
                  key={key}
                  translate="no"
                />
              );
            }

            const path = pathIndex(cell, answers, visibleWords, visibleLetters);
            const answer = answers.find((candidate) =>
              candidate.path.some((candidateCell) => sameCell(candidateCell, cell)),
            );
            const color = answer ? colors[answers.indexOf(answer) % colors.length] : "#0a66c2";
            const isHintVisible = visibleLetters.has(key);
            const isSelected = selectedCells?.has(key) ?? false;
            const isRevealed = Boolean(path);
            const previous = path && path.step > 0 ? path.answer.path[path.step - 1] : null;
            const next = path && path.step < path.answer.path.length - 1 ? path.answer.path[path.step + 1] : null;
            const connectLeft = [previous, next].some((candidate) => candidate && candidate[0] === rowIndex && candidate[1] === colIndex - 1);
            const connectRight = [previous, next].some((candidate) => candidate && candidate[0] === rowIndex && candidate[1] === colIndex + 1);
            const connectTop = [previous, next].some((candidate) => candidate && candidate[0] === rowIndex - 1 && candidate[1] === colIndex);
            const connectBottom = [previous, next].some((candidate) => candidate && candidate[0] === rowIndex + 1 && candidate[1] === colIndex);

            return (
              <button
                aria-label={`${letter} r${rowIndex + 1} c${colIndex + 1}`}
                className={`notranslate wend-cell wend-cell-letter ${isRevealed ? "wend-cell-revealed" : isSelected ? "wend-cell-selected" : isHintVisible ? "wend-cell-hinted" : ""}`}
                data-letter={letter}
                key={key}
                onClick={() => answer && onCellClick?.(answer, cell)}
                style={{ "--word-color": color } as WordStyle}
                translate="no"
                type="button"
              >
                {isRevealed ? (
                  <>
                    {connectLeft || connectRight ? (
                      <span
                        className="wend-cell-tube wend-cell-tube-h"
                        style={{
                          left: connectLeft ? 0 : "22.5%",
                          right: connectRight ? 0 : "22.5%",
                          borderRadius: horizontalEdgeStyle(!connectLeft, !connectRight),
                        }}
                      />
                    ) : null}
                    {connectTop || connectBottom ? (
                      <span
                        className="wend-cell-tube wend-cell-tube-v"
                        style={{
                          top: connectTop ? 0 : "22.5%",
                          bottom: connectBottom ? 0 : "22.5%",
                          borderRadius: verticalEdgeStyle(!connectTop, !connectBottom),
                        }}
                      />
                    ) : null}
                    {path?.step === 0 ? (
                      <>
                        <span className="wend-cell-start" />
                        <span aria-hidden className="wend-cell-check">
                          ✓
                        </span>
                      </>
                    ) : null}
                  </>
                ) : null}
                <span aria-hidden className="notranslate wend-cell-letter-text" data-letter={letter} translate="no" />
              </button>
            );
          }),
        )}
      </div>
    </div>
  );
}
