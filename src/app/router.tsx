import {
  createHashHistory,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { patStore } from "@/features/auth/patStore";
import { RootLayout } from "@/components/layout/RootLayout";
import { AuthPage } from "@/pages/auth/AuthPage";
import { HomePage } from "@/pages/home/HomePage";
import { PrPage } from "@/pages/pr/PrPage";
import { ReviewPage } from "@/pages/pr/review/ReviewPage";

// Guard for routes that need a token. Reads the store directly (not via React)
// because route loaders run outside the component tree.
function requireAuth() {
  if (!patStore.get()) {
    throw redirect({ to: "/auth" });
  }
}

const rootRoute = createRootRoute({ component: RootLayout });

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth",
  component: AuthPage,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: requireAuth,
  component: HomePage,
});

const prRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/pr/$owner/$repo/$number",
  beforeLoad: requireAuth,
  component: PrPage,
});

const reviewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/pr/$owner/$repo/$number/review",
  beforeLoad: requireAuth,
  component: ReviewPage,
});

const routeTree = rootRoute.addChildren([
  authRoute,
  homeRoute,
  prRoute,
  reviewRoute,
]);

// Hash history: GitHub Pages has no server-side SPA fallback, so deep links
// must live under the URL fragment (e.g. /pr-pocket/#/pr/owner/repo/1).
export const router = createRouter({
  routeTree,
  history: createHashHistory(),
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
