import { patStore } from "@/features/auth/patStore";

const GITHUB_API = "https://api.github.com";

export class GitHubApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "GitHubApiError";
    this.status = status;
  }
}

// Reads the PAT from patStore at request time — always uses the current token
// without the caller needing to pass it in or re-instantiate anything.
export async function githubRequest<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const token = patStore.get();
  if (!token) throw new GitHubApiError("Not authenticated", 401);

  const response = await fetch(`${GITHUB_API}${path}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const message = await response
      .json()
      .then((body: unknown) => {
        if (
          body !== null &&
          typeof body === "object" &&
          "message" in body &&
          typeof body.message === "string"
        ) {
          return body.message;
        }
        return response.statusText;
      })
      .catch(() => response.statusText);
    throw new GitHubApiError(message, response.status);
  }

  return response.json() as Promise<T>;
}

export function isGitHubApiError(error: unknown): error is GitHubApiError {
  return error instanceof GitHubApiError;
}
