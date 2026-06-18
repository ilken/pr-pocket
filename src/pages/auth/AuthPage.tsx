import { Button } from "@/components/ui/Button";
import { useAuthPage } from "./useAuthPage";

const TOKEN_SETTINGS_URL =
  "https://github.com/settings/personal-access-tokens/new";

export function AuthPage() {
  const { value, error, isAuthenticated, onChange, submit, logout } =
    useAuthPage();

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-center px-5 py-12">
      {/* Logo / wordmark */}
      <div className="mb-10 animate-fade-up space-y-1">
        <div className="mb-2 flex items-center gap-2">
          {/* Tiny violet glyph */}
          <div
            className="flex size-8 items-center justify-center rounded-lg"
            style={{
              background: "var(--accent-dim)",
              border: "1px solid var(--accent-border)",
            }}
          >
            <svg className="size-4" viewBox="0 0 16 16" fill="none" aria-hidden>
              <rect
                x="2"
                y="2"
                width="5"
                height="2"
                rx="1"
                fill="currentColor"
                className="text-violet-400"
              />
              <rect
                x="9"
                y="2"
                width="5"
                height="2"
                rx="1"
                fill="currentColor"
                className="text-violet-300 opacity-50"
              />
              <rect
                x="2"
                y="6"
                width="8"
                height="2"
                rx="1"
                fill="currentColor"
                className="text-violet-400 opacity-70"
              />
              <rect
                x="2"
                y="10"
                width="3"
                height="2"
                rx="1"
                fill="currentColor"
                className="text-green-400"
              />
              <rect
                x="7"
                y="10"
                width="7"
                height="2"
                rx="1"
                fill="currentColor"
                className="text-violet-300 opacity-40"
              />
            </svg>
          </div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            PR Pocket
          </h1>
        </div>
        <p className="text-sm leading-relaxed text-white/45">
          GitHub code review, built for your phone.
        </p>
      </div>

      {/* Auth card */}
      <div
        className="animate-fade-up rounded-2xl p-5"
        style={{
          background: "var(--surface-2)",
          border: "1px solid var(--border-subtle)",
          animationDelay: "60ms",
        }}
      >
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          <div className="space-y-1.5">
            <label
              className="block text-xs font-medium text-white/60 uppercase tracking-wider"
              htmlFor="pat"
            >
              Personal access token
            </label>
            <input
              id="pat"
              type="password"
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              placeholder="github_pat_…"
              value={value}
              onChange={(event) => onChange(event.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm font-mono outline-none transition-all placeholder:text-white/25"
              style={{
                background: "var(--surface-3)",
                border: `1px solid ${error ? "rgba(248,113,113,0.4)" : "var(--border-default)"}`,
                color: "rgba(255,255,255,0.85)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--accent-border)";
                e.currentTarget.style.boxShadow = "0 0 0 3px var(--accent-dim)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = error
                  ? "rgba(248,113,113,0.4)"
                  : "var(--border-default)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            {error ? <p className="text-xs text-red-400">{error}</p> : null}
          </div>

          <Button type="submit" className="w-full">
            Save token
          </Button>
        </form>
      </div>

      {/* Help text */}
      <div
        className="mt-5 animate-fade-up space-y-2 rounded-xl px-4 py-3 text-xs leading-relaxed text-white/35"
        style={{ animationDelay: "120ms" }}
      >
        <p>
          Create a{" "}
          <a
            href={TOKEN_SETTINGS_URL}
            target="_blank"
            rel="noreferrer"
            className="text-violet-400 underline decoration-violet-400/40 underline-offset-2"
          >
            fine-grained token
          </a>{" "}
          with read-only <span className="text-white/50">Pull requests</span>,{" "}
          <span className="text-white/50">Contents</span>, and{" "}
          <span className="text-white/50">Metadata</span>. Short expiry
          recommended.
        </p>
        <p>
          Token is stored in this browser&apos;s local storage only. See the
          README for the security tradeoff.
        </p>
      </div>

      {isAuthenticated ? (
        <div
          className="mt-4 animate-fade-up"
          style={{ animationDelay: "160ms" }}
        >
          <Button variant="ghost" onClick={logout} className="w-full text-xs">
            Clear saved token
          </Button>
        </div>
      ) : null}
    </div>
  );
}
