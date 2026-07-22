import Link from "next/link";
import { Archive, CalendarDays, Grid3X3 } from "lucide-react";

export function BottomNav() {
  const items = [
    ["Today", "/", CalendarDays],
    ["Solver", "/linkedin-wend-solver", Grid3X3],
    ["Archive", "/linkedin-wend-archive", Archive],
  ] as const;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white/95 px-2 py-2 backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-3">
        {items.map(([label, href, Icon]) => (
          <Link className="flex flex-col items-center gap-1 rounded-lg py-1.5 text-xs font-semibold text-slate-700" href={href} key={href}>
            <Icon aria-hidden className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
