import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Spinner } from "@/components/ui/Spinner";
import { useShikiHighlighter } from "@/features/diff-engine/useShikiHighlighter";
import { useReviewQueue } from "@/features/review/useReviewQueue";
import { DiffCard } from "./components/DiffCard";
import { ReviewProgress } from "./components/ReviewProgress";

export function ReviewPage() {
  const {
    current,
    currentIndex,
    total,
    isLoading,
    errorMessage,
    isFileReviewed,
    markAndAdvance,
    skip,
    goBack,
    goToOverview,
  } = useReviewQueue();

  const highlighter = useShikiHighlighter();

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 py-5">
      {/* Top bar */}
      <header className="mb-5 flex items-center justify-between">
        <button
          onClick={goToOverview}
          className="flex items-center gap-1.5 text-xs text-white/30 transition-colors hover:text-white/60"
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
          Overview
        </button>
        {total > 0 ? (
          <span className="font-mono text-xs text-white/25">
            {currentIndex + 1} / {total}
          </span>
        ) : null}
      </header>

      {/* Content area */}
      <div className="flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner />
          </div>
        ) : errorMessage ? (
          <ErrorMessage message={errorMessage} />
        ) : total === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-white/40">No changes to review.</p>
            <Button onClick={goToOverview} variant="ghost" className="mt-4">
              Back to overview
            </Button>
          </div>
        ) : current ? (
          <div className="animate-fade-up space-y-3">
            {/* Progress */}
            <ReviewProgress
              current={currentIndex + 1}
              total={total}
              filename={current.file.filename}
            />

            {/* Already-reviewed badge */}
            {isFileReviewed(current.file.filename) ? (
              <div
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs"
                style={{
                  background: "rgba(139,92,246,0.08)",
                  border: "1px solid rgba(139,92,246,0.2)",
                  color: "rgba(167,139,250,0.8)",
                }}
              >
                <svg
                  className="size-3.5"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="2,6 5,9 10,3" />
                </svg>
                File already marked reviewed
              </div>
            ) : null}

            {/* The diff card */}
            <DiffCard
              group={current.group}
              filename={current.file.filename}
              highlighter={highlighter}
            />
          </div>
        ) : null}
      </div>

      {/* Bottom navigation */}
      {!isLoading && total > 0 ? (
        <footer className="mt-6 space-y-2.5 pb-safe">
          <Button onClick={markAndAdvance} className="w-full">
            {currentIndex === total - 1
              ? "Done — back to overview"
              : "Mark reviewed & next"}
          </Button>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={goBack}
              disabled={currentIndex === 0}
              className="flex-1"
            >
              ← Prev
            </Button>
            <Button variant="ghost" onClick={skip} className="flex-1">
              Skip →
            </Button>
          </div>
        </footer>
      ) : null}
    </div>
  );
}
