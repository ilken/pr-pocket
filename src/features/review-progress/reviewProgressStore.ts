// Persists per-PR review progress in localStorage.
// Key: "pr-pocket:progress:{owner}/{repo}/{number}"
// Value: { headSha: string, reviewedFiles: string[] }
//
// When a PR receives new commits (headSha changes) the stored progress is
// silently discarded — it no longer applies to the current diff.

const KEY_PREFIX = "pr-pocket:progress";

type StoredProgress = {
  headSha: string;
  reviewedFiles: string[];
};

function storageKey(owner: string, repo: string, number: number) {
  return `${KEY_PREFIX}:${owner}/${repo}/${number}`;
}

export function loadProgress(
  owner: string,
  repo: string,
  number: number,
  currentHeadSha: string,
): Set<string> {
  if (!currentHeadSha) return new Set();
  try {
    const raw = localStorage.getItem(storageKey(owner, repo, number));
    if (!raw) return new Set();
    const stored = JSON.parse(raw) as StoredProgress;
    // New commits — discard stale progress.
    if (stored.headSha !== currentHeadSha) return new Set();
    return new Set(stored.reviewedFiles);
  } catch {
    return new Set();
  }
}

export function saveProgress(
  owner: string,
  repo: string,
  number: number,
  headSha: string,
  reviewedFiles: Set<string>,
) {
  try {
    const value: StoredProgress = {
      headSha,
      reviewedFiles: [...reviewedFiles],
    };
    localStorage.setItem(
      storageKey(owner, repo, number),
      JSON.stringify(value),
    );
  } catch {
    // Ignore storage failures (private mode, quota exceeded).
  }
}
