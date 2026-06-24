import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "How to Play LinkedIn Wend",
  description:
    "Learn the basic idea of LinkedIn Wend, how word paths work, and how to use spoiler-safe hints without revealing the full answer.",
  path: "/how-to-play-linkedin-wend",
});

export default function HowToPlayWendPage() {
  return (
    <main className="page-shell">
      <h1 className="text-4xl font-black tracking-normal text-ink md:text-5xl">How to Play LinkedIn Wend</h1>
      <p className="section-copy">
        Wend is a word-path puzzle where you use a letter grid to find hidden words and connect the right cells.
        The goal is to solve the path with as little outside help as possible.
      </p>
      <section className="section grid gap-4 md:grid-cols-3">
        {[
          ["Scan the board", "Start with corners, edges, and letters that have fewer possible neighbors."],
          ["Build short paths", "Try obvious word fragments before committing to a longer route."],
          ["Reveal slowly", "Use a hint first, then one letter or one word only if you are still stuck."],
        ].map(([title, copy]) => (
          <article className="rounded-lg border border-line bg-white p-4" key={title}>
            <h2 className="text-xl font-black text-ink">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">{copy}</p>
          </article>
        ))}
      </section>
      <section className="section flex flex-wrap gap-2">
        <Link className="chip" href="/linkedin-wend-answer-today">
          Today’s hints
        </Link>
        <Link className="chip" href="/how-to-solve-linkedin-wend">
          Solving tips
        </Link>
      </section>
    </main>
  );
}
