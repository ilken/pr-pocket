import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/features/auth/useAuth";
import { useAuthGuard } from "@/features/auth/useAuthGuard";
import { usePrList } from "@/features/pull-requests/usePrList";
import { parsePrUrl } from "@/lib/github/parsePrUrl";
import { getErrorMessage } from "@/lib/github/errorMessage";

export function useHomePage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [urlInput, setUrlInput] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);

  const { data: prList, isLoading, error, refetch } = usePrList();
  useAuthGuard(error);

  const signOut = () => {
    logout();
    navigate({ to: "/auth" });
  };

  const onUrlChange = (value: string) => {
    setUrlInput(value);
    if (urlError) setUrlError(null);
  };

  const submitUrl = () => {
    const parsed = parsePrUrl(urlInput);
    if (!parsed) {
      setUrlError(
        "Paste a valid GitHub PR URL, e.g. https://github.com/org/repo/pull/123",
      );
      return;
    }
    navigate({
      to: "/pr/$owner/$repo/$number",
      params: {
        owner: parsed.owner,
        repo: parsed.repo,
        number: String(parsed.number),
      },
    });
  };

  const openPr = (owner: string, repo: string, number: number) => {
    navigate({
      to: "/pr/$owner/$repo/$number",
      params: { owner, repo, number: String(number) },
    });
  };

  return {
    prList: prList ?? [],
    isLoading,
    errorMessage: error ? getErrorMessage(error) : null,
    refetch,
    urlInput,
    urlError,
    onUrlChange,
    submitUrl,
    openPr,
    signOut,
  };
}
