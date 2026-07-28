"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { wendArchiveSlug } from "@/lib/dates";
import {
  archiveGridSize,
  archiveMonthKey,
  archiveMonthLabel,
  defaultArchiveFilters,
  filterArchivePuzzles,
  type ArchiveFilters,
} from "@/lib/wend-archive";
import type { WendPuzzle } from "@/lib/puzzles";

type ArchiveListVariant = "full" | "preview";

function ArchivePreview({ puzzles }: { puzzles: WendPuzzle[] }) {
  return (
    <div className="recent-puzzle-grid">
      {puzzles.map((puzzle) => (
        <Link
          aria-label={`View Wend #${puzzle.puzzleNumber} answer for ${puzzle.dateLabel}`}
          className="recent-puzzle-card"
          href={`/${wendArchiveSlug(puzzle.puzzleNumber, puzzle.dateLabel)}`}
          key={puzzle.date}
        >
          <span className="text-4xl font-black tracking-normal text-ink">#{puzzle.puzzleNumber}</span>
          <span className="text-lg font-black text-ink">{puzzle.dateLabel}</span>
          <span className="mt-auto flex items-center justify-between gap-4 text-base font-black text-slate-600">
            <span>Interactive</span>
            <ArrowRight aria-hidden className="h-5 w-5 text-brand" />
          </span>
        </Link>
      ))}
    </div>
  );
}

function ArchiveCards({ puzzles }: { puzzles: WendPuzzle[] }) {
  return (
    <div className="archive-grid">
      {puzzles.map((puzzle) => (
        <article className="archive-card" key={puzzle.date}>
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-black text-brand">Wend #{puzzle.puzzleNumber}</h3>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
              {puzzle.difficulty}
            </span>
          </div>
          <p className="mt-1 text-sm font-semibold text-ink">{puzzle.dateLabel}</p>
          <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-500">
            {archiveGridSize(puzzle)} grid · {puzzle.answers.length} answers
          </p>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{puzzle.quickHint}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link className="chip" href={`/${wendArchiveSlug(puzzle.puzzleNumber, puzzle.dateLabel)}`}>
              View answer
            </Link>
            <Link className="chip" href="/linkedin-wend-solver">
              View solver
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}

function FilterableArchiveList({ puzzles }: { puzzles: WendPuzzle[] }) {
  const [filters, setFilters] = useState<ArchiveFilters>(defaultArchiveFilters);
  const filteredPuzzles = useMemo(() => filterArchivePuzzles(puzzles, filters), [filters, puzzles]);
  const months = useMemo(
    () => [...new Set(puzzles.map(archiveMonthKey))].sort().reverse(),
    [puzzles],
  );
  const difficulties = useMemo(
    () => [...new Set(puzzles.map((puzzle) => puzzle.difficulty))].sort(),
    [puzzles],
  );
  const gridSizes = useMemo(
    () => [...new Set(puzzles.map(archiveGridSize))].sort((left, right) => Number(left.split("×")[0]) - Number(right.split("×")[0])),
    [puzzles],
  );

  function updateFilter<Key extends keyof ArchiveFilters>(key: Key, value: ArchiveFilters[Key]) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  return (
    <div>
      <div className="content-card mb-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="text-sm font-black text-ink md:col-span-2 xl:col-span-1">
            Search by puzzle, date, or answer
            <input
              className="mt-2 min-h-11 w-full rounded-lg border border-line bg-white px-3 py-2 text-base font-semibold text-ink outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-brand/20"
              onChange={(event) => updateFilter("query", event.target.value)}
              placeholder="Try #16, June 24, or HEXAGON"
              type="search"
              value={filters.query}
            />
          </label>
          <label className="text-sm font-black text-ink">
            Month
            <select
              className="mt-2 min-h-11 w-full rounded-lg border border-line bg-white px-3 py-2 text-base font-semibold text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              onChange={(event) => updateFilter("month", event.target.value)}
              value={filters.month}
            >
              <option value="all">All months</option>
              {months.map((month) => (
                <option key={month} value={month}>{archiveMonthLabel(month)}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-black text-ink">
            Difficulty
            <select
              className="mt-2 min-h-11 w-full rounded-lg border border-line bg-white px-3 py-2 text-base font-semibold text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              onChange={(event) => updateFilter("difficulty", event.target.value)}
              value={filters.difficulty}
            >
              <option value="all">All difficulties</option>
              {difficulties.map((difficulty) => <option key={difficulty}>{difficulty}</option>)}
            </select>
          </label>
          <label className="text-sm font-black text-ink">
            Grid size
            <select
              className="mt-2 min-h-11 w-full rounded-lg border border-line bg-white px-3 py-2 text-base font-semibold text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              onChange={(event) => updateFilter("gridSize", event.target.value)}
              value={filters.gridSize}
            >
              <option value="all">All grid sizes</option>
              {gridSizes.map((gridSize) => <option key={gridSize}>{gridSize}</option>)}
            </select>
          </label>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p aria-live="polite" className="text-sm font-bold text-slate-600">
            Showing {filteredPuzzles.length} of {puzzles.length} verified puzzles
          </p>
          <button className="btn btn-ghost" onClick={() => setFilters(defaultArchiveFilters)} type="button">
            Reset filters
          </button>
        </div>
      </div>

      {filteredPuzzles.length > 0 ? (
        <ArchiveCards puzzles={filteredPuzzles} />
      ) : (
        <div className="content-card text-center">
          <h3 className="text-xl font-black text-ink">No Wend answers match these filters</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">Try another date, puzzle number, answer word, or reset all filters.</p>
        </div>
      )}
    </div>
  );
}

export function ArchiveList({ puzzles, variant = "full" }: { puzzles: WendPuzzle[]; variant?: ArchiveListVariant }) {
  return variant === "preview" ? <ArchivePreview puzzles={puzzles} /> : <FilterableArchiveList puzzles={puzzles} />;
}
