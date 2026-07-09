import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { faqJson, pageMetadata } from "@/lib/seo";

const faqs = [
  {
    question: "What is WendAnswerToday.org?",
    answer:
      "WendAnswerToday.org is an unofficial Wend help site with spoiler-safe hints, answer reveals, word paths, solvers, archives, and practice puzzles.",
  },
  {
    question: "Are answers hidden by default?",
    answer:
      "Yes. Daily answers and paths are hidden until you choose a hint, one letter, one word, or the full path.",
  },
  {
    question: "Is this site affiliated with LinkedIn?",
    answer:
      "No. This is an unofficial fan-made site and is not affiliated with, endorsed by, or sponsored by LinkedIn.",
  },
  {
    question: "Is this a Wend LinkedIn answer site?",
    answer:
      "Yes. It focuses on Wend answers, hints, word paths, solver help, and archive pages for people playing Wend on LinkedIn.",
  },
  {
    question: "How often is Wend updated?",
    answer:
      "The launch goal is to update Wend daily for 14 days after the puzzle reset, then review real Search Console and usage data.",
  },
  {
    question: "Where is LinkedIn Wend?",
    answer:
      "If Wend is not visible in your LinkedIn games menu, try the direct official link at linkedin.com/games/wend or switch between mobile and desktop.",
  },
  {
    question: "Why can’t I see Wend?",
    answer:
      "LinkedIn can roll out games unevenly by account, app version, region, or device. Update the app, try desktop, or open the direct Wend link.",
  },
  {
    question: "What if LinkedIn Games not loading affects my streak?",
    answer:
      "Try the direct game link, refresh the app or browser, and use the smallest spoiler-safe hint first if you only need enough help to keep your streak alive.",
  },
  {
    question: "What should I do if an answer looks wrong?",
    answer:
      "Use the contact page to report the puzzle date, puzzle number, and what looks incorrect so it can be checked quickly.",
  },
];

export const metadata: Metadata = pageMetadata({
  title: "LinkedIn Wend FAQ",
  description:
    "Frequently asked questions about WendAnswerToday.org, spoiler-safe Wend hints, answer reveals, solvers, and unofficial status.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <main className="page-shell">
      <JsonLd data={faqJson(faqs)} />
      <h1 className="break-words text-3xl font-black leading-tight tracking-normal text-ink sm:text-4xl md:text-5xl">
        LinkedIn Wend FAQ
      </h1>
      <p className="section-copy">
        Quick answers for people who want help with Wend without losing control of spoilers.
      </p>
      <section className="section space-y-3">
        {faqs.map((item) => (
          <article className="rounded-lg border border-line bg-white p-4" key={item.question}>
            <h2 className="text-xl font-black text-ink">{item.question}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">{item.answer}</p>
          </article>
        ))}
      </section>
      <section className="section flex flex-wrap gap-2">
        <Link className="chip" href="/linkedin-wend-answer-today">
          Wend Today
        </Link>
        <Link className="chip" href="/contact">
          Report an issue
        </Link>
        <Link className="chip" href="/where-is-linkedin-wend">
          Find Wend
        </Link>
      </section>
    </main>
  );
}
