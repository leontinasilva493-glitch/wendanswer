import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { wendArchiveSlug } from "@/lib/dates";
import { wendPuzzles } from "@/lib/puzzles";

const staticPaths = [
  "/",
  "/linkedin-wend-answer-today",
  "/linkedin-wend-solver",
  "/linkedin-wend-archive",
  "/where-is-linkedin-wend",
  "/how-to-play-linkedin-wend",
  "/how-to-solve-linkedin-wend",
  "/faq",
  "/contact",
  "/press",
  "/disclaimer",
  "/privacy-policy",
  "/terms",
];

const wendDrivenPaths = new Set(["/", "/linkedin-wend-answer-today", "/linkedin-wend-solver", "/linkedin-wend-archive"]);

const fixedContentLastModified: Record<string, string> = {
  "/where-is-linkedin-wend": "2026-06-24T00:00:00.000Z",
  "/how-to-play-linkedin-wend": "2026-06-28T00:00:00.000Z",
  "/how-to-solve-linkedin-wend": "2026-06-28T00:00:00.000Z",
  "/faq": "2026-07-09T00:00:00.000Z",
  "/contact": "2026-06-24T00:00:00.000Z",
  "/press": "2026-07-02T00:00:00.000Z",
  "/disclaimer": "2026-06-24T00:00:00.000Z",
  "/privacy-policy": "2026-07-01T00:00:00.000Z",
  "/terms": "2026-06-24T00:00:00.000Z",
};

function priorityForPath(path: string) {
  if (path === "/") return 1;
  if (path === "/linkedin-wend-answer-today") return 0.95;
  if (path === "/linkedin-wend-solver") return 0.85;
  if (path === "/linkedin-wend-archive") return 0.75;
  if (path === "/where-is-linkedin-wend") return 0.65;
  if (path.startsWith("/how-to-")) return 0.65;
  if (["/faq", "/contact", "/press"].includes(path)) return 0.4;
  return 0.25;
}

function changeFrequencyForPath(path: string) {
  if (path === "/" || path === "/linkedin-wend-answer-today") return "daily" as const;
  if (path === "/linkedin-wend-solver") return "daily" as const;
  if (path === "/linkedin-wend-archive") return "weekly" as const;
  return "monthly" as const;
}

function lastModifiedForPath(path: string) {
  const latestWendUpdatedAt = wendPuzzles[0]?.updatedAt ?? "2026-06-24T00:00:00.000Z";
  if (wendDrivenPaths.has(path)) return new Date(latestWendUpdatedAt);

  return new Date(fixedContentLastModified[path] ?? "2026-06-24T00:00:00.000Z");
}

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = staticPaths.map((path) => ({
    url: `${site.url}${path}`,
    lastModified: lastModifiedForPath(path),
    changeFrequency: changeFrequencyForPath(path),
    priority: priorityForPath(path),
  }));

  const history = wendPuzzles.map((puzzle) => ({
    url: `${site.url}/${wendArchiveSlug(puzzle.puzzleNumber, puzzle.dateLabel)}`,
    lastModified: new Date(puzzle.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  return [...pages, ...history];
}
