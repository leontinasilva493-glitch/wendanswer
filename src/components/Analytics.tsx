import Script from "next/script";
import { site } from "@/lib/site";

export function Analytics() {
  if (process.env.NEXT_PUBLIC_PLAUSIBLE_DISABLED === "true") return null;

  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || new URL(site.url).hostname;
  const scriptSrc = process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_SRC || "https://plausible.io/js/script.tagged-events.js";

  return (
    <>
      <Script
        data-domain={domain}
        defer
        id="plausible-script"
        src={scriptSrc}
        strategy="afterInteractive"
      />
      <Script id="plausible-init" strategy="beforeInteractive">
        {`window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)}`}
      </Script>
    </>
  );
}
