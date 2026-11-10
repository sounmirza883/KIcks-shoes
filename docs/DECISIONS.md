# Decisions

Each entry: `## D-001 <title>` with Date, Status, Context, Decision, Consequences. Never delete; supersede.

## D-001 Front-end only, no backend
- Date: 2026-11-10
- Status: **superseded by D-012** (2026-11-11)
- Context: no PRD; the code is a client-only storefront with simulated checkout.
- Decision: keep it front-end only. No server, database, accounts or real payments.
- Consequences: DATABASE_SCHEMA.md, API_SPEC.md and most of SECURITY.md say "none, because...". A real store would need a new PRD revision, a backend and a payment provider (PRD Q-01).

## D-002 No SEO work for now
- Date: 2026-11-10
- Status: accepted (owner answer)
- Context: the site is a demo; it uses `#hash` routes and client rendering, so search engines cannot index inner pages.
- Decision: skip `docs/SEO.md` and `seo-expert-v1` tasks.
- Consequences: do not spend effort on sitemap or structured data. Revisit if the site must rank: it then needs real URLs plus pre-rendering (replaces D-003).

## D-003 Keep the hand-rolled hash router
- Date: 2026-11-10
- Status: accepted (existing design, kept)
- Context: `App.tsx` maps `location.hash` to five pages. It works on any static host with no rewrite rules.
- Decision: no router library.
- Consequences: filters for Shop travel in React state, not the URL. Footer links must not use bare `#word` anchors, because they are parsed as routes (B-07).

## D-004 All app state stays in `App.tsx`
- Date: 2026-11-10
- Status: accepted (existing design, kept)
- Context: the app is small; state is passed down as props.
- Decision: no state library, no React Context. `ShopPage` keeps its own filters (mirrored to `localStorage`).
- Consequences: drawers and modals are always mounted and keep their `useState` across close/reopen, so they must reset themselves explicitly (B-02).

## D-005 Tests use `node:test` through `tsx`, only for `src/utils/`
- Date: 2026-11-10
- Status: accepted (existing practice)
- Context: no test framework is installed; plain `node --test` cannot resolve the imports.
- Decision: keep `npx tsx --test src/utils/*.test.ts`; add a `test` script (T-002). Business rules live in `utils/` so they stay unit-testable.
- Consequences: no component tests until E2E is approved (D-008).

## D-006 Agent files: Claude Code plus `AGENTS.md` only
- Date: 2026-11-10
- Status: accepted (owner answer)
- Context: the owner uses Claude Code.
- Decision: write `AGENTS.md` and `CLAUDE.md` (imports it). No Cursor, Copilot or Gemini files.
- Consequences: add them later by re-running setup with `--agents`.

## D-007 Skills are used from the global install
- Date: 2026-11-10
- Status: accepted
- Context: the five `*-expert-v1` skills are installed in `~/.claude/skills/`; the project has no `.claude/skills/`.
- Decision: AGENTS.md points to the global path. Copy the folders into `.claude/skills/` if the skill versions must be pinned for a team or CI.
- Consequences: `setup-docs.mjs check` only sees project-level skills, so it will not list them until they are copied in.

## D-008 Playwright for end-to-end tests (when approved)
- Date: 2026-11-10
- Status: proposed (needs the owner's OK before any dependency is added)
- Context: tester-expert-v1 says add Playwright when no E2E tool exists. The checkout flow has no browser-level test.
- Decision: add `@playwright/test` as a devDependency in task T-021.
- Consequences: one new devDependency and a `tests/e2e/` folder.

## D-009 Removing the AI Studio scaffolding
- Date: 2026-11-10
- Status: partly done: the `esbuild` pin was removed on 2026-11-11 (D-013); the rest is still proposed (PRD Q-09)
- Context: `@google/genai`, `express`, `dotenv`, `@types/express`, `.env.example`, `metadata.json` and the `clean` script are unused; the `esbuild ^0.25` pin breaks `npm install`.
- Decision: remove them and the `esbuild` pin in T-008. Keep `vite.config.ts` as is.
- Consequences: no environment variables remain; README says so.

## D-010 Checkout must charge what the bag shows
- Date: 2026-11-10
- Status: accepted (a bug fix, not a business-rule change); done in code 2026-11-11 (`App.tsx` passes `validatePromoCode(appliedPromo).discountPercent`, and the server recomputes the total, D-012)
- Context: `App.tsx` passes `appliedPromo ? 10 : 0` to checkout while the bag uses the real percent from `validatePromoCode` (NEXTSTEP 15%, VIP20 20%).
- Decision: `validatePromoCode` in `utils/cart.ts` is the only source of the discount percent (T-003).
- Consequences: both screens call the same function; a test asserts equal totals.

## D-011 Defaults taken while PRD questions are open
- Date: 2026-11-10
- Status: accepted until the owner answers
- Context: no PRD existed; these questions had no answer (see PRD.md → Open questions).
- Decision: Q-02 any static host; Q-03 keep the current look and wordmark; Q-04 treat reviews, guarantees, customer counts and store addresses as placeholder content; Q-05 keep the shipping, tax and promo rules as coded; Q-07 keep the demo bag and wishlist as they are; Q-08 use the success metrics in the PRD.
- Consequences: tasks T-014 and T-040 depend on the answers; a different answer updates PRD.md, TASKS.md and this entry.

## D-012 Supabase for accounts, wishlist and orders (supersedes D-001)
- Date: 2026-11-11
- Status: accepted (owner request: "add Supabase as a database and auth", covering wishlist, checkout and orders)
- Context: the owner chose email + password sign-in, sign-in required at checkout, orders and the saved wishlist in the database, and the schema delivered as one SQL file.
- Decision: Supabase Auth (email + password) and Postgres tables `orders`, `order_items`, `wishlist_items`, plus server-only `products` and `promo_codes`, all behind row-level security (`supabase/schema.sql`). Orders are created only by the `place_order` RPC (server-side pricing, idempotency key, 20 orders per user per hour). The wishlist is written directly under RLS. The catalogue, cart, reviews, newsletter and contact form stay client-side. Payment stays simulated: no card data is collected.
- Consequences: prices, promo percents and the $150 / $15 / 8% rules are duplicated in `supabase/schema.sql`; `orders.test.ts` fails on drift. Accounts, wishlist and orders are no longer out of scope; real payments, guest checkout, cart sync and admin tools still are. `ARCHITECTURE.md`, `SECURITY.md`, `API_SPEC.md`, `CONTEXT.md`, `TECH_STACK.md`, `PRD.md` and `TASKS.md` still describe the front-end-only design and need a refresh (not done in this change).

## D-013 Host on Vercel as a static Vite build
- Date: 2026-11-11
- Status: accepted (owner request: "make it able to host on vercel")
- Context: Vercel runs `npm install` and `vite build`. Two things broke a deploy: plain `npm install` failed with ERESOLVE (the `esbuild ^0.25` pin, B-08) and product images were `/src/assets/...` strings that a production build does not ship (B-04).
- Decision: remove the `esbuild` pin; set `engines.node` to `>=20.19.0` (Vite 8); move the five photos to `public/images/` and reference them as `/images/...`; add `vercel.json` with `X-Content-Type-Options`, `X-Frame-Options` and `Referrer-Policy` headers only. No rewrites: the hash router needs none. No Content-Security-Policy yet (it needs Supabase and Google Fonts allow-lists).
- Consequences: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` must be set in the Vercel project (build-time), and the deployed URL must be in Supabase Auth → Site URL / Redirect URLs. Resolves B-04 and B-08. The 7 Unsplash hot-links remain (B-12).
