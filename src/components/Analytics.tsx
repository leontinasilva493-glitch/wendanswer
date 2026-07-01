import Script from "next/script";
import { site } from "@/lib/site";

export function Analytics() {
  const gtmDisabled = process.env.NEXT_PUBLIC_GTM_DISABLED === "true";
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID || "GTM-5C5M7XPH";
  const clarityDisabled = process.env.NEXT_PUBLIC_CLARITY_DISABLED === "true";
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID || "xff0m0uvmc";
  const plausibleDisabled = process.env.NEXT_PUBLIC_PLAUSIBLE_DISABLED === "true";
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || new URL(site.url).hostname;
  const scriptSrc = process.env.NEXT_PUBLIC_PLAUSIBLE_SCRIPT_SRC || "https://plausible.io/js/script.tagged-events.js";

  return (
    <>
      {!gtmDisabled ? (
        <>
          <Script id="google-tag-manager" strategy="beforeInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`}
          </Script>
          <noscript>
            <iframe
              height="0"
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
              width="0"
            />
          </noscript>
        </>
      ) : null}
      {!clarityDisabled ? (
        <Script id="microsoft-clarity" strategy="beforeInteractive">
          {`(function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${clarityId}");`}
        </Script>
      ) : null}
      {!plausibleDisabled ? (
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
      ) : null}
    </>
  );
}
