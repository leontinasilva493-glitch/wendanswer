import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { WendUnlimitedTool } from "@/components/WendUnlimitedTool";
import { wendPuzzles } from "@/lib/puzzles";
import { breadcrumbJson, faqJson, howToJson, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Wend Unlimited - Play Wend Game Online",
  description:
    "Play Wend Unlimited online with no login. Practice LinkedIn Wend-style puzzles with hints, undo, local progress, sharing, and previous or next puzzle controls.",
  path: "/wend-unlimited",
  keywords: ["wend unlimited", "play wend unlimited", "wend game online", "linkedin wend game no login", "wend practice puzzle"],
  imageTitle: "Wend Unlimited",
  imageSubtitle: "Play Wend practice puzzles online with no login.",
});

type WendUnlimitedPageProps = {
  searchParams?: Promise<{
    puzzle?: string | string[];
  }>;
};

function firstParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function practiceHref(puzzleNumber: number) {
  return `/wend-unlimited?puzzle=${puzzleNumber}`;
}

const practicePuzzles = [...wendPuzzles].reverse();

const howToSteps = [
  {
    name: "Start a practice board",
    text: "Open Wend Unlimited and use the current board or New puzzle to switch to another verified Wend-style practice puzzle.",
  },
  {
    name: "Reveal only the help you need",
    text: "Use Hint for one path letter, tap a cell, or reveal a word when you are stuck.",
  },
  {
    name: "Track and share progress",
    text: "Your local progress stays on this device, Undo reverses the last reveal, and Share result copies your current score.",
  },
];

const faqItems = [
  {
    question: "Can I play Wend Unlimited without a LinkedIn login?",
    answer:
      "Yes. This unofficial practice tool runs in the browser and uses verified Wend-style boards, so you can practice without logging in to LinkedIn.",
  },
  {
    question: "Is Wend Unlimited the official LinkedIn Wend game?",
    answer:
      "No. Official Wend is played on LinkedIn Games. Wend Unlimited is an independent practice page for hints, undo, saved local progress, and replaying older boards.",
  },
  {
    question: "Where can I find today's real Wend answer?",
    answer:
      "Use the Today Answer page for the current LinkedIn Wend answer, hints, and word path after the daily puzzle is verified.",
  },
];

export default async function WendUnlimitedPage({ searchParams }: WendUnlimitedPageProps) {
  const params = await searchParams;
  const requestedPuzzle = Number.parseInt(firstParam(params?.puzzle) ?? "1", 10);
  const safePuzzleNumber = Number.isFinite(requestedPuzzle) ? requestedPuzzle : 1;
  const currentPuzzleNumber = Math.min(Math.max(safePuzzleNumber, 1), practicePuzzles.length);
  const currentIndex = currentPuzzleNumber - 1;
  const currentPuzzle = practicePuzzles[currentIndex];
  const letterCount = currentPuzzle.grid.flat().filter(Boolean).length;
  const previousHref = currentPuzzleNumber > 1 ? practiceHref(currentPuzzleNumber - 1) : null;
  const nextHref = currentPuzzleNumber < practicePuzzles.length ? practiceHref(currentPuzzleNumber + 1) : null;

  return (
    <main className="page-shell">
      <JsonLd data={breadcrumbJson([{ name: "Home", path: "/" }, { name: "Wend Practice", path: "/wend-unlimited" }])} />
      <JsonLd data={howToJson({ name: "How to play Wend Unlimited", description: metadata.description ?? "", path: "/wend-unlimited", steps: howToSteps })} />
      <JsonLd data={faqJson(faqItems)} />
      <section className="content-card">
        <p className="text-sm font-black uppercase tracking-normal text-brand">Wend game online / no login practice</p>
        <h1 className="mt-2 text-4xl font-black tracking-normal text-ink md:text-5xl">Wend Unlimited</h1>
        <p className="section-copy">
          Play Wend Unlimited as an unofficial LinkedIn Wend game no login practice tool. Start with the board below,
          switch to a new puzzle, use hints or undo, and save local progress while you practice.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <a className="btn btn-primary" href="#play">
            Play Wend Unlimited
          </a>
          <Link className="btn btn-ghost border-brand text-brand" href="/linkedin-wend-answer-today">
            Today Answer
          </Link>
          <a className="btn btn-ghost" href="https://www.linkedin.com/games/wend" rel="nofollow noopener" target="_blank">
            Official Wend
          </a>
        </div>
      </section>

      <WendUnlimitedTool
        currentPracticeNumber={currentPuzzleNumber}
        letterCount={letterCount}
        nextHref={nextHref}
        previousHref={previousHref}
        puzzle={{ ...currentPuzzle, dateLabel: `Practice Puzzle ${currentPuzzleNumber}` }}
        totalPuzzles={practicePuzzles.length}
      />

      <section className="section grid gap-4 lg:grid-cols-3">
        <div className="content-card">
          <h2 className="section-title">How to play Wend Unlimited</h2>
          <ol className="mt-4 space-y-3 text-sm font-semibold leading-6 text-slate-700">
            {howToSteps.map((step) => (
              <li key={step.name}>
                <span className="font-black text-ink">{step.name}:</span> {step.text}
              </li>
            ))}
          </ol>
        </div>
        <div className="content-card">
          <h2 className="section-title">Official Wend vs Wend Unlimited</h2>
          <p className="section-copy">
            Official Wend is the daily LinkedIn Games puzzle. Wend Unlimited is an unofficial practice puzzle tool for
            replaying verified boards, testing paths, using Hint and Undo, and sharing practice progress.
          </p>
          <a className="btn btn-ghost mt-4 border-brand text-brand" href="https://www.linkedin.com/games/wend" rel="nofollow noopener" target="_blank">
            Open Official Wend
          </a>
        </div>
        <div className="content-card">
          <h2 className="section-title">Wend Unlimited FAQ</h2>
          <div className="mt-4 space-y-3">
            {faqItems.map((item) => (
              <details className="inner-card p-3" key={item.question}>
                <summary className="cursor-pointer text-sm font-black text-ink">{item.question}</summary>
                <p className="mt-2 text-sm leading-6 text-slate-700">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
