import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Spinner } from "@/components/ui/Spinner";
import { PrHeader } from "./components/PrHeader";
import { FileListItem } from "./components/FileListItem";
import { usePrPage } from "./usePrPage";

export function PrPage() {
  const {
    owner,
    repo,
    number,
    pr,
    files,
    isLoading,
    errorMessage,
    reviewedCount,
    totalFiles,
    isFileReviewed,
    toggleFile,
    startReview,
  } = usePrPage();

  return (
    <div className="mx-auto w-full max-w-md px-4 pb-10 pt-6">
      {/* Back nav */}
      <Link
        to="/"
        className="mb-5 inline-flex items-center gap-1.5 text-xs text-white/30 transition-colors hover:text-white/60"
      >
        <svg
          className="size-3"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M8 2L4 6l4 4" />
        </svg>
        Review requests
      </Link>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      ) : errorMessage ? (
        <ErrorMessage message={errorMessage} />
      ) : pr ? (
        <div className="animate-fade-up space-y-4">
          <PrHeader
            pr={pr}
            reviewedCount={reviewedCount}
            totalFiles={totalFiles}
          />

          {/* Start review CTA */}
          <Button onClick={startReview} className="w-full">
            {reviewedCount > 0 ? "Continue review" : "Start review"}
          </Button>

          {/* File list */}
          <section>
            <p className="mb-2 text-[11px] font-medium uppercase tracking-widest text-white/25">
              Files changed
            </p>
            <div
              className="divide-y overflow-hidden rounded-2xl"
              style={
                {
                  background: "var(--surface-2)",
                  border: "1px solid var(--border-subtle)",
                  borderColor: "var(--border-subtle)",
                  "--tw-divide-opacity": "1",
                } as React.CSSProperties
              }
            >
              {files.map((file) => (
                <div
                  key={file.filename}
                  style={{ borderColor: "var(--border-subtle)" }}
                >
                  <FileListItem
                    file={file}
                    isReviewed={isFileReviewed(file.filename)}
                    onToggle={() => toggleFile(file.filename)}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* External link */}
          <a
            href={pr.html_url}
            target="_blank"
            rel="noreferrer"
            className="block text-center font-mono text-[11px] text-white/20 transition-colors hover:text-white/50"
          >
            Open in GitHub ↗
          </a>
        </div>
      ) : (
        <p className="py-16 text-center text-sm text-white/35">
          PR not found. Check the URL or your token permissions.
          <br />
          <span className="mt-1 block font-mono text-xs text-white/20">
            {owner}/{repo} #{number}
          </span>
        </p>
      )}
    </div>
  );
}
