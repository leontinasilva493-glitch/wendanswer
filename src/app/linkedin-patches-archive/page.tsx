import Link from "next/link";
import type { Metadata } from "next";
import { noindexFollow, pageMetadata } from "@/lib/seo";
import { todayPatches } from "@/lib/puzzles";

export const metadata: Metadata = pageMetadata({
  title: "LinkedIn Patches Answer Archive",
  description: "Browse archived LinkedIn Patches answers, hints, and explanation pages as they are added.",
  path: "/linkedin-patches-archive",
  robots: noindexFollow,
});

export default function PatchesArchivePage() {
  return (
    <main className="page-shell">
      <h1 className="text-4xl font-black tracking-normal text-ink md:text-5xl">LinkedIn Patches Answer Archive</h1>
      <p className="section-copy">Patches archive pages will expand as daily puzzle data is added.</p>
      <section className="section rounded-lg border border-line bg-white p-4">
        <p className="font-bold text-ink">#{todayPatches.puzzleNumber} · {todayPatches.dateLabel}</p>
        <p className="mt-1 text-sm text-slate-600">{todayPatches.difficulty}</p>
        <Link className="chip mt-4" href="/linkedin-patches-answer-today">
          View today’s answer
        </Link>
      </section>
    </main>
  );
}
