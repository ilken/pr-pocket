// Minimal GitHub API response shapes — only fields we actually use.

export type GitHubUser = {
  login: string;
  avatar_url: string;
  html_url: string;
};

// Returned by GET /search/issues
export type PrSearchItem = {
  id: number;
  number: number;
  title: string;
  html_url: string;
  // "https://api.github.com/repos/{owner}/{repo}"
  repository_url: string;
  user: GitHubUser;
  created_at: string;
  updated_at: string;
  draft: boolean;
  labels: Array<{ name: string; color: string }>;
};

export type PullRequest = {
  number: number;
  title: string;
  body: string | null;
  state: "open" | "closed";
  draft: boolean;
  html_url: string;
  user: GitHubUser;
  head: {
    sha: string;
    ref: string;
    repo: {
      full_name: string;
      owner: { login: string };
      name: string;
    };
  };
  base: {
    ref: string;
    repo: {
      full_name: string;
      owner: { login: string };
      name: string;
    };
  };
  additions: number;
  deletions: number;
  changed_files: number;
  created_at: string;
  updated_at: string;
};

export type PrFileStatus =
  | "added"
  | "removed"
  | "modified"
  | "renamed"
  | "copied"
  | "changed"
  | "unchanged";

export type PrFile = {
  sha: string;
  filename: string;
  status: PrFileStatus;
  additions: number;
  deletions: number;
  changes: number;
  blob_url: string;
  raw_url: string;
  // Omitted by GitHub for binary files or when the diff exceeds size limits.
  patch?: string;
  previous_filename?: string;
};

export type FileContent = {
  type: string;
  encoding: string;
  content: string;
  name: string;
  path: string;
  sha: string;
};
