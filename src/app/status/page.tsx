import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Site Status",
  description: "Current public status summary for WendAnswerToday.org.",
  path: "/status",
});

export default function StatusPage() {
  return (
    <main className="page-shell">
      <h1 className="break-words text-3xl font-black leading-tight tracking-normal text-ink sm:text-4xl md:text-5xl">
        Site Status
      </h1>
      <p className="section-copy">
        Public status notes for the MVP launch. This lightweight page gives visitors somewhere obvious to check
        if puzzle data or solver behavior looks stale.
      </p>
      <section className="section grid gap-4 md:grid-cols-3">
        {[
          ["Website", "Operational"],
          ["Wend daily data", "Manual daily update"],
          ["Solver", "Operational"],
        ].map(([label, value]) => (
          <article className="rounded-lg border border-line bg-white p-4" key={label}>
            <h2 className="text-sm font-bold uppercase tracking-[0.08em] text-slate-500">{label}</h2>
            <p className="mt-2 text-2xl font-black text-success">{value}</p>
          </article>
        ))}
      </section>
      <section className="section rounded-lg border border-line bg-white p-5">
        <h2 className="text-2xl font-black text-ink">Launch window policy</h2>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          For the first 14 days, the priority is accurate Wend updates, no broken core pages, and quick fixes for
          reportable answer or reveal problems.
        </p>
      </section>
    </main>
  );
}
