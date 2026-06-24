import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { RelatedGames } from "@/components/RelatedGames";
import { WendSolver } from "@/components/WendSolver";
import { getWendNeighbors, todayWend } from "@/lib/puzzles";
import { breadcrumbJson, pageMetadata } from "@/lib/seo";
import { wendSlug } from "@/lib/dates";

export const metadata: Metadata = pageMetadata({
  title: "LinkedIn Wend Solver for Today's Puzzle",
  description:
    "Use a spoiler-safe LinkedIn Wend solver with a custom 5x5 grid, reveal one letter, reveal one word, reveal all paths, and clear the board.",
  path: "/linkedin-wend-solver",
  imageTitle: "LinkedIn Wend Solver",
  imageSubtitle: `${todayWend.dateLabel} - Puzzle #${todayWend.puzzleNumber}`,
});

export default function WendSolverPage() {
  const neighbors = getWendNeighbors(todayWend.puzzleNumber);

  return (
    <main className="page-shell">
      <JsonLd data={breadcrumbJson([{ name: "Home", path: "/" }, { name: "Wend Solver", path: "/linkedin-wend-solver" }])} />
      <section>
        <h1 className="break-words text-3xl font-black leading-tight tracking-normal text-ink sm:text-4xl md:text-5xl">LinkedIn Wend Solver</h1>
        <p className="section-copy">
          Reveal today’s Wend grid one letter, one word, or one full path at a time. The board is custom-rendered
          and final answers stay hidden until you choose to reveal them.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-sm font-semibold text-slate-700">
          <span className="rounded-lg bg-white px-3 py-2">Puzzle #{todayWend.puzzleNumber}</span>
          <span className="rounded-lg bg-white px-3 py-2">{todayWend.dateLabel}</span>
          <span className="rounded-lg bg-white px-3 py-2">{todayWend.difficulty}</span>
        </div>
      </section>

      <section className="section">
        <WendSolver puzzle={todayWend} />
      </section>

      <section className="section flex flex-wrap gap-2">
        {neighbors.previous ? (
          <Link className="chip" href={`/linkedin-wend-answer-${wendSlug(neighbors.previous.puzzleNumber, neighbors.previous.dateLabel)}`}>
            Previous puzzle
          </Link>
        ) : null}
        <Link className="chip" href="/linkedin-wend-archive">
          Archive
        </Link>
        <Link className="chip" href="/linkedin-wend-answer-today">
          Today’s answer
        </Link>
      </section>

      <RelatedGames />
    </main>
  );
}
