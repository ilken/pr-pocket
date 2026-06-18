import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/useAuth";
import { fetchPrFiles } from "@/lib/github/githubApi";

export function usePrFiles(owner: string, repo: string, number: number) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["github", "pr-files", owner, repo, number],
    queryFn: () => fetchPrFiles(owner, repo, number),
    enabled: isAuthenticated,
    // File lists don't change between reviews of the same PR head, so we can
    // cache them longer than the default.
    staleTime: 5 * 60_000,
  });
}
