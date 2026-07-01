import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: "Privacy policy for WendAnswerToday.org.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <main className="page-shell">
      <h1 className="text-4xl font-black tracking-normal text-ink md:text-5xl">Privacy Policy</h1>
      <div className="section-copy space-y-4">
        <p>
          WendAnswerToday.org is designed as a lightweight static puzzle helper. We do not require accounts,
          passwords, or payment information.
        </p>
        <p>
          We use lightweight, privacy-friendly analytics to understand aggregate page usage, including page
          visits and spoiler reveal button clicks. Analytics events are used to improve the daily answer,
          archive, and solver experience.
        </p>
        <p>
          We also use Google Tag Manager to load Google Analytics. Google Analytics may use analytics cookies
          or similar identifiers to measure visits, traffic sources, device/browser information, and basic site
          interactions. These analytics tools help us understand whether users find the current Wend answer,
          archive pages, and reveal controls useful.
        </p>
        <p>
          The site does not require accounts and does not ask you to submit personal information. Do not submit
          personal information through this site.
        </p>
        <p>
          Third-party links, including links to LinkedIn Games, are governed by the privacy policies of those
          services.
        </p>
      </div>
    </main>
  );
}
