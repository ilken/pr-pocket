import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/useAuth";
import { fetchReviewRequestedPrs, parseRepoUrl } from "@/lib/github/githubApi";
import type { PrSearchItem } from "@/types/github.types";

export type PrListItem = PrSearchItem & {
  owner: string;
  repo: string;
};

async function queryFn(): Promise<PrListItem[]> {
  const items = await fetchReviewRequestedPrs();
  return items.flatMap((item) => {
    const parsed = parseRepoUrl(item.repository_url);
    if (!parsed) return [];
    return [{ ...item, ...parsed }];
  });
}

export function usePrList() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["github", "review-requests"],
    queryFn,
    enabled: isAuthenticated,
  });
}
