import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms",
  description: "Terms of use for WendAnswerToday.org.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <main className="page-shell">
      <h1 className="text-4xl font-black tracking-normal text-ink md:text-5xl">Terms</h1>
      <div className="section-copy space-y-4">
        <p>
          WendAnswerToday.org is provided for casual puzzle help and practice. Use the hints and answers at your
          own discretion.
        </p>
        <p>
          Do not present this site as official, sponsored, endorsed, or authorized by LinkedIn. All trademarks
          belong to their respective owners.
        </p>
        <p>
          We may update puzzle data, pages, and terms as the site develops.
        </p>
      </div>
    </main>
  );
}
