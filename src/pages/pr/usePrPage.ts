import { useNavigate, useParams } from "@tanstack/react-router";
import { useAuthGuard } from "@/features/auth/useAuthGuard";
import { usePr } from "@/features/pull-requests/usePr";
import { usePrFiles } from "@/features/pull-requests/usePrFiles";
import { useReviewProgress } from "@/features/review-progress/useReviewProgress";
import { getErrorMessage } from "@/lib/github/errorMessage";

export function usePrPage() {
  const {
    owner,
    repo,
    number: numberStr,
  } = useParams({
    from: "/pr/$owner/$repo/$number",
  });
  const number = parseInt(numberStr, 10);
  const navigate = useNavigate();

  const prQuery = usePr(owner, repo, number);
  const filesQuery = usePrFiles(owner, repo, number);

  useAuthGuard(prQuery.error ?? filesQuery.error);

  const headSha = prQuery.data?.head.sha ?? "";

  const { reviewedFiles, toggleFile, isFileReviewed, reviewedCount } =
    useReviewProgress(owner, repo, number, headSha);

  const goBack = () => navigate({ to: "/" });

  const startReview = () => {
    navigate({
      to: "/pr/$owner/$repo/$number/review",
      params: { owner, repo, number: numberStr },
    });
  };

  return {
    owner,
    repo,
    number,
    pr: prQuery.data,
    files: filesQuery.data ?? [],
    isLoading: prQuery.isLoading || filesQuery.isLoading,
    errorMessage:
      prQuery.error || filesQuery.error
        ? getErrorMessage(prQuery.error ?? filesQuery.error)
        : null,
    headSha,
    reviewedFiles,
    reviewedCount,
    totalFiles: filesQuery.data?.length ?? 0,
    toggleFile,
    isFileReviewed,
    goBack,
    startReview,
  };
}
