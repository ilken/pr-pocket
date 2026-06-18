// External store for the GitHub Personal Access Token.
//
// Lives outside React so it can be read from route guards and the GitHub
// client. Components subscribe via `useAuth` (useSyncExternalStore).
//
// SECURITY: the token is persisted in localStorage, which is readable by any
// script running on the page (XSS). This is an accepted tradeoff for a
// single-user, read-only tool. See README. Slated to move to OAuth.

const STORAGE_KEY = "pr-pocket:pat";

type Listener = () => void;

const listeners = new Set<Listener>();

function readFromStorage(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

let token: string | null = readFromStorage();

function emit() {
  for (const listener of listeners) listener();
}

export const patStore = {
  get: (): string | null => token,

  set: (next: string | null) => {
    token = next?.trim() ? next.trim() : null;
    try {
      if (token) localStorage.setItem(STORAGE_KEY, token);
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage failures (private mode, quota) — token stays in memory.
    }
    emit();
  },

  subscribe: (listener: Listener): (() => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
