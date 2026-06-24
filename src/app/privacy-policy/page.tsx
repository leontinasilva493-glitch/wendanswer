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
          If analytics are added, they should be used to understand aggregate page usage such as visits, button
          clicks, and device type. Do not submit personal information through this site.
        </p>
        <p>
          Third-party links, including links to LinkedIn Games, are governed by the privacy policies of those
          services.
        </p>
      </div>
    </main>
  );
}
