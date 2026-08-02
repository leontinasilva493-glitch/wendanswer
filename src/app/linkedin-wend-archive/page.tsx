import type { Metadata } from "next";
import Link from "next/link";
import { ArchiveList } from "@/components/ArchiveList";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { RelatedGames } from "@/components/RelatedGames";
import { wendPuzzles } from "@/lib/puzzles";
import { breadcrumbJson, pageMetadata } from "@/lib/seo";
import { archiveCoverage, groupArchivePuzzlesByMonth } from "@/lib/wend-archive";

export const metadata: Metadata = pageMetadata({
  title: "LinkedIn Wend Answer Archive",
  description:
    "Browse the complete verified LinkedIn Wend answer archive by puzzle number, date, month, difficulty, and grid size, with spoiler-safe detail pages.",
  path: "/linkedin-wend-archive",
  imageTitle: "LinkedIn Wend Archive",
  imageSubtitle: "Past Wend answers by puzzle number and date.",
});

export default function WendArchivePage() {
  const oldestWend = wendPuzzles.at(-1) ?? wendPuzzles[0];
  const latestWend = wendPuzzles[0];
  const coverage = archiveCoverage(wendPuzzles);
  const monthGroups = groupArchivePuzzlesByMonth(wendPuzzles);

  return (
    <main className="page-shell">
      <JsonLd data={breadcrumbJson([{ name: "Home", path: "/" }, { name: "Wend Archive", path: "/linkedin-wend-archive" }])} />
      <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "LinkedIn Wend Archive" }]} />
      <section>
        <h1 className="break-words text-3xl font-black leading-tight tracking-normal text-ink sm:text-4xl md:text-5xl">LinkedIn Wend Answer Archive</h1>
        <p className="section-copy">
          Every verified Wend answer is organized by puzzle number and date. Open a detail page for the answer, path,
          explanation, previous puzzle, next puzzle, and solver links.
        </p>
        {oldestWend && latestWend ? (
          <div className="mt-4 rounded-lg border border-line bg-white p-4 text-sm leading-6 text-slate-700">
            <p className="font-black text-ink">
              Verified archive coverage: {coverage.verifiedCount} puzzles, Wend #{oldestWend.puzzleNumber} through Wend #{latestWend.puzzleNumber}
            </p>
            <p>
              Coverage runs from {oldestWend.dateLabel} to {latestWend.dateLabel}.{" "}
              {coverage.missingPuzzleNumbers.length === 0
                ? "No puzzle numbers are missing from the verified archive."
                : `Missing puzzle numbers: ${coverage.missingPuzzleNumbers.join(", ")}.`}
            </p>
          </div>
        ) : null}
        <div className="mt-5 flex flex-wrap gap-3">
          <Link className="btn btn-primary" href="/">Open today’s Wend answer</Link>
          <Link className="btn btn-ghost" href="/linkedin-wend-solver">Use the Wend solver</Link>
          <Link className="btn btn-ghost" href="/linkedin-wend-statistics">Explore Wend statistics</Link>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Browse LinkedIn Wend by month</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {monthGroups.map((group) => (
            <Link className="chip" href={`#${group.anchor}`} key={group.key}>
              {group.label} · {group.puzzles.length}
            </Link>
          ))}
        </div>
        <Link className="mt-5 inline-flex font-black text-brand hover:underline" href="/linkedin-wend-statistics">
          Explore LinkedIn Wend statistics across the verified archive
        </Link>
      </section>

      <section className="section">
        <h2 className="section-title">All LinkedIn Wend Answers</h2>
        <div className="mt-5">
          <ArchiveList puzzles={wendPuzzles} />
        </div>
      </section>

      <RelatedGames />
    </main>
  );
}
