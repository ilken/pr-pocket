type SpinnerProps = { size?: "sm" | "md" };

const SIZE: Record<NonNullable<SpinnerProps["size"]>, string> = {
  sm: "size-4 border-2",
  md: "size-7 border-2",
};

export function Spinner({ size = "md" }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-white/20 border-t-white ${SIZE[size]}`}
    />
  );
}
