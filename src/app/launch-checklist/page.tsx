import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Launch Checklist | WendAnswerToday.org",
  robots: {
    index: false,
    follow: false,
  },
};

const items = [
  ["Core pages", "Home, Wend Today, Solver, Archive, history detail, FAQ, Contact, legal pages return 200."],
  ["SEO crawlability", "No noindex on public pages, robots allows crawling, sitemap includes public pages."],
  ["Daily data", "Today JSON is accurate, verified, and archive/history pages update after each new file."],
  ["Mobile UX", "First screen shows date, puzzle number, hint, reveal controls, and solver access."],
  ["Trust", "Unofficial disclaimer is visible, contact email is available, no LinkedIn logo or official claim."],
  ["Monitoring", "After deploy, connect Search Console and an uptime monitor before the 14-day update run."],
  ["Rollback", "Keep previous deploy available in Vercel or Cloudflare Pages and avoid risky feature changes mid-run."],
];

export default function LaunchChecklistPage() {
  return (
    <main className="page-shell">
      <h1 className="break-words text-3xl font-black leading-tight tracking-normal text-ink sm:text-4xl md:text-5xl">
        MVP Launch Checklist
      </h1>
      <p className="section-copy">
        Internal checklist adapted for a static puzzle game help site. Payment, login, tenant isolation, and AI
        safety checks are not applicable to this MVP.
      </p>
      <section className="section space-y-3">
        {items.map(([title, copy]) => (
          <article className="rounded-lg border border-line bg-white p-4" key={title}>
            <h2 className="text-xl font-black text-ink">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">{copy}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
