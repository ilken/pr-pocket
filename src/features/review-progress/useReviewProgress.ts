import { useCallback, useState } from "react";
import { loadProgress, saveProgress } from "./reviewProgressStore";

export function useReviewProgress(
  owner: string,
  repo: string,
  number: number,
  headSha: string,
) {
  // Initialise directly from storage; when headSha changes the PR page will
  // unmount/remount (different route params), so no sync effect is needed.
  const [reviewedFiles, setReviewedFiles] = useState<Set<string>>(() =>
    loadProgress(owner, repo, number, headSha),
  );

  const toggleFile = useCallback(
    (filename: string) => {
      setReviewedFiles((prev) => {
        const next = new Set(prev);
        if (next.has(filename)) next.delete(filename);
        else next.add(filename);
        saveProgress(owner, repo, number, headSha, next);
        return next;
      });
    },
    [owner, repo, number, headSha],
  );

  const isFileReviewed = useCallback(
    (filename: string) => reviewedFiles.has(filename),
    [reviewedFiles],
  );

  return {
    reviewedFiles,
    reviewedCount: reviewedFiles.size,
    toggleFile,
    isFileReviewed,
  };
}
