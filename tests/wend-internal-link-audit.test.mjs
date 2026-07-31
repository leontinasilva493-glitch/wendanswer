import assert from "node:assert/strict";
import { auditWendInternalLinks } from "../scripts/audit-wend-internal-links.mjs";

const origin = "https://example.test";
const answerPaths = Array.from(
  { length: 5 },
  (_, index) => `/wend-answer-puzzle-${index + 1}-july-${index + 1}-2026`,
);
const sitemapPaths = [
  "/",
  "/linkedin-wend-archive",
  "/linkedin-wend-solver",
  "/linkedin-wend-statistics",
  "/how-to-play-linkedin-wend",
  ...answerPaths,
];

function anchor(href, text) {
  return `<a href="${href}">${text}</a>`;
}

function breadcrumb() {
  return '<nav aria-label="Breadcrumb"><a href="/">Home</a></nav>';
}

function answerPage(index) {
  const otherAnswers = answerPaths.filter((_, candidate) => candidate !== index);
  const previous = index > 0 ? anchor(answerPaths[index - 1], `Previous: Wend #${index} – July ${index}, 2026`) : "";
  const next = index < answerPaths.length - 1
    ? anchor(answerPaths[index + 1], `Next: Wend #${index + 2} – July ${index + 2}, 2026`)
    : "";
  return [
    breadcrumb(),
    anchor("/", "LinkedIn Wend Answer Today"),
    anchor("/linkedin-wend-archive", "Browse all LinkedIn Wend answers"),
    anchor("/linkedin-wend-solver", "Open the LinkedIn Wend Solver"),
    previous,
    next,
    `<section id="related-wend-answers">${otherAnswers.map((path, relatedIndex) => anchor(path, `Wend #${relatedIndex + 10} answer – July 2026`)).join("")}</section>`,
  ].join("");
}

const htmlByPath = new Map([
  ["/", anchor("/linkedin-wend-archive", "Archive") + anchor("/linkedin-wend-solver", "Solver")],
  [
    "/linkedin-wend-archive",
    breadcrumb()
      + anchor("/", "Today")
      + anchor("/linkedin-wend-solver", "Solver")
      + anchor("/linkedin-wend-statistics", "Statistics")
      + anchor("#july-2026", "July 2026")
      + `<section id="july-2026">${answerPaths.map((path, index) => anchor(path, `LinkedIn Wend #<!-- -->${index + 1} Answer – July ${index + 1}, 2026`)).join("")}</section>`,
  ],
  [
    "/linkedin-wend-solver",
    breadcrumb()
      + anchor("/", "Today")
      + anchor("/how-to-play-linkedin-wend", "How to Play")
      + anchor("/linkedin-wend-archive", "Archive")
      + anchor(answerPaths[4], "Wend #5 answer"),
  ],
  [
    "/linkedin-wend-statistics",
    breadcrumb()
      + anchor("/linkedin-wend-archive", "Archive")
      + anchor("/linkedin-wend-solver", "Solver")
      + anchor(answerPaths[0], "Wend #1 answer"),
  ],
  [
    "/how-to-play-linkedin-wend",
    breadcrumb()
      + anchor("/", "Today")
      + anchor("/linkedin-wend-solver", "Solver")
      + anchor("/linkedin-wend-archive", "Archive"),
  ],
  ...answerPaths.map((path, index) => [path, answerPage(index)]),
]);

const sitemap = `<?xml version="1.0"?><urlset>${sitemapPaths.map((path) => `<url><loc>${origin}${path}</loc></url>`).join("")}</urlset>`;

function fixtureFetch(overrides = new Map()) {
  return async (input) => {
    const url = new URL(input);
    const path = url.pathname;
    const body = path === "/sitemap.xml" ? sitemap : overrides.get(path) ?? htmlByPath.get(path);
    return {
      ok: body !== undefined,
      status: body === undefined ? 404 : 200,
      text: async () => body ?? "",
    };
  };
}

const healthy = await auditWendInternalLinks({ baseUrl: origin, fetchImpl: fixtureFetch() });
assert.deepEqual(healthy.failures, []);
assert.deepEqual(healthy.summary, {
  answerPages: 5,
  auditedPages: 10,
  maxAnswerDepth: 2,
});

const genericArchive = htmlByPath.get("/linkedin-wend-archive").replace(
  "LinkedIn Wend #<!-- -->1 Answer – July 1, 2026",
  "View answer",
);
const genericResult = await auditWendInternalLinks({
  baseUrl: origin,
  fetchImpl: fixtureFetch(new Map([["/linkedin-wend-archive", genericArchive]])),
});
assert.ok(genericResult.failures.some((failure) => /generic archive anchor/i.test(failure)));

const missingRelated = answerPage(0).replace('id="related-wend-answers"', 'id="other-links"');
const relatedResult = await auditWendInternalLinks({
  baseUrl: origin,
  fetchImpl: fixtureFetch(new Map([[answerPaths[0], missingRelated]])),
});
assert.ok(relatedResult.failures.some((failure) => /related Wend answers/i.test(failure)));

const lateMonthNavigation = htmlByPath.get("/linkedin-wend-archive").replace(
  anchor("#july-2026", "July 2026"),
  "",
) + anchor("#july-2026", "July 2026");
const monthNavigationResult = await auditWendInternalLinks({
  baseUrl: origin,
  fetchImpl: fixtureFetch(new Map([["/linkedin-wend-archive", lateMonthNavigation]])),
});
assert.ok(monthNavigationResult.failures.some((failure) => /month navigation.*before/i.test(failure)));

const brokenLinkResult = await auditWendInternalLinks({
  baseUrl: origin,
  fetchImpl: fixtureFetch(new Map([
    [answerPaths[0], answerPage(0) + anchor("/missing-internal-page", "Broken internal link")],
  ])),
});
assert.ok(
  brokenLinkResult.failures.some((failure) => /missing-internal-page.*404/i.test(failure)),
  "the audit should request every discovered internal link and report dead destinations",
);

console.log("wend internal-link audit behavior test passed");
