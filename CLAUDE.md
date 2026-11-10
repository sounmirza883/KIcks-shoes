@AGENTS.md

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository. The shared rules, skills table and task loop are in `AGENTS.md` (imported above); the notes below are the Claude-specific and code-level details.

## Claude Code only
- Skills are in `~/.claude/skills/` (global; none in the project yet). Invoke them by name, e.g. `/premium-ui-expert-v1`, `/tester-expert-v1`.
- Never use a git worktree: don't call `EnterWorktree`, don't start agents or sessions with worktree isolation, and don't run `git worktree add`. For isolated changes, use a normal git branch in this checkout (`git switch -c <name>`) instead.
- Use the task list for multi-step work, and tick docs/TASKS.md when a task is done.
- Bug ids (B-xx) are in docs/TESTING.md → Results; several gotchas below are tracked there with a fixing task.

## Commands

`node_modules` is not committed. Plain `npm install` works (the stale `esbuild ^0.25` pin that caused ERESOLVE was removed). Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`; without them the store still browses, but sign-in, checkout and the account page say Supabase is not configured. The dev server can take a few seconds to start listening.

```bash
npm run dev      # Next.js dev server (Turbopack) on http://localhost:3000
npm run build    # next build -> .next/ (every current route prerenders as static HTML)
npm start        # serve the production build
npm run lint     # tsc --noEmit (this is the only static check; there is no ESLint)
```

Tests use `node:test` and there is **no `test` script**. Plain `node --test` fails (extensionless imports like `./cart`, and type imports that aren't `import type`), so run them through `tsx` (already a devDependency):

```bash
npx tsx --test src/utils/*.test.ts
npx tsx --test --test-name-pattern="promo code" src/utils/cart.test.ts   # single test
```

Tests only cover `src/utils/` (cart, reviews, store, orders, routes). `orders.test.ts` also reads `supabase/schema.sql` and fails if its seed prices, promo percents or cart constants drift from the TypeScript. There are no component tests.

## Architecture

A Next.js 16 (App Router) + React 19 + Tailwind v4 storefront ("KICKS."). It has no server code of its own: every route is prerendered static HTML and the screens are client components (`'use client'`). Supabase (`src/lib/supabase.ts`) provides auth and a Postgres database for **orders** and the signed-in user's **wishlist**; the cart, catalog, reviews and forms stay client-only and payment is simulated (no card capture). It deploys to Vercel with the Next.js preset. It was generated in Google AI Studio with Vite and moved to Next.js in D-014; the AI Studio scaffolding is gone.

**Shared state lives in `src/components/StoreProvider.tsx`**, a client context provider in the root layout that screens read with `useStore()`: cart items, wishlist ids, applied promo, open/closed flags for the drawers and modals, the toast, the selected sneaker and the Supabase user. Screens (`src/screens/`, not `src/pages/`: Next reads that as the Pages Router) and sections (`src/components/`) are mostly presentational. `ShopPage` keeps its filters in local state and mirrors them to localStorage; a URL filter wins over the saved ones.

**Routing is the App Router** (`src/app/`): `/`, `/shop`, `/collections`, `/collections/[id]` (lifestyle, running, basketball or casual; anything else is a 404), `/about`, `/contact`, `/account`. `src/utils/routes.ts` holds `PageView`, `hrefFor`, `pageFromPathname` and `parseShopFilters`; the provider's `navigate(page, options)` is `router.push(hrefFor(...))`. Shop pre-filters travel in the query string (`/shop?collectionType=new-in`). Old `/#shop`-style links land on home.

**Drawers and modals are always mounted** by `StoreProvider` and return `null` when closed (`CartDrawer`, `WishlistDrawer`, `ProductDetailModal`, `CheckoutModal`, `AuthModal`). Any `useState` inside them survives close/reopen unless you reset it explicitly.

**Cart math is centralised in `src/utils/cart.ts`** (`calculateCartTotals`, `validatePromoCode`, `formatPrice`): free shipping at $150, $15 flat shipping, 8% tax, and client-side promo codes. Catalog filtering/sorting is `src/utils/store.ts`; review stats and seed reviews are `src/utils/reviews.ts`. Product data is the static `SNEAKERS`, `CATEGORIES` and `HERO_SLIDES` in `src/data/products.ts`, typed by `src/types/index.ts`. A cart line is keyed by sneaker id + size + colour index.

**Supabase** (`supabase/schema.sql`, applied by pasting it into the SQL editor; D-012). `src/lib/supabase.ts` exports the client, which is `null` when the env vars are missing, so every caller must handle that. The anon key is public, so RLS is the backend: clients can only `select` their own `orders`/`order_items` and `insert`/`delete` their own `wishlist_items`. Orders are created only through the `place_order` RPC, which prices the cart on the server from the `products` table (the client sends ids, sizes and quantities, never prices) and is idempotent per `client_request_id`. Auth state (`user`, `authMode`) and the wishlist sync live in `StoreProvider.tsx`; checkout requires sign-in. Never use or expose the `service_role` key.

## Conventions and gotchas

- Imports use explicit `.ts`/`.tsx` extensions (`allowImportingTsExtensions`; Next 16 + Turbopack accept them). The `@` alias resolves to the **repo root**, not `src/`.
- `next dev` and `next build` rewrite `tsconfig.json` and set `"strict": false`. Keep `"strict": true` (it was on before the move and `npm run lint` is clean with it).
- Only `NEXT_PUBLIC_*` variables reach the browser, and they must be read as a literal `process.env.NEXT_PUBLIC_X` (see `src/lib/supabase.ts`) or Next will not inline them. `src/lib/supabase.ts` is also evaluated during prerender, so browser-only reads there need a `typeof window` guard.
- `ShopPage` reads `localStorage` in a `useState` initialiser. That is safe only because `useSearchParams` makes it render client-side under the `<Suspense>` in `app/shop/page.tsx`; if either goes away, move the load into an effect.
- Product images live in `public/images/` and are referenced as `/images/...` strings (`data/products.ts`, `SneakerVisual.tsx`, `ExclusiveDrops.tsx`) so they survive `next build`. Never reference `/src/assets/...`: it only works in the dev server. `SneakerVisual` falls back to inline SVG on image error.
- Tailwind v4 is loaded via `@import "tailwindcss"` in `src/app/globals.css` plus the `@tailwindcss/postcss` plugin (`postcss.config.mjs`). No animation plugin is installed, so `animate-in`, `fade-in`, `slide-in-from-*` and `zoom-in-*` classes used in several components are no-ops. Add `tw-animate-css` or define the keyframes if you need them.
- `supabase/schema.sql` duplicates the catalog prices, promo percents, the $150 / $15 / 8% cart rules and the per-line quantity cap (`MAX_LINE_QUANTITY`, 10). Change both sides together (`orders.test.ts` fails on drift) and re-run the SQL in Supabase. The success screen shows the server's total, so any logic drift is visible rather than silent.
- `SNEAKERS[2]` is assumed to be `jordan-4-retro` in `StoreProvider.tsx` (initial cart) and `screens/HomePage.tsx` (featured banner). Reordering the catalog breaks both.
- Vercel: the Framework Preset must be Next.js (a project created from the old Vite version needs it switched in Settings, with any Output Directory override of `dist` cleared); `vercel.json` only adds security headers. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in the Vercel project (they are inlined at build time, so changing them needs a redeploy), and add the deployed URL (plus a wildcard for preview URLs) to Supabase Auth → URL Configuration, or confirmation and password-reset links will not return to the site.
