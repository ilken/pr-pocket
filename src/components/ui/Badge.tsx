type BadgeVariant = "green" | "red" | "neutral" | "purple";

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
};

const VARIANT: Record<BadgeVariant, string> = {
  green: "bg-green-500/15 text-green-400",
  red: "bg-red-500/15 text-red-400",
  neutral: "bg-white/10 text-white/60",
  purple: "bg-purple-500/15 text-purple-400",
};

export function Badge({ children, variant = "neutral" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${VARIANT[variant]}`}
    >
      {children}
    </span>
  );
}
