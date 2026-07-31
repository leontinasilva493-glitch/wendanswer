import Link from "next/link";
import { ChevronRight } from "lucide-react";

type BreadcrumbItem = {
  href?: string;
  label: string;
};

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm font-bold text-slate-600">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => (
          <li className="flex items-center gap-1.5" key={`${item.label}-${index}`}>
            {index > 0 ? <ChevronRight aria-hidden className="h-4 w-4 text-slate-400" /> : null}
            {item.href ? (
              <Link className="transition hover:text-brand hover:underline" href={item.href}>
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-ink">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
