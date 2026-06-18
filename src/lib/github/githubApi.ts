import type {
  FileContent,
  PrFile,
  PrSearchItem,
  PullRequest,
} from "@/types/github.types";
import { githubRequest } from "./githubClient";

// GET /search/issues — returns PRs where @me is a requested reviewer.
// Note: the search API has a lower rate limit (30 req/min authenticated).
export async function fetchReviewRequestedPrs(): Promise<PrSearchItem[]> {
  const query = "is:pr+is:open+review-requested:@me";
  const data = await githubRequest<{ items: PrSearchItem[] }>(
    `/search/issues?q=${query}&per_page=30&sort=updated&order=desc`,
  );
  return data.items;
}

// GET /repos/{owner}/{repo}/pulls/{number}
export async function fetchPr(
  owner: string,
  repo: string,
  number: number,
): Promise<PullRequest> {
  return githubRequest<PullRequest>(`/repos/${owner}/${repo}/pulls/${number}`);
}

// GET /repos/{owner}/{repo}/pulls/{number}/files
// GitHub caps at 300 files per response and omits `patch` for large/binary
// files. We fetch 100 per page — enough for almost all real PRs.
export async function fetchPrFiles(
  owner: string,
  repo: string,
  number: number,
): Promise<PrFile[]> {
  return githubRequest<PrFile[]>(
    `/repos/${owner}/${repo}/pulls/${number}/files?per_page=100`,
  );
}

// GET /repos/{owner}/{repo}/contents/{path}?ref={ref}
// Returns the raw file content at the given commit SHA or branch ref.
export async function fetchFileContent(
  owner: string,
  repo: string,
  path: string,
  ref: string,
): Promise<string> {
  const data = await githubRequest<FileContent>(
    `/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}?ref=${ref}`,
  );
  if (data.type !== "file" || !data.content) {
    throw new Error("Not a file or content missing");
  }
  // GitHub returns base64 content with embedded newlines.
  return atob(data.content.replace(/\n/g, ""));
}

// Extract { owner, repo } from a GitHub API repository URL:
// "https://api.github.com/repos/{owner}/{repo}"
export function parseRepoUrl(
  repositoryUrl: string,
): { owner: string; repo: string } | null {
  const match = repositoryUrl.match(/\/repos\/([^/]+)\/([^/]+)$/);
  if (!match?.[1] || !match?.[2]) return null;
  return { owner: match[1], repo: match[2] };
}
