"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="page-shell">
      <h1 className="break-words text-3xl font-black leading-tight tracking-normal text-ink sm:text-4xl md:text-5xl">
        Something went wrong
      </h1>
      <p className="section-copy">
        The page failed to render. Try again, or go back to the main Wend pages.
      </p>
      <section className="section flex flex-wrap gap-2">
        <button className="btn btn-primary" onClick={() => reset()} type="button">
          Try again
        </button>
        <Link className="chip" href="/linkedin-wend-answer-today">
          Wend Today
        </Link>
        <Link className="chip" href="/contact">
          Contact
        </Link>
      </section>
    </main>
  );
}
