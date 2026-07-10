import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CircleHelp, ExternalLink, Lightbulb, ListChecks, Route, Zap } from "lucide-react";
import { ArchiveList } from "@/components/ArchiveList";
import { FaqDetails } from "@/components/FaqDetails";
import { HintAccordion } from "@/components/HintAccordion";
import { JsonLd } from "@/components/JsonLd";
import { NextWendCountdown } from "@/components/NextWendCountdown";
import { WendAnswerReveal } from "@/components/WendAnswerReveal";
import { WendFreshnessNotice } from "@/components/WendFreshnessNotice";
import { todayWend, wendPuzzles } from "@/lib/puzzles";
import { faqJson, pageMetadata } from "@/lib/seo";
import { expectedWendDisplay, isWendReadyForToday, nextWendDisplay } from "@/lib/wend-status";

export const revalidate = 60;

function latestVerifiedWend() {
  return wendPuzzles.find((puzzle) => puzzle.isVerified) ?? todayWend;
}

function displayedWend() {
  return isWendReadyForToday(todayWend) ? todayWend : latestVerifiedWend();
}

export function generateMetadata(): Metadata {
  const wendReady = isWendReadyForToday(todayWend);
  const expectedWend = expectedWendDisplay(todayWend);
  const heroWend = wendReady ? displayedWend() : expectedWend;

  return pageMetadata({
    title: wendReady
      ? `LinkedIn Wend Answer Today - ${heroWend.dateLabel} | Wend #${heroWend.puzzleNumber} Answer`
      : `LinkedIn Wend Answer Today Status - ${heroWend.dateLabel} | Wend #${heroWend.puzzleNumber}`,
    description: wendReady
      ? `LinkedIn Wend answer today for ${heroWend.dateLabel} puzzle no ${heroWend.puzzleNumber}. Get spoiler-safe hints, word paths, solver help, and complete Wend archive pages.`
      : `The LinkedIn Wend answer for ${heroWend.dateLabel}, puzzle no ${heroWend.puzzleNumber}, is being verified. The latest verified answer remains available without being mislabeled as today.`,
    path: "/",
    keywords: [
      "linkedin wend",
      "linkedin wend answer",
      "wend linkedin",
      "wend linkedin answer",
      "wend answer today",
      `wend answer ${heroWend.dateLabel}`,
      `wend #${heroWend.puzzleNumber} answer`,
      "wend answers",
      "wend full answer",
      "wend answer for date",
      "wend answer for LinkedIn Games",
    ],
    absoluteTitle: true,
    imageTitle: wendReady
      ? `LinkedIn Wend #${heroWend.puzzleNumber} Answer`
      : `LinkedIn Wend #${heroWend.puzzleNumber} Status`,
    imageSubtitle: wendReady
      ? `LinkedIn Wend answer today for ${heroWend.dateLabel}.`
      : `Verification pending for ${heroWend.dateLabel}.`,
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
];

export default function HomePage() {
  const archivePuzzles = wendPuzzles;
  const recentArchivePuzzles = archivePuzzles.slice(0, 4);
  const wendReady = isWendReadyForToday(todayWend);
  const lastVerifiedWend = latestVerifiedWend();
  const displayWend = wendReady ? todayWend : lastVerifiedWend;
  const expectedWend = expectedWendDisplay(todayWend);
  const heroWend = wendReady ? displayWend : expectedWend;
  const nextWend = nextWendDisplay(displayWend);

  return (
    <main className="page-shell">
      <JsonLd data={faqJson(faq)} />

      <section className="mx-auto max-w-4xl py-12 text-center md:py-16">
        <p className="mx-auto mb-4 inline-flex max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full border border-brand/20 bg-white px-4 py-2 text-sm font-black text-brand shadow-sm">
          <span>Wend #{heroWend.puzzleNumber} {wendReady ? "answer" : "status"}</span>
          <span aria-hidden className="text-slate-300">
            |
          </span>
          <span>{heroWend.dateLabel}</span>
          <span aria-hidden className="text-slate-300">
            |
          </span>
          <span>updated daily at midnight Pacific Time</span>
        </p>
        <h1 className="break-words text-4xl font-black leading-tight tracking-normal text-ink sm:text-5xl md:text-6xl">
          {wendReady
            ? `LinkedIn Wend answer today for ${heroWend.dateLabel} puzzle no ${heroWend.puzzleNumber}`
            : `LinkedIn Wend answer status for ${heroWend.dateLabel} puzzle no ${heroWend.puzzleNumber}`}
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-700 md:text-xl">
          Save your streak without spoiling the whole puzzle.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a className="btn btn-primary min-w-[12rem] gap-2" href="#answer">
            {wendReady ? "Get Today's Answer" : "View Latest Verified Answer"}
            <ArrowRight aria-hidden className="h-5 w-5" />
          </a>
          <a
            className="btn btn-ghost min-w-[12rem] gap-2 border-brand text-brand"
            href="https://www.linkedin.com/games/wend"
            rel="nofollow noopener"
            target="_blank"
          >
            <ExternalLink aria-hidden className="h-5 w-5" />
            Official Wend Game
          </a>
        </div>
        {!wendReady ? (
          <WendFreshnessNotice
            expectedDateLabel={expectedWend.dateLabel}
            expectedPuzzleNumber={expectedWend.puzzleNumber}
            fallbackDateLabel={displayWend.dateLabel}
            fallbackPuzzleNumber={displayWend.puzzleNumber}
          />
        ) : null}
        <NextWendCountdown
          dateLabel={nextWend.dateLabel}
          placeholder={!wendReady}
          puzzleNumber={nextWend.puzzleNumber}
          releaseAtIso={nextWend.releaseAtIso}
        />
      </section>

      <section className="section" id="answer">
        <WendAnswerReveal archived={!wendReady} puzzle={displayWend} />
      </section>

      <section className="section grid gap-6 lg:grid-cols-3" id="hints">
        <div className="content-card">
          <h2 className="section-heading">
            <span className="section-icon">
              <Lightbulb aria-hidden className="h-5 w-5" />
            </span>
            <span>LinkedIn Wend spoiler-safe hints</span>
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
            <span>LinkedIn Wend step-by-step explanation</span>
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
            <span>LinkedIn Wend FAQ</span>
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

      <section className="section">
        <p className="inline-flex rounded-sm bg-slate-200 px-3 py-2 text-sm font-black uppercase tracking-normal text-slate-700">
          Recent puzzles
        </p>
        <h2 className="mt-5 break-words text-3xl font-black leading-tight tracking-normal text-ink md:text-4xl">
          Recent LinkedIn Wend Answers
        </h2>
        <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-700">
          Browse recent LinkedIn Wend answers with puzzle numbers, dates, and interactive answer pages.
        </p>
        <div className="mt-5">
          <ArchiveList puzzles={recentArchivePuzzles} variant="preview" />
        </div>
        <div className="mt-8 flex justify-center">
          <Link className="btn btn-primary gap-2 rounded-full px-8" href="/linkedin-wend-archive">
            View Full Archive
            <ArrowRight aria-hidden className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
