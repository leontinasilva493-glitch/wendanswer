import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { RevealPanel } from "@/components/RevealPanel";
import { ZipSolver } from "@/components/ZipSolver";
import { todayZip } from "@/lib/puzzles";
import { articleJson, breadcrumbJson, noindexFollow, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: `LinkedIn Zip Answer Today - ${todayZip.dateLabel}`,
  description: "Reveal today’s LinkedIn Zip hints, next step, full path, and explanation with a mobile-friendly solver.",
  path: "/linkedin-zip-answer-today",
  type: "article",
  imageTitle: "LinkedIn Zip Answer Today",
  imageSubtitle: "Temporarily noindex until daily data is verified.",
  publishedTime: todayZip.date,
  modifiedTime: todayZip.updatedAt,
  robots: noindexFollow,
});

export default function ZipTodayPage() {
  return (
    <main className="page-shell">
      <JsonLd data={breadcrumbJson([{ name: "Home", path: "/" }, { name: "Zip Today", path: "/linkedin-zip-answer-today" }])} />
      <JsonLd
        data={articleJson({
          headline: "LinkedIn Zip Answer Today",
          description: "Today’s LinkedIn Zip hints and path.",
          path: "/linkedin-zip-answer-today",
          datePublished: todayZip.date,
          dateModified: todayZip.updatedAt,
        })}
      />
      <section>
        <h1 className="text-4xl font-black tracking-normal text-ink md:text-5xl">LinkedIn Zip Answer Today</h1>
        <p className="section-copy">
          {todayZip.dateLabel} · Puzzle #{todayZip.puzzleNumber} · {todayZip.difficulty}
        </p>
      </section>
      <section className="section">
        <ZipSolver puzzle={todayZip} />
      </section>
      <section className="section grid gap-3">
        {todayZip.hints.map((hint, index) => (
          <RevealPanel label={`Hint ${index + 1}`} tone="amber" key={hint}>
            {hint}
          </RevealPanel>
        ))}
        <RevealPanel label="Reveal full path" tone="green">
          {todayZip.answer}
        </RevealPanel>
      </section>
      <section className="section">
        <h2 className="section-title">Explanation</h2>
        <p className="section-copy">{todayZip.explanation}</p>
      </section>
      <section className="section flex flex-wrap gap-2">
        <Link className="chip" href="/linkedin-zip-solver">
          Zip Solver
        </Link>
        <Link className="chip" href="/linkedin-wend-answer-today">
          Wend
        </Link>
        <Link className="chip" href="/linkedin-patches-answer-today">
          Patches
        </Link>
      </section>
    </main>
  );
}
