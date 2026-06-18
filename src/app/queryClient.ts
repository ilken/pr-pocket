import { QueryClient } from "@tanstack/react-query";

// GitHub data changes slowly relative to a review session, so we keep data
// fresh for a minute and avoid refetching on window focus (annoying on mobile).
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
