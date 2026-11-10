# Tech stack — KICKS.

Versions are what `node_modules` held on **2026-11-10**, except Next.js, which replaced Vite on **2026-11-11** (D-014); package.json ranges are in brackets. Do not swap or add tools without the owner's OK and a [DECISIONS.md](DECISIONS.md) entry.

## Languages and runtime

| Tool | Version | Why | Alternative rejected |
|---|---|---|---|
| TypeScript | 7.0.2 [`^7.0.2`] | Already used everywhere; `npm run lint` is `tsc --noEmit` | none |
| Node.js | `>=20.19.0` (`engines` in package.json; Next.js 16 itself needs 20.9+); dev machine v24.12.0, npm 11 | Runs Next.js and the tests; no custom server code | none |
| Browser target | ES2022 (tsconfig `target`) | Modern evergreen browsers only | legacy browser support |

## Frameworks and libraries

| Tool | Version | Why | Alternative rejected |
|---|---|---|---|
| React / React DOM | 19.3.1 [`^19.0.1`] | The existing UI | none |
| Next.js | 16.4.6 [`^16.4.6`] | App Router, Turbopack dev server and build, real URL routes (D-014) | Vite with the hand-rolled hash router (D-003, superseded), react-router |
| Tailwind CSS + @tailwindcss/postcss | 4.3.5 | Styling, loaded via `@import "tailwindcss"` in `src/app/globals.css`; plugin set in `postcss.config.mjs` | CSS modules |
| lucide-react | 0.546.0 | The only icon set | other icon packs (no mixed sets) |
| motion | 12.43.0 | **Installed but unused.** The one animation library to use if CSS keyframes are not enough (premium-ui rule: never add a second) | GSAP |
| Routing | Next.js App Router: real paths, one `page.tsx` per route in `src/app/` | D-014 (replaces D-003) | hash router, react-router |
| State | React Context: `StoreProvider` in the root layout, read with `useStore()`; no state library | D-004 as amended by D-014 | Redux, Zustand |

Removed in the Next.js move (D-014, closes D-009 / T-008 / PRD Q-09): Vite and its plugins (`vite`, `@vitejs/plugin-react`, `@tailwindcss/vite`, `autoprefixer`, `vite.config.ts` with its `DISABLE_HMR` toggles, `index.html`) and the unused AI Studio scaffolding (`@google/genai`, `express`, `dotenv`, `@types/express`, `metadata.json`, the `clean` script, the `esbuild` pin). `.env.example` now lists only the two `NEXT_PUBLIC_SUPABASE_*` values.

## Database

None. Catalogue, categories and hero slides are static TypeScript in `src/data/products.ts`. Browser `localStorage` holds one key: `kicks_store_filters`. See [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md).

## Hosting and services

- Hosting: **Vercel** (D-013) with the Next.js framework preset (D-014). Every current route is prerendered as static HTML; `vercel.json` only adds security headers.
- Fonts: Google Fonts (Outfit, Plus Jakarta Sans, Space Mono) loaded by `<link>` tags in `src/app/layout.tsx` (not `next/font`).
- Newsletter background image is hot-linked from `images.unsplash.com` (to replace, T-006).
- No analytics, no payment provider, no email service, no API keys.

## Tooling

| Purpose | Command | Notes |
|---|---|---|
| Install | `npm install` | plain install works (the old `esbuild` pin is gone) |
| Dev server | `npm run dev` | `next dev` (Turbopack), http://localhost:3000 |
| Type check ("lint") | `npm run lint` | `tsc --noEmit` with `strict: true`; there is no ESLint (`eslint-config-next` conflicts with the TypeScript 7 peers) or Prettier |
| Unit tests | `npx tsx --test src/utils/*.test.ts` | `node:test` through `tsx` 4.23; 23 tests; a `test` script is task T-002 |
| Build / start | `npm run build`, `npm start` | `next build` writes `.next/` (git-ignored); there is no `preview` script |
| E2E (planned) | Playwright | backlog T-021, needs owner OK (D-008) |

## Versions policy

- Commit `package-lock.json` (it is tracked; the Next.js move regenerated it).
- One major upgrade per task, with lint + tests + build green before and after.
- The `package.json` ranges stay as they are until a task changes them.
- The owner, or an agent with the owner's OK, upgrades. Record the reason in DECISIONS.md.
