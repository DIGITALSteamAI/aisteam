**Project Summary**
- **Type**: Next.js app (app-router) using TypeScript and React.
- **Entry points**: `app/` (app router). Example layout: `app/layout/AisteamLayout.tsx`.

**How This Repo Is Organized**
- **`app/`**: Primary UI code using the Next.js App Router. Files under `app/` are server components by default; add `"use client"` at the top to make a file a client component (see `app/layout/AisteamLayout.tsx`).
- **Global styles**: `app/globals.css` and occasional in-component `style jsx` (see `AisteamLayout.tsx`).
- **Config & toolchain**: `next.config.ts`, `postcss.config.mjs`, `tsconfig.json`, `package.json` (scripts & deps).

**Developer workflows (commands)**
- Start dev server: `npm run dev` (uses `next dev`).
- Build: `npm run build` -> `next build`.
- Start production server: `npm run start` -> `next start`.
- Lint: `npm run lint` (configured to run `eslint`).

**Project-specific patterns & conventions**
- Prefer editing inside `app/` (App Router). Add client behavior with `"use client"` at the top of the file when DOM APIs, state/hooks, or browser-only behavior are required — example: `app/layout/AisteamLayout.tsx` begins with `"use client"`.
- Styling: global styles live in `app/globals.css`. Some components use inline `style jsx` for local styles (see `AisteamLayout.tsx`). If you add Tailwind utilities, confirm `tailwind.config` exists; `tailwindcss` and `@tailwindcss/postcss` are present in devDependencies.
- TypeScript: codebase expects `.ts`/`.tsx` files; consult `tsconfig.json` for path and compiler options before adding new aliases.

**Files to check when making changes**
- UI/layout changes: `app/layout/AisteamLayout.tsx`, `app/globals.css`, `app/page.tsx`.
- Build or runtime issues: `package.json`, `next.config.ts`, `postcss.config.mjs`.
- Linting and formatting: `eslint` is available via `npm run lint`.

**Examples of useful quick edits**
- Converting a server component into a client component: add `"use client"` at top of the file, then move hook/state logic into that file.
- Small UI tweaks: edit `app/layout/AisteamLayout.tsx` (top-level layout) or `app/page.tsx` (root page). The layout uses `style jsx` for scoped styles; follow the same pattern for small, localized component styles.

**Integration notes**
- Dependencies: `next@16`, `react@19`, `react-dom@19` — target compatible APIs for server/client components.
- PostCSS/Tailwind are installed as devDependencies; confirm `postcss.config.mjs` and any `tailwind.config.js` before adding utilities.

**What to avoid / watch for**
- Don't assume files under `app/` are client-side. Adding DOM or hook code to a server component requires converting it to a client component using `"use client"`.
- Avoid changing Next.js defaults in `next.config.ts` without checking compatibility with the `app/` router and deploy targets.

**If you need more context**
- Point me at places you expect automation or specific agent behavior (tests, end-to-end checks, CI). I can extend these instructions with PR conventions, CI steps, or example code changes.

---
_Generated guidance: concise, actionable, and focused on discoverable patterns in this repository._
