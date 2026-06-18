import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/useAuth";
import { fetchPr } from "@/lib/github/githubApi";

export function usePr(owner: string, repo: string, number: number) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["github", "pr", owner, repo, number],
    queryFn: () => fetchPr(owner, repo, number),
    enabled: isAuthenticated,
  });
}
