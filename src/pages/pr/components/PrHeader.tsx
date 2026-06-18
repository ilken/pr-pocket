import type { PullRequest } from "@/types/github.types";
import { Badge } from "@/components/ui/Badge";

type PrHeaderProps = {
  pr: PullRequest;
  reviewedCount: number;
  totalFiles: number;
};

export function PrHeader({ pr, reviewedCount, totalFiles }: PrHeaderProps) {
  const progress = totalFiles > 0 ? (reviewedCount / totalFiles) * 100 : 0;

  return (
    <div
      className="rounded-2xl p-4 space-y-4"
      style={{
        background: "var(--surface-2)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      {/* Status + title */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant={pr.draft ? "neutral" : "green"}>
            {pr.draft ? "Draft" : "Open"}
          </Badge>
          <span className="font-mono text-xs text-white/30">#{pr.number}</span>
        </div>
        <h1
          className="text-base font-bold leading-snug text-white/92"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {pr.title}
        </h1>
      </div>

      {/* Branch info */}
      <p className="flex items-center gap-1.5 font-mono text-[11px] text-white/30">
        <span>{pr.base.repo.full_name}</span>
        <span className="text-white/15">·</span>
        <span className="text-white/50">{pr.base.ref}</span>
        <span className="text-white/25">←</span>
        <span className="text-violet-400/70">{pr.head.ref}</span>
      </p>

      {/* Progress */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-white/40">
            {reviewedCount} / {totalFiles} files reviewed
          </span>
          <span
            className="font-semibold"
            style={{ color: progress === 100 ? "#4ade80" : "var(--accent)" }}
          >
            {Math.round(progress)}%
          </span>
        </div>
        <div
          className="h-1.5 w-full overflow-hidden rounded-full"
          style={{ background: "var(--border-subtle)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background:
                progress === 100
                  ? "rgba(74,222,128,0.8)"
                  : "linear-gradient(90deg, var(--accent) 0%, #a78bfa 100%)",
              boxShadow: progress > 0 ? "0 0 8px rgba(139,92,246,0.4)" : "none",
            }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 text-xs">
        <span className="font-mono text-green-400">+{pr.additions}</span>
        <span className="font-mono text-red-400">−{pr.deletions}</span>
        <span className="text-white/30">·</span>
        <span className="text-white/40">{pr.changed_files} files changed</span>
      </div>
    </div>
  );
}
