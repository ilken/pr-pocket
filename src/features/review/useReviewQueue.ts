import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useAuthGuard } from "@/features/auth/useAuthGuard";
import { usePr } from "@/features/pull-requests/usePr";
import { usePrFiles } from "@/features/pull-requests/usePrFiles";
import {
  usePrFileContents,
  computeChangeGroups,
} from "@/features/diff-engine/usePrChangeGroups";
import { useReviewProgress } from "@/features/review-progress/useReviewProgress";
import type { ChangeGroup } from "@/features/diff-engine/types";
import type { PrFile } from "@/types/github.types";
import { getErrorMessage } from "@/lib/github/errorMessage";

type ReviewItem = {
  file: PrFile;
  group: ChangeGroup;
  fileIndex: number;
  groupIndex: number;
  globalIndex: number;
};

type GroupsState =
  | { status: "idle" }
  | { status: "ready"; items: ReviewItem[]; headSha: string };

export function useReviewQueue() {
  const {
    owner,
    repo,
    number: numberStr,
  } = useParams({
    from: "/pr/$owner/$repo/$number/review",
  });
  const number = parseInt(numberStr, 10);
  const navigate = useNavigate();

  const prQuery = usePr(owner, repo, number);
  const filesQuery = usePrFiles(owner, repo, number);
  const headSha = prQuery.data?.head.sha ?? "";

  useAuthGuard(prQuery.error ?? filesQuery.error);

  const files = filesQuery.data ?? [];
  const fileContents = usePrFileContents(owner, repo, files, headSha);

  const { isFileReviewed, toggleFile } = useReviewProgress(
    owner,
    repo,
    number,
    headSha,
  );

  const [groupsState, setGroupsState] = useState<GroupsState>({
    status: "idle",
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  const isDataReady =
    !prQuery.isLoading &&
    !filesQuery.isLoading &&
    fileContents.every((fc) => !fc.isLoading) &&
    files.length > 0;

  // Compute all change groups once all data is available.
  // We key on headSha so we don't recompute if the PR page re-renders.
  useEffect(() => {
    if (!isDataReady || !headSha) return;
    if (
      groupsState.status !== "idle" &&
      "headSha" in groupsState &&
      groupsState.headSha === headSha
    ) {
      return;
    }

    let cancelled = false;
    const startedFor = headSha;

    const compute = async () => {
      const items: ReviewItem[] = [];
      let globalIndex = 0;
      for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
        const file = files[fileIndex]!;
        const fc = fileContents[fileIndex]!;
        const groups = await computeChangeGroups(file, fc.content);
        for (let groupIndex = 0; groupIndex < groups.length; groupIndex++) {
          items.push({
            file,
            group: groups[groupIndex]!,
            fileIndex,
            groupIndex,
            globalIndex: globalIndex++,
          });
        }
      }
      if (!cancelled) {
        setGroupsState({ status: "ready", items, headSha: startedFor });
      }
    };

    compute().catch(() => {
      if (!cancelled)
        setGroupsState({ status: "ready", items: [], headSha: startedFor });
    });
    return () => {
      cancelled = true;
    };
    // fileContents identity changes each render; key on isDataReady + headSha only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDataReady, headSha]);

  const allGroups = groupsState.status === "ready" ? groupsState.items : [];
  const isComputingGroups =
    isDataReady &&
    headSha !== "" &&
    !(groupsState.status === "ready" && groupsState.headSha === headSha);
  const current = allGroups[currentIndex];
  const total = allGroups.length;

  const markAndAdvance = useCallback(() => {
    if (current) toggleFile(current.file.filename);
    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      navigate({
        to: "/pr/$owner/$repo/$number",
        params: { owner, repo, number: numberStr },
      });
    }
  }, [
    current,
    currentIndex,
    total,
    toggleFile,
    navigate,
    owner,
    repo,
    numberStr,
  ]);

  const skip = useCallback(() => {
    if (currentIndex < total - 1) setCurrentIndex((i) => i + 1);
  }, [currentIndex, total]);

  const goBack = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  }, [currentIndex]);

  const goToOverview = () => {
    navigate({
      to: "/pr/$owner/$repo/$number",
      params: { owner, repo, number: numberStr },
    });
  };

  const errorMessage =
    prQuery.error || filesQuery.error
      ? getErrorMessage(prQuery.error ?? filesQuery.error)
      : null;

  const isLoading =
    prQuery.isLoading ||
    filesQuery.isLoading ||
    fileContents.some((fc) => fc.isLoading) ||
    isComputingGroups;

  return {
    owner,
    repo,
    number,
    pr: prQuery.data,
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
  };
}
