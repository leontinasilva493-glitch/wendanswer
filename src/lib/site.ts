export const site = {
  name: "WendAnswerToday.org",
  url: "https://wendanswertoday.org",
  supportEmail: "support@wendanswertoday.org",
  logo: {
    src: "/images/wend-logo-512.png",
    headerSrc: "/images/wend-logo-128.png",
    appleSrc: "/images/wend-logo-180.png",
    alt: "WendAnswerToday blue path W over yellow and white puzzle tiles logo",
    description:
      "A rounded yellow-and-white puzzle tile logo with a blue winding W path, representing daily Wend word paths and puzzle help.",
  },
  description:
    "Spoiler-safe daily hints, answers, word paths, solver help, and archive pages for LinkedIn Wend.",
  disclaimer:
    "This is an unofficial fan-made puzzle help site. It is not affiliated with, endorsed by, or sponsored by LinkedIn. All trademarks belong to their respective owners.",
};

export function absoluteUrl(path = "/") {
  return `${site.url}${path}`;
}
