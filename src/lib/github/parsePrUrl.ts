export type ParsedPrUrl = {
  owner: string;
  repo: string;
  number: number;
};

// Parses a GitHub PR URL into its components.
// Accepts https://github.com/owner/repo/pull/123 (and /files, /commits, etc.)
export function parsePrUrl(input: string): ParsedPrUrl | null {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return null;
  }
  if (url.hostname !== "github.com") return null;
  const match = url.pathname.match(/^\/([^/]+)\/([^/]+)\/pull\/(\d+)/);
  if (!match) return null;
  const [, owner, repo, numberStr] = match;
  if (!owner || !repo || !numberStr) return null;
  const number = parseInt(numberStr, 10);
  return { owner, repo, number };
}
