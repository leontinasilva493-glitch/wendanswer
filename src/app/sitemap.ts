import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { wendArchiveSlug } from "@/lib/dates";
import { todayWend, wendPuzzles } from "@/lib/puzzles";

const staticPaths = [
  "/",
  "/linkedin-wend-answer-today",
  "/linkedin-wend-solver",
  "/linkedin-wend-archive",
  "/wend-unlimited",
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

const dailyContentPaths = new Set(["/", "/linkedin-wend-answer-today", "/linkedin-wend-solver", "/linkedin-wend-archive"]);

function priorityForPath(path: string) {
  if (path === "/") return 1;
  if (path === "/linkedin-wend-answer-today") return 0.95;
  if (path === "/linkedin-wend-solver") return 0.85;
  if (path === "/linkedin-wend-archive") return 0.75;
  if (path === "/wend-unlimited") return 0.7;
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

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = staticPaths.map((path) => {
    const page = {
      url: `${site.url}${path}`,
      changeFrequency: changeFrequencyForPath(path),
      priority: priorityForPath(path),
    };
    return dailyContentPaths.has(path) ? { ...page, lastModified: new Date(todayWend.updatedAt) } : page;
  });

  const history = wendPuzzles.map((puzzle) => ({
    url: `${site.url}/${wendArchiveSlug(puzzle.puzzleNumber, puzzle.dateLabel)}`,
    lastModified: new Date(puzzle.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  return [...pages, ...history];
}
