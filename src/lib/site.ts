export const site = {
  name: "WendAnswerToday.org",
  url: "https://wendanswertoday.org",
  supportEmail: "support@wendanswertoday.org",
  description:
    "Spoiler-safe daily hints, answers, word paths, solver help, and archive pages for LinkedIn Wend.",
  disclaimer:
    "This is an unofficial fan-made puzzle help site. It is not affiliated with, endorsed by, or sponsored by LinkedIn. All trademarks belong to their respective owners.",
};

export function absoluteUrl(path = "/") {
  return `${site.url}${path}`;
}
