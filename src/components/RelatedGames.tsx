import Link from "next/link";
import { Compass } from "lucide-react";

export function RelatedGames() {
  const links = [
    ["Wend Today", "/linkedin-wend-answer-today"],
    ["Wend Solver", "/linkedin-wend-solver"],
    ["Wend Archive", "/linkedin-wend-archive"],
    ["Find Wend", "/where-is-linkedin-wend"],
    ["How to Play", "/how-to-play-linkedin-wend"],
    ["Solving Tips", "/how-to-solve-linkedin-wend"],
  ];

  return (
    <section className="section content-card">
      <h2 className="section-heading">
        <span className="section-icon">
          <Compass aria-hidden className="h-5 w-5" />
        </span>
        <span>More Wend Resources</span>
      </h2>
      <div className="mt-5 flex flex-wrap gap-2">
        {links.map(([label, href]) => (
          <Link className="chip" href={href} key={href}>
            {label}
          </Link>
        ))}
      </div>
    </section>
  );
}
