import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { HintAccordion } from "@/components/HintAccordion";
import { JsonLd } from "@/components/JsonLd";
import { RelatedGames } from "@/components/RelatedGames";
import { WendAnswerReveal } from "@/components/WendAnswerReveal";
import { findWendByArchiveSlug, findWendBySlug, getWendNeighbors, wendPuzzles } from "@/lib/puzzles";
import { articleJson, breadcrumbJson, pageMetadata } from "@/lib/seo";
import { wendArchiveSlug } from "@/lib/dates";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return wendPuzzles.map((puzzle) => ({
    slug: wendArchiveSlug(puzzle.puzzleNumber, puzzle.dateLabel),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const puzzle =
    slug.startsWith("wend-answer-puzzle-")
      ? findWendByArchiveSlug(slug)
      : slug.startsWith("linkedin-wend-answer-")
        ? findWendBySlug(slug.replace(/^linkedin-wend-answer-/, ""))
        : null;
  if (!puzzle) return {};

  const canonicalSlug = wendArchiveSlug(puzzle.puzzleNumber, puzzle.dateLabel);
  return pageMetadata({
    title: `LinkedIn Wend Answer #${puzzle.puzzleNumber} - ${puzzle.dateLabel}`,
    description: `Archived LinkedIn Wend answer for ${puzzle.dateLabel}, including spoiler-safe hints, word path, solver, and explanation.`,
    path: `/${canonicalSlug}`,
    type: "article",
    imageTitle: `LinkedIn Wend Answer #${puzzle.puzzleNumber}`,
    imageSubtitle: puzzle.dateLabel,
    publishedTime: puzzle.date,
    modifiedTime: puzzle.updatedAt,
  });
}

export default async function WendArchiveDetailPage({ params }: PageProps) {
  const { slug } = await params;
  if (!slug.startsWith("wend-answer-puzzle-") && !slug.startsWith("linkedin-wend-answer-")) notFound();

  if (slug.startsWith("linkedin-wend-answer-")) {
    const puzzleSlug = slug.replace(/^linkedin-wend-answer-/, "");
    const legacyPuzzle = findWendBySlug(puzzleSlug);
    if (!legacyPuzzle) notFound();
    permanentRedirect(`/${wendArchiveSlug(legacyPuzzle.puzzleNumber, legacyPuzzle.dateLabel)}`);
  }

  const puzzle = findWendByArchiveSlug(slug);
  if (!puzzle) notFound();

  const neighbors = getWendNeighbors(puzzle.puzzleNumber);
  const path = `/${wendArchiveSlug(puzzle.puzzleNumber, puzzle.dateLabel)}`;

  return (
    <main className="page-shell">
      <JsonLd data={breadcrumbJson([{ name: "Home", path: "/" }, { name: "Wend Archive", path: "/linkedin-wend-archive" }, { name: `Wend #${puzzle.puzzleNumber}`, path }])} />
      <JsonLd
        data={articleJson({
          headline: `LinkedIn Wend Answer #${puzzle.puzzleNumber}`,
          description: `Archived LinkedIn Wend answer for ${puzzle.dateLabel}.`,
          path,
          datePublished: puzzle.date,
          dateModified: puzzle.updatedAt,
        })}
      />
      <section>
        <h1 className="break-words text-3xl font-black leading-tight tracking-normal text-ink sm:text-4xl md:text-5xl">
          LinkedIn Wend Answer #{puzzle.puzzleNumber}
        </h1>
        <p className="section-copy">
          This is the archived LinkedIn Wend answer for {puzzle.dateLabel}. For today’s puzzle, visit{" "}
          <Link className="font-bold text-brand" href="/linkedin-wend-answer-today">
            LinkedIn Wend Answer Today
          </Link>
          .
        </p>
      </section>

      <section className="section" id="answer">
        <WendAnswerReveal puzzle={puzzle} archived />
      </section>

      <section className="section">
        <h2 className="section-title">Spoiler-safe hints</h2>
        <div className="mt-5">
          <HintAccordion hints={puzzle.hints} />
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Explanation</h2>
        <p className="section-copy">{puzzle.explanation}</p>
      </section>

      <section className="section grid gap-3 md:grid-cols-3">
        <article className="rounded-lg border border-line bg-white p-4">
          <h2 className="text-xl font-black text-ink">Fast solving tip</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">{puzzle.fastTip}</p>
        </article>
        <article className="rounded-lg border border-line bg-white p-4">
          <h2 className="text-xl font-black text-ink">Common mistake</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">{puzzle.commonMistake}</p>
        </article>
        <article className="rounded-lg border border-line bg-white p-4">
          <h2 className="text-xl font-black text-ink">Difficulty note</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">{puzzle.difficultyNote}</p>
        </article>
      </section>

      <section className="section flex flex-wrap gap-2">
        {neighbors.previous ? (
          <Link className="chip" href={`/${wendArchiveSlug(neighbors.previous.puzzleNumber, neighbors.previous.dateLabel)}`}>
            Previous puzzle
          </Link>
        ) : null}
        {neighbors.next ? (
          <Link className="chip" href={`/${wendArchiveSlug(neighbors.next.puzzleNumber, neighbors.next.dateLabel)}`}>
            Next puzzle
          </Link>
        ) : null}
        <Link className="chip" href="/linkedin-wend-archive">
          Archive
        </Link>
        <Link className="chip" href="/linkedin-wend-solver">
          Wend Solver
        </Link>
      </section>

      <RelatedGames />
    </main>
  );
}
