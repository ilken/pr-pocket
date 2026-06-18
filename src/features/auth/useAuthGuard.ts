import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { GitHubApiError } from "@/lib/github/githubClient";
import { patStore } from "./patStore";

// Wires a react-query error to the auth flow: a 401 from GitHub means the
// stored PAT is invalid/expired, so we clear it and redirect to the auth page.
export function useAuthGuard(error: unknown) {
  const navigate = useNavigate();

  useEffect(() => {
    if (error instanceof GitHubApiError && error.status === 401) {
      patStore.set(null);
      navigate({ to: "/auth" });
    }
  }, [error, navigate]);
}
