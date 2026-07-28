import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, CalendarDays, Grid3X3, Route, SpellCheck2 } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { RelatedGames } from "@/components/RelatedGames";
import { wendArchiveSlug } from "@/lib/dates";
import { wendPuzzles } from "@/lib/puzzles";
import { breadcrumbJson, pageMetadata } from "@/lib/seo";
import { aggregateWendStatistics } from "@/lib/wend-statistics";

const statistics = aggregateWendStatistics(wendPuzzles);

export const metadata: Metadata = pageMetadata({
  absoluteTitle: true,
  title: "LinkedIn Wend Statistics: Puzzle Sizes, Words & Difficulty",
  description: `Explore verified LinkedIn Wend statistics across ${statistics.verifiedPuzzleCount} puzzles, including grid sizes, answer lengths, path turns, difficulty labels, and monthly coverage.`,
  path: "/linkedin-wend-statistics",
  imageTitle: "LinkedIn Wend Statistics",
  imageSubtitle: "Verified puzzle sizes, answer words, paths, and archive coverage.",
});

function Distribution({ items, total }: { items: Array<{ count: number; label: string }>; total: number }) {
  return (
    <div className="mt-5 space-y-4">
      {items.map((item) => {
        const percentage = total === 0 ? 0 : Math.round((item.count / total) * 100);
        return (
          <div key={item.label}>
            <div className="flex items-center justify-between gap-3 text-sm font-black text-ink">
              <span>{item.label}</span>
              <span>{item.count} puzzles · {percentage}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100" aria-hidden>
              <div className="h-full rounded-full bg-brand" style={{ width: `${percentage}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function WendStatisticsPage() {
  const longestAnswerHref = `/${wendArchiveSlug(
    statistics.longestAnswer.puzzleNumber,
    statistics.longestAnswer.dateLabel,
  )}`;
  const windingPuzzleHref = `/${wendArchiveSlug(
    statistics.mostWindingPuzzle.puzzleNumber,
    statistics.mostWindingPuzzle.dateLabel,
  )}`;

  return (
    <main className="page-shell">
      <JsonLd
        data={breadcrumbJson([
          { name: "Home", path: "/" },
          { name: "Wend Statistics", path: "/linkedin-wend-statistics" },
        ])}
      />

      <section className="max-w-4xl">
        <p className="eyebrow">Verified archive analysis</p>
        <h1 className="mt-3 break-words text-3xl font-black leading-tight tracking-normal text-ink sm:text-4xl md:text-5xl">
          LinkedIn Wend Statistics: Puzzle Sizes, Words & Difficulty
        </h1>
        <p className="section-copy">
          These LinkedIn Wend statistics summarize every verified puzzle currently stored in our public archive. The
          figures update when a new answer passes the same grid, path, and source checks used by the daily answer page.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="btn btn-primary" href="/linkedin-wend-archive">Browse all verified answers</Link>
          <Link className="btn btn-ghost" href="/linkedin-wend-solver">Open the Wend solver</Link>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Verified Wend archive at a glance</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [statistics.verifiedPuzzleCount, "verified puzzles", `Wend #${statistics.firstPuzzleNumber}–#${statistics.latestPuzzleNumber}`],
            [statistics.totalAnswers, "answer words", `${statistics.averageAnswersPerPuzzle} per puzzle`],
            [statistics.averageOpenCells, "average open cells", `${statistics.averageBlockedCells} blocked cells`],
            [statistics.averageTurnsPerPuzzle, "average path turns", "per verified puzzle"],
          ].map(([value, label, note]) => (
            <article className="content-card" key={label}>
              <p className="text-3xl font-black text-brand">{value}</p>
              <h3 className="mt-2 text-base font-black text-ink">{label}</h3>
              <p className="mt-1 text-sm font-semibold text-slate-500">{note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section grid gap-5 lg:grid-cols-2">
        <article className="content-card">
          <h2 className="section-heading">
            <span className="section-icon"><Grid3X3 aria-hidden className="h-5 w-5" /></span>
            <span>LinkedIn Wend grid sizes</span>
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Each count comes from the actual stored board dimensions, including blocked cells.
          </p>
          <Distribution items={statistics.gridSizes} total={statistics.verifiedPuzzleCount} />
        </article>

        <article className="content-card">
          <h2 className="section-heading">
            <span className="section-icon"><CalendarDays aria-hidden className="h-5 w-5" /></span>
            <span>Verified puzzles by month</span>
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Monthly coverage shows how many permanent, verified answer pages are available for each month.
          </p>
          <Distribution items={statistics.monthlyCoverage} total={statistics.verifiedPuzzleCount} />
        </article>
      </section>

      <section className="section grid gap-5 lg:grid-cols-2">
        <article className="content-card">
          <h2 className="section-heading">
            <span className="section-icon"><SpellCheck2 aria-hidden className="h-5 w-5" /></span>
            <span>Answer word statistics</span>
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            The archive contains <strong className="text-ink">{statistics.totalAnswers} verified answer words</strong>,
            averaging {statistics.averageAnswersPerPuzzle} words per puzzle. The longest stored answer is{" "}
            <strong className="text-ink">{statistics.longestAnswer.word}</strong> at {statistics.longestAnswer.length}
            letters.
          </p>
          <Link className="mt-4 inline-flex font-black text-brand hover:underline" href={longestAnswerHref}>
            View Wend #{statistics.longestAnswer.puzzleNumber} from {statistics.longestAnswer.dateLabel}
          </Link>
        </article>

        <article className="content-card">
          <h2 className="section-heading">
            <span className="section-icon"><Route aria-hidden className="h-5 w-5" /></span>
            <span>Path shape statistics</span>
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            A turn is counted whenever a verified answer path changes orthogonal direction. Puzzles average{" "}
            <strong className="text-ink">{statistics.averageTurnsPerPuzzle} turns</strong>. The most winding stored
            puzzle is Wend #{statistics.mostWindingPuzzle.puzzleNumber} with {statistics.mostWindingPuzzle.turns} total
            turns across its answer paths.
          </p>
          <Link className="mt-4 inline-flex font-black text-brand hover:underline" href={windingPuzzleHref}>
            Inspect the Wend #{statistics.mostWindingPuzzle.puzzleNumber} paths
          </Link>
        </article>
      </section>

      <section className="section content-card">
        <h2 className="section-heading">
          <span className="section-icon"><BarChart3 aria-hidden className="h-5 w-5" /></span>
          <span>Difficulty labels in the archive</span>
        </h2>
        <Distribution items={statistics.difficulties} total={statistics.verifiedPuzzleCount} />
        <p className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <strong>Difficulty is an editorial label.</strong> It is shown separately from calculated facts such as grid
          size, word length, and path turns, and should not be read as an official LinkedIn rating.
        </p>
      </section>

      <section className="section content-card">
        <h2 className="section-title">How these Wend statistics are calculated</h2>
        <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-7 text-slate-600">
          <li>Only records marked verified are included; drafts and incomplete captures stay out of public totals.</li>
          <li>Grid cells, answer words, and ordered paths come from the same JSON records used by each archive page.</li>
          <li>Averages use one contribution per verified puzzle and are rounded to one decimal place.</li>
          <li>New verified puzzles automatically update this page, the archive totals, and the monthly distribution.</li>
        </ul>
      </section>

      <RelatedGames />
    </main>
  );
}
