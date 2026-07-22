import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-shell">
      <h1 className="break-words text-3xl font-black leading-tight tracking-normal text-ink sm:text-4xl md:text-5xl">
        Page not found
      </h1>
      <p className="section-copy">
        This puzzle page is not available yet. Try today&apos;s Wend answer, the solver, or the archive.
      </p>
      <section className="section flex flex-wrap gap-2">
        <Link className="chip" href="/">
          Wend Today
        </Link>
        <Link className="chip" href="/linkedin-wend-solver">
          Solver
        </Link>
        <Link className="chip" href="/linkedin-wend-archive">
          Archive
        </Link>
        <Link className="chip" href="/">
          Home
        </Link>
      </section>
    </main>
  );
}
