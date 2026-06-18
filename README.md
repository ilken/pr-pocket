# PR Pocket

A mobile-browser-friendly GitHub pull request reviewer. It makes diffs legible
on a phone by walking you through changes **one at a time** — grouped by the
enclosing function for TypeScript/JavaScript, with a clean hunk-by-hunk fallback
for everything else.

This is a **personal, read-only** tool: it never writes to GitHub (no comments,
approvals, or merges). It is a fully static single-page app with no backend.

## Stack

- **Vite + React + TypeScript**
- **TanStack Router** (code-based, hash history for GitHub Pages)
- **TanStack Query** for data fetching/caching
- **Tailwind CSS v4** for styling
- **web-tree-sitter** for semantic (function-level) diff grouping
- **shiki** for syntax highlighting

## ⚠️ Security: token storage

PR Pocket authenticates to GitHub with a **Personal Access Token (PAT)** that
you paste in. The token is stored in the browser's **`localStorage`**.

`localStorage` is readable by any JavaScript running on the page, so a
cross-site-scripting (XSS) bug — in this app or a dependency — could expose the
token. This is an **accepted tradeoff** for a single-user, read-only tool, but
you should mitigate it:

- Use a **fine-grained** token, not a classic `repo`-scoped one.
- Grant **read-only** access to the minimum needed: **Pull requests**,
  **Contents**, **Metadata**.
- Limit it to the repositories/orgs you actually review.
- Set a **short expiry** and rotate it.
- Clear the token from the auth screen when you're done on a shared device.

> **Planned:** replace PAT storage with a proper GitHub **OAuth** flow so no
> long-lived token lives in the browser. Until then, treat the PAT as sensitive.

Create a token at
<https://github.com/settings/personal-access-tokens/new>.

## Development

```bash
npm install
npm run dev        # start the dev server
npm run build      # type-check + production build
npm run preview    # preview the production build
npm run test       # run unit tests (vitest)
npm run typecheck  # type-check only
npm run lint       # eslint
```

## Deployment

Pushes to `main` are built and published to **GitHub Pages** by
`.github/workflows/deploy.yml`. The production base path is `/pr-pocket/`
(see `vite.config.ts`); update it if you rename the repository.

In the repository settings, set **Pages → Build and deployment → Source** to
**GitHub Actions**.
