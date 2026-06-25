import Link from "next/link";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "How to Solve LinkedIn Wend",
  description:
    "Practical Wend solving tips: start with constrained cells, test short paths, avoid premature answers, and use spoiler-safe reveals.",
  path: "/how-to-solve-linkedin-wend",
});

export default function HowToSolveWendPage() {
  return (
    <main className="page-shell">
      <h1 className="text-4xl font-black tracking-normal text-ink md:text-5xl">How to Solve LinkedIn Wend</h1>
      <p className="section-copy">
        The fastest Wend solves usually come from constraint checking, not guessing. Use the board shape to
        reduce options before revealing any answer.
      </p>
      <section className="section space-y-4">
        {[
          ["Start with constrained cells", "Corners and edge cells have fewer possible exits, so they often reveal the first reliable path."],
          ["Check crossings carefully", "If a path blocks too many strong letters, test a different direction before locking it in."],
          ["Use reveals as checkpoints", "A single revealed letter can confirm whether your whole solving direction is right."],
        ].map(([title, copy]) => (
          <article className="rounded-lg border border-line bg-white p-4" key={title}>
            <h2 className="text-xl font-black text-ink">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">{copy}</p>
          </article>
        ))}
      </section>
      <section className="section flex flex-wrap gap-2">
        <Link className="chip" href="/linkedin-wend-solver">
          Open Wend Solver
        </Link>
        <Link className="chip" href="/linkedin-wend-archive">
          View Archive
        </Link>
      </section>
    </main>
  );
}
