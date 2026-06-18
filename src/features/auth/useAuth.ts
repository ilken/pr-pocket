import { useSyncExternalStore } from "react";
import { patStore } from "./patStore";

export type Auth = {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
};

export function useAuth(): Auth {
  const token = useSyncExternalStore(
    patStore.subscribe,
    patStore.get,
    patStore.get,
  );

  return {
    token,
    isAuthenticated: Boolean(token),
    login: (next: string) => patStore.set(next),
    logout: () => patStore.set(null),
  };
}
