# KICKS.

A sneaker storefront ("Built For What's Next"): browse 14 sneakers, search and filter, sign in, save a wishlist, fill a bag, apply a promo code and place an order that is saved to your account. React 19 + Vite + Tailwind v4 on the front end; Supabase (Postgres + Auth) for accounts, the saved wishlist and orders; deployable to Vercel. Payment is **simulated**: no card details are collected. It started in Google AI Studio and is now developed with Claude Code.

## Requirements

- Node.js `^20.19.0 || >=22.12.0` (Vite 8 requirement; developed on Node 24.12, npm 11)
- npm

## Install

```bash
npm install
```

## Environment variables

Copy `.env.example` to `.env.local` (git-ignored). `GEMINI_API_KEY` and `APP_URL` in that file are leftover AI Studio scaffolding that no code reads (D-009). Never put a secret in a `VITE_` variable: it ends up in the public bundle. The Supabase anon key is public by design and is safe only because row-level security is on.

| Name | Required | Example | What it is |
|---|---|---|---|
| `VITE_SUPABASE_URL` | for sign-in, wishlist and checkout | `https://abcd1234.supabase.co` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | for sign-in, wishlist and checkout | `eyJ...` or `sb_publishable_...` | Public anon / publishable key (never the `service_role` key) |

Without them the store still browses; sign-in, checkout and the account page say Supabase is not configured.

## Run

```bash
npm run dev       # http://localhost:3000 (may take a few seconds to start)
npm run build     # production build into dist/
npm run preview   # serve dist/ locally
```

Routes use the URL hash: `#shop`, `#collections`, `#collections/running`, `#about`, `#contact`, `#account`.

## Database and accounts (Supabase)

1. Create a project at supabase.com. Put its URL and anon / publishable key (Project Settings → API) in `.env.local`.
2. Paste `supabase/schema.sql` into Dashboard → SQL Editor and run it (safe to re-run). It creates the tables, row-level security policies and the `place_order` function.
3. Auth → URL Configuration: set Site URL to `http://localhost:3000` and add it to Redirect URLs. Auth → Providers → Email: keep "Confirm email" on for production; turn it off while testing locally if you don't want to click email links.

If you change a price, promo code or cart rule in `src/`, change `supabase/schema.sql` too and re-run it; `npx tsx --test src/utils/*.test.ts` fails when they drift.

## Deploy to Vercel

1. Push the repo to GitHub and import it in Vercel. The Vite preset is detected automatically (build `npm run build`, output `dist`). `vercel.json` only adds security headers; hash routing needs no rewrites.
2. Project Settings → Environment Variables: add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for Production and Preview, then deploy. Vite inlines them at build time, so changing them needs a redeploy.
3. In Supabase Auth → URL Configuration set Site URL to your production URL and add it, plus a wildcard for preview URLs (for example `https://*-your-team.vercel.app/**`), to Redirect URLs. Otherwise email-confirmation and password-reset links won't return to the site.
4. Commit `package-lock.json` so installs are reproducible.

## Test

```bash
npm run lint                           # tsc --noEmit (the only static check)
npx tsx --test src/utils/*.test.ts     # 18 unit tests (npm test after T-002)
```

Today there are no component or browser tests.

## Project docs

- [AGENTS.md](AGENTS.md): rules for coding agents (read first)
- [docs/PRD.md](docs/PRD.md): what we build, scope, open questions
- [docs/CONTEXT.md](docs/CONTEXT.md): one-page briefing and glossary
- [docs/PROJECT_PLAN.md](docs/PROJECT_PLAN.md): milestones, risks, definition of done
- [docs/TASKS.md](docs/TASKS.md): the build order
- [docs/PROGRESS.md](docs/PROGRESS.md): where we stopped
- [docs/TECH_STACK.md](docs/TECH_STACK.md): exact tools and versions
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): how the parts fit
- [docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md): data model (in-code data plus the Supabase tables)
- [docs/API_SPEC.md](docs/API_SPEC.md): function contracts (the only server call is the `place_order` RPC, see DATABASE_SCHEMA)
- [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md): tokens, type, motion, screens
- [docs/CODING_STANDARDS.md](docs/CODING_STANDARDS.md): code and commit rules
- [docs/TESTING.md](docs/TESTING.md): test strategy, flows, results, open bugs
- [docs/SECURITY.md](docs/SECURITY.md): security rules
- [docs/DECISIONS.md](docs/DECISIONS.md): why things are the way they are
- [CHANGELOG.md](CHANGELOG.md): what changed
