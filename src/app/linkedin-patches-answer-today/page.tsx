import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { RevealPanel } from "@/components/RevealPanel";
import { todayPatches } from "@/lib/puzzles";
import { articleJson, breadcrumbJson, noindexFollow, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: `LinkedIn Patches Answer Today - ${todayPatches.dateLabel}`,
  description:
    "Get today’s LinkedIn Patches hints, reveal answer, explanation, archive link, and related LinkedIn Games pages.",
  path: "/linkedin-patches-answer-today",
  type: "article",
  imageTitle: "LinkedIn Patches Answer Today",
  imageSubtitle: "Temporarily noindex until daily data is verified.",
  publishedTime: todayPatches.date,
  modifiedTime: todayPatches.updatedAt,
  robots: noindexFollow,
});

export default function PatchesTodayPage() {
  return (
    <main className="page-shell">
      <JsonLd data={breadcrumbJson([{ name: "Home", path: "/" }, { name: "Patches Today", path: "/linkedin-patches-answer-today" }])} />
      <JsonLd
        data={articleJson({
          headline: "LinkedIn Patches Answer Today",
          description: "Today’s LinkedIn Patches hints and answer.",
          path: "/linkedin-patches-answer-today",
          datePublished: todayPatches.date,
          dateModified: todayPatches.updatedAt,
        })}
      />
      <section>
        <h1 className="text-4xl font-black tracking-normal text-ink md:text-5xl">LinkedIn Patches Answer Today</h1>
        <p className="section-copy">
          {todayPatches.dateLabel} · Puzzle #{todayPatches.puzzleNumber} · {todayPatches.difficulty}
        </p>
      </section>
      <section className="section grid gap-3">
        {todayPatches.hints.map((hint, index) => (
          <RevealPanel label={`Hint ${index + 1}`} tone="amber" key={hint}>
            {hint}
          </RevealPanel>
        ))}
        <RevealPanel label="Reveal answer" tone="green">
          {todayPatches.answer}
        </RevealPanel>
      </section>
      <section className="section">
        <h2 className="section-title">Step-by-step explanation</h2>
        <p className="section-copy">{todayPatches.explanation}</p>
      </section>
      <section className="section flex flex-wrap gap-2">
        <Link className="chip" href="/linkedin-patches-archive">
          Patches Archive
        </Link>
        <Link className="chip" href="/">
          Wend
        </Link>
        <Link className="chip" href="/linkedin-zip-answer-today">
          Zip
        </Link>
      </section>
    </main>
  );
}
