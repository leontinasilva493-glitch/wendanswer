import type { NextConfig } from "next";

const plausibleOrigin = "https://plausible.io";
const googleTagManagerOrigin = "https://www.googletagmanager.com";
const googleAnalyticsOrigin = "https://www.google-analytics.com";
const googleAnalyticsWildcardOrigin = "https://*.google-analytics.com";
const googleAnalyticsUiOrigin = "https://analytics.google.com";
const clarityOrigin = "https://www.clarity.ms";
const clarityCollectOrigin = "https://*.clarity.ms";
const projectRoot = process.cwd();
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  `script-src 'self' 'unsafe-inline' ${process.env.NODE_ENV === "development" ? "'unsafe-eval' " : ""}${plausibleOrigin} ${googleTagManagerOrigin} ${clarityOrigin}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: ${googleTagManagerOrigin} ${googleAnalyticsOrigin} ${googleAnalyticsWildcardOrigin} ${clarityOrigin} ${clarityCollectOrigin}`,
  "font-src 'self' data:",
  `connect-src 'self' ${plausibleOrigin} ${googleAnalyticsOrigin} ${googleAnalyticsWildcardOrigin} ${googleAnalyticsUiOrigin} ${clarityOrigin} ${clarityCollectOrigin}`,
  `frame-src ${googleTagManagerOrigin}`,
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  outputFileTracingRoot: projectRoot,
  turbopack: {
    root: projectRoot,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicy,
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
