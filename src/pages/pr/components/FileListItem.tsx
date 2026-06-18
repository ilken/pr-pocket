import type { PrFile, PrFileStatus } from "@/types/github.types";

type FileListItemProps = {
  file: PrFile;
  isReviewed: boolean;
  onToggle: () => void;
};

const STATUS_COLOR: Record<PrFileStatus, string> = {
  added: "text-green-400",
  removed: "text-red-400",
  modified: "text-yellow-400",
  renamed: "text-blue-400",
  copied: "text-blue-400",
  changed: "text-yellow-400",
  unchanged: "text-white/30",
};

const STATUS_LABEL: Record<PrFileStatus, string> = {
  added: "A",
  removed: "D",
  modified: "M",
  renamed: "R",
  copied: "C",
  changed: "M",
  unchanged: "–",
};

// Shows only the file basename with the parent path dimmed.
function splitPath(filename: string): { dir: string; base: string } {
  const lastSlash = filename.lastIndexOf("/");
  if (lastSlash === -1) return { dir: "", base: filename };
  return {
    dir: filename.slice(0, lastSlash + 1),
    base: filename.slice(lastSlash + 1),
  };
}

export function FileListItem({
  file,
  isReviewed,
  onToggle,
}: FileListItemProps) {
  const { dir, base } = splitPath(file.filename);

  return (
    <div
      className={`flex items-center gap-3 px-3 py-2.5 transition-colors ${
        isReviewed ? "opacity-45" : ""
      }`}
    >
      {/* Reviewed checkbox */}
      <button
        onClick={onToggle}
        aria-label={isReviewed ? "Mark unreviewed" : "Mark reviewed"}
        className="flex size-5 shrink-0 items-center justify-center rounded-md transition-all duration-150 active:scale-90"
        style={
          isReviewed
            ? {
                background: "var(--accent)",
                border: "1px solid var(--accent)",
                boxShadow: "0 0 8px rgba(139,92,246,0.4)",
              }
            : {
                background: "transparent",
                border: "1px solid var(--border-default)",
              }
        }
      >
        {isReviewed ? (
          <svg
            className="size-3 text-white"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="2,6 5,9 10,3" />
          </svg>
        ) : null}
      </button>

      {/* Status badge */}
      <span
        className={`w-4 shrink-0 text-center font-mono text-xs font-bold ${STATUS_COLOR[file.status]}`}
      >
        {STATUS_LABEL[file.status]}
      </span>

      {/* Filename */}
      <span className="min-w-0 flex-1 truncate font-mono text-xs">
        {dir ? <span className="text-white/25">{dir}</span> : null}
        <span className={isReviewed ? "text-white/35" : "text-white/80"}>
          {base}
        </span>
      </span>

      {/* Change counts */}
      <span className="shrink-0 font-mono text-xs">
        {file.additions > 0 ? (
          <span className="text-green-500">+{file.additions}</span>
        ) : null}
        {file.deletions > 0 ? (
          <span className="ml-1 text-red-500">-{file.deletions}</span>
        ) : null}
      </span>
    </div>
  );
}
