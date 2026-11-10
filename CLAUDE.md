# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

`node_modules` is not committed; run `npm install` first.

```bash
npm run dev      # Vite dev server on http://localhost:3000 (host 0.0.0.0)
npm run build    # vite build -> dist/
npm run lint     # tsc --noEmit (this is the only static check; there is no ESLint)
```

Tests use `node:test` and there is **no `test` script**. Plain `node --test` fails (extensionless imports like `./cart`, and type imports that aren't `import type`), so run them through `tsx` (already a devDependency):

```bash
npx tsx --test src/utils/*.test.ts
npx tsx --test --test-name-pattern="promo code" src/utils/cart.test.ts   # single test
```

Tests only cover `src/utils/` (cart, reviews, store). There are no component tests.

## Architecture

A client-only React 19 + Vite + Tailwind v4 storefront ("KICKS."). There is no backend, router library, or persistence layer for cart/wishlist; checkout is a simulation. It was generated in Google AI Studio, so `vite.config.ts` has HMR/watch toggles driven by `DISABLE_HMR` that should be left alone, and `package.json` / `.env.example` / `metadata.json` carry unused AI Studio scaffolding (`@google/genai`, `express`, `dotenv`, `GEMINI_API_KEY`).

**All app state lives in `src/App.tsx`** and flows down as props and callbacks: current page, cart items, wishlist ids, applied promo, open/closed flags for the drawers and modals, and the toast. Pages (`src/pages/`) and sections (`src/components/`) are mostly presentational. `ShopPage` is the exception: it keeps its filters in local state and mirrors them to localStorage.

**Routing is hand-rolled over `window.location.hash`.** `App.tsx` maps the hash to a `PageView` (`home | shop | collections | about | contact`; `collections/<id>` selects a category) and `navigateToPage` writes it back. The `PageView` type is exported from `components/Header.tsx`. Shop pre-filters are passed through `shopFilterOptions` state, not the URL.

**Drawers and modals are always mounted** by `App` and return `null` when closed (`CartDrawer`, `WishlistDrawer`, `ProductDetailModal`, `CheckoutModal`). Any `useState` inside them survives close/reopen unless you reset it explicitly.

**Cart math is centralised in `src/utils/cart.ts`** (`calculateCartTotals`, `validatePromoCode`, `formatPrice`): free shipping at $150, $15 flat shipping, 8% tax, and client-side promo codes. Catalog filtering/sorting is `src/utils/store.ts`; review stats and seed reviews are `src/utils/reviews.ts`. Product data is the static `SNEAKERS`, `CATEGORIES` and `HERO_SLIDES` in `src/data/products.ts`, typed by `src/types/index.ts`. A cart line is keyed by sneaker id + size + colour index.

## Conventions and gotchas

- Imports use explicit `.ts`/`.tsx` extensions (`allowImportingTsExtensions`). The `@` alias resolves to the **repo root**, not `src/`.
- Product images are hardcoded string paths like `/src/assets/images/...` (in `data/products.ts` and `SneakerVisual.tsx`), not imports. They work in the dev server but Vite will not rewrite them in a production build. Use an import or move them to `public/` when touching them. `SneakerVisual` falls back to inline SVG on image error.
- Tailwind v4 is loaded via `@import "tailwindcss"` only. No animation plugin is installed, so `animate-in`, `fade-in`, `slide-in-from-*` and `zoom-in-*` classes used in several components are no-ops. Add `tw-animate-css` or define the keyframes if you need them.
- Checkout currently charges `discountPercent={appliedPromo ? 10 : 0}` (`App.tsx`), while `CartDrawer` shows the real percent from `validatePromoCode`. They disagree for NEXTSTEP (15%) and VIP20 (20%).
- `SNEAKERS[2]` is assumed to be `jordan-4-retro` in `App.tsx` (initial cart) and `HomePage.tsx` (featured banner). Reordering the catalog breaks both.
- `CheckoutModal` never resets its `step`, so after one order it reopens on the old success screen.
