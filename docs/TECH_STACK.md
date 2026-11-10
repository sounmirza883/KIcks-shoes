# Tech stack — KICKS.

Versions are what `node_modules` held on **2026-11-10** (package.json ranges in brackets). Do not swap or add tools without the owner's OK and a [DECISIONS.md](DECISIONS.md) entry.

## Languages and runtime

| Tool | Version | Why | Alternative rejected |
|---|---|---|---|
| TypeScript | 7.0.2 [`^7.0.2`] | Already used everywhere; `npm run lint` is `tsc --noEmit` | none |
| Node.js | `^20.19.0 \|\| >=22.12.0` (Vite 8 engines); dev machine v24.12.0, npm 11 | Runs Vite and the tests; no server code | none |
| Browser target | ES2022 (tsconfig `target`) | Modern evergreen browsers only | legacy browser support |

## Frameworks and libraries

| Tool | Version | Why | Alternative rejected |
|---|---|---|---|
| React / React DOM | 19.3.1 [`^19.0.1`] | The existing UI | none |
| Vite | 8.3.7 [`^8.3.0`] | Dev server and build | CRA, Next.js (no SSR needed, D-002) |
| @vitejs/plugin-react | 6.3.0 | JSX transform | none |
| Tailwind CSS + @tailwindcss/vite | 4.3.5 | Styling, loaded via `@import "tailwindcss"` | CSS modules |
| lucide-react | 0.546.0 | The only icon set | other icon packs (no mixed sets) |
| motion | 12.43.0 | **Installed but unused.** The one animation library to use if CSS keyframes are not enough (premium-ui rule: never add a second) | GSAP |
| Routing | none: hand-rolled over `location.hash` | D-003 | react-router |
| State | `useState` in `App.tsx`, props down | D-004 | Redux, Zustand, Context |

Unused AI Studio scaffolding, to be removed after the owner's OK (T-008, PRD Q-09): `@google/genai`, `express`, `dotenv`, `@types/express`, `.env.example`, `metadata.json`, the `clean` script (`rm -rf dist server.js`). `esbuild ^0.25` is pinned but Vite 8.3 wants `^0.27 || ^0.28`, which breaks plain `npm install`; remove the direct pin.

## Database

None. Catalogue, categories and hero slides are static TypeScript in `src/data/products.ts`. Browser `localStorage` holds one key: `kicks_store_filters`. See [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md).

## Hosting and services

- Hosting: **not chosen** (PRD Q-02). Any static host serving `dist/` works; hash routing needs no rewrite rules.
- Fonts: Google Fonts (Outfit, Plus Jakarta Sans, Space Mono) loaded from `index.html`.
- Newsletter background image is hot-linked from `images.unsplash.com` (to replace, T-006).
- No analytics, no payment provider, no email service, no API keys.

## Tooling

| Purpose | Command | Notes |
|---|---|---|
| Install | `npm install --legacy-peer-deps` | plain `npm install` fails with ERESOLVE until T-008 |
| Dev server | `npm run dev` | http://localhost:3000, host 0.0.0.0 |
| Type check ("lint") | `npm run lint` | `tsc --noEmit`; there is no ESLint or Prettier |
| Unit tests | `npx tsx --test src/utils/*.test.ts` | `node:test` through `tsx` 4.23; a `test` script is task T-002 |
| Build / preview | `npm run build`, `npm run preview` | output in `dist/` (git-ignored) |
| E2E (planned) | Playwright | backlog T-021, needs owner OK (D-008) |

## Versions policy

- Commit `package-lock.json` (T-001; it exists but is untracked today).
- One major upgrade per task, with lint + tests + build green before and after.
- The `package.json` ranges stay as they are until T-008 fixes the `esbuild` pin.
- The owner, or an agent with the owner's OK, upgrades. Record the reason in DECISIONS.md.
