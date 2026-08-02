import { pathToFileURL } from "node:url";

const corePaths = [
  "/",
  "/linkedin-wend-archive",
  "/linkedin-wend-solver",
  "/linkedin-wend-statistics",
  "/how-to-play-linkedin-wend",
];

function decodeText(value) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&#x27;|&#39;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function anchors(html, baseUrl) {
  return [...html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)]
    .map((match) => {
      try {
        if (match[1].startsWith("#")) return null;
        const url = new URL(match[1], baseUrl);
        if (url.origin !== new URL(baseUrl).origin) return null;
        return { path: url.pathname || "/", text: decodeText(match[2]) };
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function sectionById(html, id) {
  const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return html.match(new RegExp(`<section\\b[^>]*id=["']${escaped}["'][^>]*>([\\s\\S]*?)<\\/section>`, "i"))?.[1] ?? "";
}

function hasVisibleBreadcrumb(html) {
  return /<nav\b[^>]*aria-label=["']Breadcrumb["']/i.test(html);
}

function answerMonthAnchors(answerPaths) {
  const anchors = new Set();
  for (const path of answerPaths) {
    const match = path.match(/-(january|february|march|april|may|june|july|august|september|october|november|december)-\d{1,2}-(\d{4})$/i);
    if (match) anchors.add(`${match[1].toLowerCase()}-${match[2]}`);
  }
  return anchors;
}

function requireLinks(path, pageAnchors, requiredPaths, failures) {
  const available = new Set(pageAnchors.map((anchor) => anchor.path));
  for (const requiredPath of requiredPaths) {
    if (!available.has(requiredPath)) failures.push(`${path} is missing an internal link to ${requiredPath}`);
  }
}

function calculateDepths(htmlByPath, baseUrl) {
  const depths = new Map([["/", 0]]);
  const queue = ["/"];
  while (queue.length > 0) {
    const path = queue.shift();
    const depth = depths.get(path);
    for (const link of anchors(htmlByPath.get(path) ?? "", baseUrl)) {
      if (!htmlByPath.has(link.path) || depths.has(link.path)) continue;
      depths.set(link.path, depth + 1);
      queue.push(link.path);
    }
  }
  return depths;
}

export async function auditWendInternalLinks({ baseUrl, fetchImpl = fetch }) {
  const normalizedBase = baseUrl.replace(/\/$/, "");
  const failures = [];
  const sitemapResponse = await fetchImpl(`${normalizedBase}/sitemap.xml`);
  if (!sitemapResponse.ok) {
    return {
      failures: [`sitemap.xml returned HTTP ${sitemapResponse.status}`],
      summary: { answerPages: 0, auditedPages: 0, maxAnswerDepth: null },
    };
  }

  const sitemap = await sitemapResponse.text();
  const sitemapPaths = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/gi)].map((match) => new URL(match[1]).pathname || "/");
  const answerPaths = sitemapPaths.filter((path) => /^\/wend-answer-puzzle-\d+-/.test(path));
  const auditedPaths = [...new Set([...corePaths, ...answerPaths])];
  const htmlByPath = new Map();

  await Promise.all(auditedPaths.map(async (path) => {
    const response = await fetchImpl(`${normalizedBase}${path}`);
    if (!response.ok) {
      failures.push(`${path} returned HTTP ${response.status}`);
      return;
    }
    htmlByPath.set(path, await response.text());
  }));

  const archiveHtml = htmlByPath.get("/linkedin-wend-archive") ?? "";
  const archiveAnchors = anchors(archiveHtml, normalizedBase);
  requireLinks("/linkedin-wend-archive", archiveAnchors, ["/", "/linkedin-wend-solver", "/linkedin-wend-statistics", ...answerPaths], failures);
  for (const answerAnchor of archiveAnchors.filter((anchor) => answerPaths.includes(anchor.path))) {
    if (/^view answer$/i.test(answerAnchor.text) || !/Wend\s+#\s*\d+/i.test(answerAnchor.text)) {
      failures.push(`generic archive anchor for ${answerAnchor.path}: ${answerAnchor.text || "(empty)"}`);
    }
  }
  for (const monthAnchor of answerMonthAnchors(answerPaths)) {
    const sectionMatch = archiveHtml.match(new RegExp(`id=["']${monthAnchor}["']`, "i"));
    if (!sectionMatch) {
      failures.push(`/linkedin-wend-archive is missing month anchor #${monthAnchor}`);
      continue;
    }
    const navigationMatch = archiveHtml.match(new RegExp(`href=["']#${monthAnchor}["']`, "i"));
    if (!navigationMatch || navigationMatch.index > sectionMatch.index) {
      failures.push(`/linkedin-wend-archive month navigation #${monthAnchor} must appear before its answer section`);
    }
  }

  const hubRequirements = new Map([
    ["/linkedin-wend-solver", ["/", "/how-to-play-linkedin-wend", "/linkedin-wend-archive"]],
    ["/linkedin-wend-statistics", ["/linkedin-wend-archive", "/linkedin-wend-solver"]],
    ["/how-to-play-linkedin-wend", ["/", "/linkedin-wend-solver", "/linkedin-wend-archive"]],
  ]);
  for (const [path, requiredPaths] of hubRequirements) {
    const html = htmlByPath.get(path) ?? "";
    if (!hasVisibleBreadcrumb(html)) failures.push(`${path} is missing a visible breadcrumb`);
    requireLinks(path, anchors(html, normalizedBase), requiredPaths, failures);
  }
  if (!anchors(htmlByPath.get("/linkedin-wend-solver") ?? "", normalizedBase).some((item) => answerPaths.includes(item.path))) {
    failures.push("/linkedin-wend-solver is missing a permanent Wend answer link");
  }
  if (!anchors(htmlByPath.get("/linkedin-wend-statistics") ?? "", normalizedBase).some((item) => answerPaths.includes(item.path))) {
    failures.push("/linkedin-wend-statistics is missing a representative Wend answer link");
  }

  for (const path of answerPaths) {
    const html = htmlByPath.get(path) ?? "";
    if (!hasVisibleBreadcrumb(html)) failures.push(`${path} is missing a visible breadcrumb`);
    const pageAnchors = anchors(html, normalizedBase);
    requireLinks(path, pageAnchors, ["/", "/linkedin-wend-archive", "/linkedin-wend-solver"], failures);
    if (pageAnchors.some((item) => /^(Previous|Next) puzzle$/i.test(item.text))) {
      failures.push(`${path} uses a generic previous/next anchor`);
    }

    const relatedHtml = sectionById(html, "related-wend-answers");
    const relatedPaths = new Set(
      anchors(relatedHtml, normalizedBase)
        .map((item) => item.path)
        .filter((candidate) => answerPaths.includes(candidate) && candidate !== path),
    );
    const requiredRelated = Math.min(4, Math.max(0, answerPaths.length - 1));
    if (relatedPaths.size < requiredRelated) {
      failures.push(`${path} has ${relatedPaths.size} related Wend answers; expected ${requiredRelated}`);
    }
  }

  const discoveredInternalLinks = new Map();
  for (const [sourcePath, html] of htmlByPath) {
    for (const link of anchors(html, normalizedBase)) {
      if (!discoveredInternalLinks.has(link.path)) discoveredInternalLinks.set(link.path, new Set());
      discoveredInternalLinks.get(link.path).add(sourcePath);
    }
  }
  const uncheckedPaths = [...discoveredInternalLinks.keys()].filter((path) => !htmlByPath.has(path));
  await Promise.all(uncheckedPaths.map(async (path) => {
    const response = await fetchImpl(`${normalizedBase}${path}`);
    if (!response.ok) {
      const sources = [...discoveredInternalLinks.get(path)].slice(0, 3).join(", ");
      failures.push(`${path} returned HTTP ${response.status}; linked from ${sources}`);
    }
  }));

  const depths = calculateDepths(htmlByPath, normalizedBase);
  const answerDepths = answerPaths.map((path) => depths.get(path)).filter((depth) => depth !== undefined);
  if (answerDepths.length !== answerPaths.length) {
    failures.push(`${answerPaths.length - answerDepths.length} Wend answer pages are unreachable from the homepage`);
  }
  const maxAnswerDepth = answerDepths.length > 0 ? Math.max(...answerDepths) : null;
  if (maxAnswerDepth !== null && maxAnswerDepth > 2) failures.push(`maximum Wend answer click depth is ${maxAnswerDepth}; expected at most 2`);

  return {
    failures: [...new Set(failures)].sort(),
    summary: {
      answerPages: answerPaths.length,
      auditedPages: htmlByPath.size,
      maxAnswerDepth,
    },
  };
}

async function main() {
  const baseUrl = process.env.INTERNAL_LINK_BASE_URL || process.env.SMOKE_BASE_URL || "http://127.0.0.1:3000";
  const result = await auditWendInternalLinks({ baseUrl });
  if (result.failures.length > 0) {
    console.error("Wend internal-link audit failed:");
    for (const failure of result.failures) console.error(`- ${failure}`);
    process.exitCode = 1;
    return;
  }
  console.log(
    `Wend internal-link audit passed: ${result.summary.answerPages} answer pages, ${result.summary.auditedPages} audited pages, max answer depth ${result.summary.maxAnswerDepth}.`,
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
