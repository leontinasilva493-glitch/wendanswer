import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CircleHelp, Lightbulb, ListChecks, Route, Zap } from "lucide-react";
import { ArchiveList } from "@/components/ArchiveList";
import { FaqDetails } from "@/components/FaqDetails";
import { HintAccordion } from "@/components/HintAccordion";
import { JsonLd } from "@/components/JsonLd";
import { NextWendCountdown } from "@/components/NextWendCountdown";
import { WendAnswerReveal } from "@/components/WendAnswerReveal";
import { formatUpdated } from "@/lib/dates";
import { todayWend, wendPuzzles } from "@/lib/puzzles";
import { faqJson, pageMetadata } from "@/lib/seo";
import { isWendReadyForToday, nextWendDisplay } from "@/lib/wend-status";

export const revalidate = 60;

function latestVerifiedWend() {
  return wendPuzzles.find((puzzle) => puzzle.isVerified) ?? todayWend;
}

function displayedWend() {
  return isWendReadyForToday(todayWend) ? todayWend : latestVerifiedWend();
}

export function generateMetadata(): Metadata {
  const heroWend = displayedWend();

  return pageMetadata({
    title: `Wend Answer Today - ${heroWend.dateLabel} | Wend #${heroWend.puzzleNumber} Answer`,
    description: `Wend answer today for ${heroWend.dateLabel} puzzle no ${heroWend.puzzleNumber}. Get spoiler-safe hints, word paths, solver help, and complete Wend archive pages.`,
    path: "/",
    keywords: [
      "wend answer today",
      `wend answer ${heroWend.dateLabel}`,
      `wend #${heroWend.puzzleNumber} answer`,
      "wend answers",
      "wend full answer",
      "wend answer for date",
      "wend answer for LinkedIn Games",
    ],
    absoluteTitle: true,
    imageTitle: `Wend #${heroWend.puzzleNumber} Answer`,
    imageSubtitle: `Wend answer today for ${heroWend.dateLabel}.`,
  });
}

const faq = [
  {
    question: "What is the LinkedIn Wend puzzle?",
    answer:
      "Wend is a daily LinkedIn word path puzzle. The goal is to trace hidden words through the grid while using every required letter path correctly.",
  },
  {
    question: "How do hole cells work?",
    answer: "Hole cells are blocked spaces. A valid Wend word path must move around them instead of passing through them.",
  },
  {
    question: "Are the answers shown by default?",
    answer: "No. The page starts spoiler-safe. You can reveal a hint, one letter, one word, or the full answer.",
  },
  {
    question: "Why is today's solution valid?",
    answer:
      "Each revealed word follows the rendered grid path and avoids blocked cells, so you can check the answer without guessing.",
  },
  {
    question: "What time does LinkedIn Wend update?",
    answer:
      "LinkedIn Wend is treated as a daily puzzle with a target release time of 8:00 UTC. This site updates after the newest verified board is available.",
  },
  {
    question: "Can I see previous Wend answers?",
    answer:
      "Yes. Use the Wend archive to browse previous LinkedIn Wend answers by date and puzzle number.",
  },
  {
    question: "Is WendAnswerToday.org an official LinkedIn site?",
    answer:
      "No. WendAnswerToday.org is an unofficial fan-made help site and is not affiliated with, endorsed by, or sponsored by LinkedIn.",
  },
  {
    question: "Why show the word path instead of only the answer words?",
    answer:
      "Wend is solved by tracing each answer through the grid. The word path shows how each answer moves around blocked cells, which a plain word list cannot explain.",
  },
];

export default function HomePage() {
  const archivePuzzles = wendPuzzles;
  const oldestWend = archivePuzzles.at(-1) ?? todayWend;
  const latestWend = archivePuzzles[0] ?? todayWend;
  const wendReady = isWendReadyForToday(todayWend);
  const lastVerifiedWend = latestVerifiedWend();
  const displayWend = wendReady ? todayWend : lastVerifiedWend;
  const heroWend = displayWend;
  const nextWend = nextWendDisplay(displayWend);
  const letterCount = displayWend.grid.flat().filter(Boolean).length;
  const statusLabel = displayWend.isVerified ? "Verified answer" : "Checking answer";

  return (
    <main className="page-shell">
      <JsonLd data={faqJson(faq)} />

      <section className="mx-auto max-w-4xl py-12 text-center md:py-16">
        <p className="mx-auto mb-4 inline-flex max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full border border-brand/20 bg-white px-4 py-2 text-sm font-black text-brand shadow-sm">
          <span>Wend #{heroWend.puzzleNumber} answer</span>
          <span aria-hidden className="text-slate-300">
            |
          </span>
          <span>{heroWend.dateLabel}</span>
          <span aria-hidden className="text-slate-300">
            |
          </span>
          <span>updated daily at 8:00 UTC</span>
        </p>
        <h1 className="break-words text-4xl font-black leading-tight tracking-normal text-ink sm:text-5xl md:text-6xl">
          Wend answer today for {heroWend.dateLabel} puzzle no {heroWend.puzzleNumber}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-700 md:text-xl">
          Save your streak without spoiling the whole puzzle. Get today's verified LinkedIn Wend answer with
          spoiler-safe hints, word paths, and reveal controls. Start with a clue, reveal one word, or open the
          full solution only when you need it.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a className="btn btn-primary min-w-[12rem] gap-2" href="#answer">
            Get Today's Answer
            <ArrowRight aria-hidden className="h-5 w-5" />
          </a>
          <a className="btn btn-ghost min-w-[12rem] gap-2 border-brand text-brand" href="#hints">
            <Lightbulb aria-hidden className="h-5 w-5" />
            Start with a Hint
          </a>
        </div>
        {wendReady ? (
          <NextWendCountdown
            dateLabel={nextWend.dateLabel}
            puzzleNumber={nextWend.puzzleNumber}
            releaseAtIso={nextWend.releaseAtIso}
          />
        ) : null}
      </section>

      <section className="section content-card">
        <h2 className="section-heading">
          <span className="section-icon">
            <ListChecks aria-hidden className="h-5 w-5" />
          </span>
          <span>Today's Wend at a glance</span>
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-700">
          Confirm the date, puzzle number, difficulty, and answer status before you reveal any part of the
          solution. The board below is checked against the stored Wend grid and word paths before it appears as
          the current answer.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-line bg-slate-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.08em] text-slate-500">Puzzle</p>
            <p className="mt-1 text-xl font-black text-ink">Wend #{displayWend.puzzleNumber}</p>
          </div>
          <div className="rounded-lg border border-line bg-slate-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.08em] text-slate-500">Date</p>
            <p className="mt-1 text-xl font-black text-ink">{displayWend.dateLabel}</p>
          </div>
          <div className="rounded-lg border border-line bg-slate-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.08em] text-slate-500">Difficulty</p>
            <p className="mt-1 text-xl font-black text-ink">{displayWend.difficulty}</p>
          </div>
          <div className="rounded-lg border border-line bg-slate-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.08em] text-slate-500">Words</p>
            <p className="mt-1 text-xl font-black text-ink">{displayWend.answers.length} answer words</p>
          </div>
          <div className="rounded-lg border border-line bg-slate-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.08em] text-slate-500">Letters</p>
            <p className="mt-1 text-xl font-black text-ink">{letterCount} playable cells</p>
          </div>
          <div className="rounded-lg border border-line bg-slate-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.08em] text-slate-500">Status</p>
            <p className="mt-1 text-xl font-black text-ink">{statusLabel}</p>
            <p className="mt-1 text-sm font-semibold text-slate-600">Updated {formatUpdated(displayWend.updatedAt)}</p>
          </div>
        </div>
      </section>

      <section className="section content-card">
        <h2 className="section-heading">
          <span className="section-icon">
            <Route aria-hidden className="h-5 w-5" />
          </span>
          <span>Today's LinkedIn Wend answer and word path</span>
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-700">
          Use this section when you need help with today's LinkedIn Wend puzzle but do not want to spoil the
          entire board. The answer panel lets you reveal one letter, one word, or the full path. Each word path
          is shown on the grid so you can see how the solution moves around blocked cells instead of only copying
          a word list.
        </p>
      </section>

      <section className="section" id="answer">
        <WendAnswerReveal archived={!wendReady} puzzle={displayWend} />
      </section>

      <section className="section content-card">
        <h2 className="section-heading">
          <span className="section-icon">
            <Lightbulb aria-hidden className="h-5 w-5" />
          </span>
          <span>How to use this page without spoilers</span>
        </h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-lg border border-line bg-slate-50 p-4">
            <h3 className="text-lg font-black text-ink">Start with a hint</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Read the spoiler-safe hint first if you only need a nudge. It points you toward the solving
              direction without exposing the full word list.
            </p>
          </article>
          <article className="rounded-lg border border-line bg-slate-50 p-4">
            <h3 className="text-lg font-black text-ink">Reveal one letter</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Use Reveal Letter when you know part of the answer but are unsure where the path turns on the grid.
            </p>
          </article>
          <article className="rounded-lg border border-line bg-slate-50 p-4">
            <h3 className="text-lg font-black text-ink">Reveal one word</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Use Reveal Word when one answer is blocking your progress and you want to keep the rest of the
              puzzle hidden.
            </p>
          </article>
          <article className="rounded-lg border border-line bg-slate-50 p-4">
            <h3 className="text-lg font-black text-ink">Reveal the full path</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Use Reveal all after you finish solving or when you want to check every word path against the board.
            </p>
          </article>
        </div>
      </section>

      <section className="section grid gap-6 lg:grid-cols-3" id="hints">
        <div className="content-card">
          <h2 className="section-heading">
            <span className="section-icon">
              <Lightbulb aria-hidden className="h-5 w-5" />
            </span>
            <span>Spoiler-safe hints</span>
          </h2>
          <div className="mt-5">
            <HintAccordion hints={displayWend.hints} />
          </div>
        </div>

        <div className="content-card">
          <h2 className="section-heading">
            <span className="section-icon">
              <Route aria-hidden className="h-5 w-5" />
            </span>
            <span>Step-by-step explanation</span>
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-700">{displayWend.explanation}</p>
          <Link className="btn btn-ghost mt-5 gap-2 border-brand text-brand" href="/linkedin-wend-answer-today">
            View Full Walkthrough
            <ArrowRight aria-hidden className="h-5 w-5" />
          </Link>
        </div>

        <div className="content-card">
          <h2 className="section-heading">
            <span className="section-icon">
              <CircleHelp aria-hidden className="h-5 w-5" />
            </span>
            <span>Wend FAQ</span>
          </h2>
          <div className="mt-5 space-y-3">
            {faq.map((item) => (
              <FaqDetails answer={item.answer} key={item.question} question={item.question} />
            ))}
          </div>
          <Link className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand" href="/faq">
            View all FAQs
            <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="section grid gap-6 lg:grid-cols-3">
        <article className="content-card lg:col-span-2">
          <h2 className="section-heading">
            <span className="section-icon">
              <CircleHelp aria-hidden className="h-5 w-5" />
            </span>
            <span>What is LinkedIn Wend?</span>
          </h2>
          <div className="mt-4 space-y-4 text-base leading-7 text-slate-700">
            <p>
              LinkedIn Wend is a daily word-path puzzle from LinkedIn Games. Instead of finding words in straight
              lines like a traditional word search, Wend asks you to trace hidden words through adjacent letter
              cells. Paths can turn, bend, and move around blocked spaces, so the final solution depends on both
              the answer words and the exact route each word takes through the grid.
            </p>
            <p>
              That is why this page shows more than a simple word list. For each verified Wend answer, the grid
              highlights the path so you can compare the route with your own solve. If you want to protect your
              streak, start with the hints and reveal only the smallest amount of help you need.
            </p>
          </div>
        </article>

        <article className="content-card">
          <h2 className="text-xl font-black text-ink">Useful Wend resources</h2>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            Use the daily answer for fast help, the solver for step-by-step reveal controls, and the archive for
            older LinkedIn Wend puzzle dates.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link className="chip" href="/linkedin-wend-solver">
              Open Solver
            </Link>
            <Link className="chip" href="/linkedin-wend-archive">
              Browse Archive
            </Link>
            <Link className="chip" href="/how-to-play-linkedin-wend">
              How to Play
            </Link>
          </div>
        </article>
      </section>

      <section className="section grid gap-6 lg:grid-cols-2">
        <article className="content-card">
          <h2 className="section-heading">
            <span className="section-icon">
              <ListChecks aria-hidden className="h-5 w-5" />
            </span>
            <span>How today's Wend answer is verified</span>
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-700">
            A Wend answer is only useful if the path works on the board. Before a puzzle is published here, each
            answer word is checked against the grid coordinates, blocked cells, and adjacent-cell movement. A
            valid path must spell the answer word in order, move through neighboring cells, and avoid every
            blocked space.
          </p>
          <ul className="mt-4 space-y-2 text-sm font-semibold leading-6 text-slate-700">
            <li>The word must match the letters shown on the grid.</li>
            <li>The path must move through adjacent cells.</li>
            <li>The route must avoid blocked cells.</li>
          </ul>
        </article>

        <article className="content-card">
          <h2 className="section-heading">
            <span className="section-icon">
              <Zap aria-hidden className="h-5 w-5" />
            </span>
            <span>When does LinkedIn Wend update?</span>
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-700">
            LinkedIn Wend is treated as a daily puzzle with a target release time of 8:00 UTC.
            WendAnswerToday checks for the newest verified puzzle and updates the answer page after the daily
            board is available. If the newest puzzle is still being verified, the page falls back to the latest
            verified Wend answer instead of labeling an older solution as today's answer.
          </p>
          <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
            Use the countdown near the top of the page to see when the next Wend puzzle is expected.
          </p>
        </article>
      </section>

      <section className="section grid gap-3 md:grid-cols-3">
        <article className="content-card">
          <h2 className="flex items-center gap-2 text-lg font-black text-ink">
            <Zap aria-hidden className="h-5 w-5 text-hint" />
            Fast solving tip
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">{displayWend.fastTip}</p>
        </article>
        <article className="content-card">
          <h2 className="flex items-center gap-2 text-lg font-black text-ink">
            <ListChecks aria-hidden className="h-5 w-5 text-brand" />
            Common mistake
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">{displayWend.commonMistake}</p>
        </article>
        <article className="content-card">
          <h2 className="flex items-center gap-2 text-lg font-black text-ink">
            <CircleHelp aria-hidden className="h-5 w-5 text-success" />
            Difficulty note
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">{displayWend.difficultyNote}</p>
        </article>
      </section>

      <section className="section content-card">
        <h2 className="section-heading">
          <span className="section-icon">
            <ListChecks aria-hidden className="h-5 w-5" />
          </span>
          <span>All Wend Answers</span>
        </h2>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-700">
          Use the Wend archive when you missed a previous puzzle or want to compare recent solving patterns.
          Each archived answer page includes the puzzle date, puzzle number, spoiler-safe hints, the solved word
          path, and links to nearby puzzles.
        </p>
        <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
          Verified archive coverage from Wend #{oldestWend.puzzleNumber} on {oldestWend.dateLabel} through Wend #
          {latestWend.puzzleNumber} on {latestWend.dateLabel}.
        </p>
        <div className="mt-5">
          <ArchiveList puzzles={archivePuzzles} />
        </div>
      </section>
    </main>
  );
}
