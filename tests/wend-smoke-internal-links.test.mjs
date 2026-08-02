import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import http from "node:http";

const answers = [
  "/wend-answer-puzzle-51-july-29-2026",
  "/wend-answer-puzzle-50-july-28-2026",
  "/wend-answer-puzzle-49-july-27-2026",
  "/wend-answer-puzzle-48-july-26-2026",
  "/wend-answer-puzzle-47-july-25-2026",
];
const corePaths = [
  "/",
  "/linkedin-wend-archive",
  "/linkedin-wend-solver",
  "/linkedin-wend-statistics",
  "/how-to-play-linkedin-wend",
];
const smokeOnlyPaths = [
  "/where-is-linkedin-wend",
  "/how-to-solve-linkedin-wend",
  "/faq",
  "/contact",
  "/disclaimer",
  "/privacy-policy",
  "/terms",
  "/robots.txt",
  "/llms.txt",
];
const noindexPaths = [
  "/linkedin-patches-answer-today",
  "/linkedin-patches-archive",
  "/linkedin-zip-answer-today",
  "/linkedin-zip-solver",
  "/wend-unlimited",
];

function anchor(href, text) {
  return `<a href="${href}">${text}</a>`;
}

function breadcrumb() {
  return '<nav aria-label="Breadcrumb"><a href="/">Home</a></nav>';
}

function answerPage(path) {
  const number = Number(path.match(/puzzle-(\d+)/)[1]);
  const related = answers.filter((candidate) => candidate !== path).slice(0, 4);
  return [
    "WendAnswerToday",
    breadcrumb(),
    anchor("/", "Today"),
    anchor("/linkedin-wend-archive", "Archive"),
    anchor("/linkedin-wend-solver", "Solver"),
    '<section id="related-wend-answers">',
    ...related.map((candidate) => anchor(candidate, `Wend #${candidate.match(/puzzle-(\d+)/)[1]} answer`)),
    "</section>",
    number < 51 ? anchor(answers.find((candidate) => candidate.includes(`puzzle-${number + 1}-`)), `Next: Wend #${number + 1}`) : "",
    number > 47 ? anchor(answers.find((candidate) => candidate.includes(`puzzle-${number - 1}-`)), `Previous: Wend #${number - 1}`) : "",
  ].join("");
}

function archivePage() {
  return [
    "WendAnswerToday",
    breadcrumb(),
    anchor("/", "Today"),
    anchor("/linkedin-wend-solver", "Solver"),
    anchor("/linkedin-wend-statistics", "Statistics"),
    anchor("#july-2026", "July 2026"),
    '<section id="july-2026">',
    ...answers.map((path) => anchor(path, `LinkedIn Wend #${path.match(/puzzle-(\d+)/)[1]} answer – July 2026`)),
    "</section>",
  ].join("");
}

const htmlByPath = new Map([
  ["/", `WendAnswerToday${anchor("/linkedin-wend-archive", "Archive")}${anchor("/missing-internal-page", "Broken internal link")}`],
  ["/linkedin-wend-archive", archivePage()],
  ["/linkedin-wend-solver", `WendAnswerToday${breadcrumb()}${anchor("/", "Today")}${anchor("/how-to-play-linkedin-wend", "How to Play")}${anchor("/linkedin-wend-archive", "Archive")}${anchor(answers[0], "Wend #51 answer")}`],
  ["/linkedin-wend-statistics", `WendAnswerToday${breadcrumb()}${anchor("/linkedin-wend-archive", "Archive")}${anchor("/linkedin-wend-solver", "Solver")}${anchor(answers[0], "Wend #51 answer")}`],
  ["/how-to-play-linkedin-wend", `WendAnswerToday${breadcrumb()}${anchor("/", "Today")}${anchor("/linkedin-wend-solver", "Solver")}${anchor("/linkedin-wend-archive", "Archive")}`],
  ...answers.map((path) => [path, answerPage(path)]),
  ...smokeOnlyPaths.map((path) => [path, "WendAnswerToday"]),
]);

const sitemap = `<?xml version="1.0"?><urlset>${[...corePaths, ...answers]
  .map((path) => `<url><loc>https://example.test${path}</loc></url>`)
  .join("")}</urlset>`;

const redirects = new Map([
  ["/linkedin-wend-answer-today", { location: "/", status: 301 }],
  ["/linkedin-games-answers-today", { location: "/", status: 301 }],
  ["/linkedin-wend-answer-51-july-29-2026", { location: answers[0], status: 308 }],
]);

const securityHeaders = {
  "content-security-policy": "default-src 'self'",
  "permissions-policy": "camera=()",
  "referrer-policy": "strict-origin-when-cross-origin",
  "strict-transport-security": "max-age=31536000",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
};

const server = http.createServer((request, response) => {
  for (const [name, value] of Object.entries(securityHeaders)) response.setHeader(name, value);
  const path = new URL(request.url, "http://127.0.0.1").pathname;
  const redirect = redirects.get(path);
  if (redirect) {
    response.writeHead(redirect.status, { location: redirect.location });
    response.end();
    return;
  }
  if (path === "/sitemap.xml") {
    response.writeHead(200, { "content-type": "application/xml" });
    response.end(sitemap);
    return;
  }
  if (noindexPaths.includes(path)) {
    response.writeHead(200, { "content-type": "text/html" });
    response.end('<meta name="robots" content="noindex, follow">WendAnswerToday');
    return;
  }
  if (htmlByPath.has(path)) {
    response.writeHead(200, { "content-type": "text/html" });
    response.end(htmlByPath.get(path));
    return;
  }
  response.writeHead(404, { "content-type": "text/plain" });
  response.end("Not found");
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const address = server.address();
const child = spawn(process.execPath, ["scripts/smoke-local.mjs"], {
  cwd: process.cwd(),
  env: { ...process.env, SMOKE_BASE_URL: `http://127.0.0.1:${address.port}` },
  stdio: ["ignore", "pipe", "pipe"],
});
let output = "";
child.stdout.on("data", (chunk) => { output += chunk; });
child.stderr.on("data", (chunk) => { output += chunk; });
const exitCode = await new Promise((resolve) => child.on("close", resolve));
await new Promise((resolve) => server.close(resolve));

assert.notEqual(exitCode, 0, "release smoke must fail when a rendered page links to a 404 destination");
assert.match(output, /missing-internal-page.*404/i);

console.log("wend smoke internal-link integration test passed");
