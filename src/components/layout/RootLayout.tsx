import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export function RootLayout() {
  return (
    // Radial glow from top-centre gives the dark screen depth.
    <div
      className="relative min-h-dvh font-sans text-zinc-100 antialiased"
      style={{ background: "var(--surface-0)" }}
    >
      {/* Top-centre glow blob */}
      <div
        aria-hidden
        className="pointer-events-none fixed left-1/2 top-0 -translate-x-1/2"
        style={{
          width: "600px",
          height: "300px",
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.08) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />
      <div className="relative z-10">
        <Outlet />
      </div>
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </div>
  );
}
