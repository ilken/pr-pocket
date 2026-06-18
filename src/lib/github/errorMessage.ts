import { GitHubApiError } from "./githubClient";

// Returns a human-readable error message from any query error.
export function getErrorMessage(error: unknown): string {
  if (error instanceof GitHubApiError) {
    if (error.status === 403) {
      return "GitHub API rate limit exceeded. Wait a minute and try again.";
    }
    if (error.status === 404) {
      return "PR not found (404). If this is a private org repo, your token may not have access — org admins must approve fine-grained PATs, or use a classic PAT with repo scope instead.";
    }
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong.";
}
