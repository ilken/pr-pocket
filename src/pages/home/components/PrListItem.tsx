import type { PrListItem } from "@/features/pull-requests/usePrList";
import { Badge } from "@/components/ui/Badge";

type PrListItemProps = {
  item: PrListItem;
  onClick: () => void;
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function PrListItemCard({ item, onClick }: PrListItemProps) {
  return (
    <button
      onClick={onClick}
      className="group w-full rounded-2xl p-4 text-left transition-all duration-200 active:scale-[0.98]"
      style={{
        background: "var(--surface-2)",
        border: "1px solid var(--border-subtle)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--accent-border)";
        e.currentTarget.style.boxShadow = "0 0 20px rgba(139,92,246,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border-subtle)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Repo label */}
      <p className="mb-1.5 font-mono text-[11px] text-white/35">
        {item.owner}/{item.repo}{" "}
        <span className="text-white/20">#{item.number}</span>
      </p>

      {/* PR title */}
      <p
        className="mb-3 text-sm font-semibold leading-snug text-white/90 line-clamp-2"
        style={{ fontFamily: "var(--font-display)", fontSize: "15px" }}
      >
        {item.title}
      </p>

      {/* Footer row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {item.draft ? <Badge variant="neutral">Draft</Badge> : null}
          {item.labels.slice(0, 3).map((label) => (
            <span
              key={label.name}
              className="rounded-md px-1.5 py-0.5 text-[11px] font-medium"
              style={{
                backgroundColor: `#${label.color}18`,
                color: `#${label.color}`,
                border: `1px solid #${label.color}30`,
              }}
            >
              {label.name}
            </span>
          ))}
        </div>
        <span className="shrink-0 text-[11px] text-white/25">
          {timeAgo(item.updated_at)}
        </span>
      </div>
    </button>
  );
}
