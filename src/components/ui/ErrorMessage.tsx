type ErrorMessageProps = { message: string; onRetry?: () => void };

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
      <p>{message}</p>
      {onRetry ? (
        <button
          onClick={onRetry}
          className="mt-2 text-xs underline opacity-70 hover:opacity-100"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}
