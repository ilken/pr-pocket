import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/features/auth/useAuth";

export function useAuthPage() {
  const { isAuthenticated, login, logout } = useAuth();
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onChange = (next: string) => {
    setValue(next);
    if (error) setError(null);
  };

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed) {
      setError("Paste a token to continue.");
      return;
    }
    login(trimmed);
    setValue("");
    navigate({ to: "/" });
  };

  return {
    value,
    error,
    isAuthenticated,
    onChange,
    submit,
    logout,
  };
}
