import { Button } from "@/components/ui/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Spinner } from "@/components/ui/Spinner";
import { PrListItemCard } from "./components/PrListItem";
import { useHomePage } from "./useHomePage";

export function HomePage() {
  const {
    prList,
    isLoading,
    errorMessage,
    refetch,
    urlInput,
    urlError,
    onUrlChange,
    submitUrl,
    openPr,
    signOut,
  } = useHomePage();

  return (
    <div className="mx-auto w-full max-w-md px-4 pb-10 pt-6">
      {/* Header */}
      <header className="mb-7 flex items-center justify-between">
        <h1
          className="text-xl font-bold tracking-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          PR Pocket
        </h1>
        <button
          onClick={signOut}
          className="text-xs text-white/30 transition-colors hover:text-white/60"
        >
          Sign out
        </button>
      </header>

      {/* Paste URL */}
      <section className="mb-7 animate-fade-up">
        <p className="mb-2 text-[11px] font-medium uppercase tracking-widest text-white/30">
          Open a PR
        </p>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            submitUrl();
          }}
        >
          <input
            type="url"
            value={urlInput}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder="Paste a GitHub PR URL…"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            className="min-w-0 flex-1 rounded-xl px-3 py-2.5 text-sm outline-none transition-all placeholder:text-white/20"
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--border-default)",
              color: "rgba(255,255,255,0.85)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--accent-border)";
              e.currentTarget.style.boxShadow = "0 0 0 3px var(--accent-dim)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--border-default)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
          <Button type="submit" className="shrink-0 px-4">
            Open
          </Button>
        </form>
        {urlError ? (
          <p className="mt-2 text-xs text-red-400">{urlError}</p>
        ) : null}
      </section>

      {/* Review requests */}
      <section>
        <p className="mb-3 text-[11px] font-medium uppercase tracking-widest text-white/30">
          Waiting for your review
        </p>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : errorMessage ? (
          <ErrorMessage message={errorMessage} onRetry={() => refetch()} />
        ) : prList.length === 0 ? (
          <div
            className="rounded-2xl py-14 text-center"
            style={{
              background: "var(--surface-1)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <p className="text-sm text-white/30">
              No review requests right now.
            </p>
          </div>
        ) : (
          <ul className="stagger space-y-2.5">
            {prList.map((item) => (
              <li key={item.id}>
                <PrListItemCard
                  item={item}
                  onClick={() => openPr(item.owner, item.repo, item.number)}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
