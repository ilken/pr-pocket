import { GitHubApiError } from "./githubClient";

// Returns a human-readable error message from any query error.
export function getErrorMessage(error: unknown): string {
  if (error instanceof GitHubApiError) {
    if (error.status === 403) {
      return "GitHub API rate limit exceeded. Wait a minute and try again.";
    }
    if (error.status === 404) {
      return "Not found. Check the URL or your token permissions.";
    }
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong.";
}
