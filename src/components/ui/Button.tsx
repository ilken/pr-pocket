import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "ghost" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-white text-black font-medium hover:bg-white/90 active:bg-white/80 shadow-[0_0_0_1px_rgba(255,255,255,0.1)]",
  ghost:
    "border border-white/10 bg-white/4 text-white/80 hover:bg-white/8 hover:border-white/20 active:bg-white/12",
  danger:
    "border border-red-500/30 bg-red-500/8 text-red-400 hover:bg-red-500/15 hover:border-red-500/50",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm transition-all duration-150 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    />
  );
}
