import Link from "next/link";

type GameCardProps = {
  name: string;
  status: string;
  number?: number;
  todayPath?: string;
  archivePath?: string;
  solverPath?: string;
};

export function GameCard({ name, status, number, todayPath, archivePath, solverPath }: GameCardProps) {
  return (
    <article className="archive-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-ink">{name}</h3>
          <p className="mt-1 text-sm text-slate-600">{number ? `Puzzle #${number}` : "Planned page"}</p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            status === "Updated" ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-600"
          }`}
        >
          {status}
        </span>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {todayPath ? (
          <Link className="resource-link min-h-10 justify-center" href={todayPath}>
            Answer
          </Link>
        ) : null}
        {solverPath ? (
          <Link className="resource-link min-h-10 justify-center" href={solverPath}>
            Solver
          </Link>
        ) : null}
        {archivePath ? (
          <Link className="resource-link min-h-10 justify-center" href={archivePath}>
            Archive
          </Link>
        ) : null}
      </div>
    </article>
  );
}
