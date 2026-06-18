type ReviewProgressProps = {
  current: number;
  total: number;
  filename: string;
};

export function ReviewProgress({
  current,
  total,
  filename,
}: ReviewProgressProps) {
  const progress = total > 0 ? (current / total) * 100 : 0;
  const basename = filename.split("/").pop() ?? filename;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="min-w-0 truncate font-mono text-xs text-white/40">
          {basename}
        </span>
        <span
          className="shrink-0 text-xs font-semibold tabular-nums"
          style={{ color: "var(--accent)" }}
        >
          {current} / {total}
        </span>
      </div>
      <div
        className="h-1 w-full overflow-hidden rounded-full"
        style={{ background: "var(--border-subtle)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${progress}%`,
            background:
              "linear-gradient(90deg, var(--accent) 0%, #a78bfa 100%)",
            boxShadow: "0 0 6px rgba(139,92,246,0.5)",
          }}
        />
      </div>
    </div>
  );
}
