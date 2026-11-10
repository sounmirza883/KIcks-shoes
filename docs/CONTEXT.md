# Context — KICKS.

## What we are building

KICKS. is a sneaker e-commerce **front end**: React 19 + Next.js 16 (App Router) + Tailwind v4, TypeScript, no custom server code. It shows 14 sneakers, lets visitors search, filter, save, bag and "check out" (simulated). It was generated in Google AI Studio on Vite, moved to Claude Code, and moved to Next.js on 2026-11-11 (D-014). The job now is to make it correct, accessible, tested and documented, not to add a backend.

## Who it is for

Anonymous sneaker shoppers (demo audience) and the owner, who wants a portfolio-grade storefront. See [PRD.md](PRD.md#target-users).

## Why it matters

A storefront earns trust through correct money maths, a fast clean UI and honest content. The generated code has real defects in all three (wrong checkout discount, missing production images, placeholder "verified" reviews). Fixing them is the first milestone.

## Current status

Setup done 2026-11-10: docs written, nothing built. Baseline: `npm run lint` clean, 12/12 tests pass, `npm run build` succeeds (but the built site has no images). Next: M1, task T-001.

2026-11-11: moved from Vite to Next.js (D-014, branch `Move-to-Next.js`): `npm run lint` clean (strict), 23/23 tests pass, `npm run build` passes and all 12 routes prerender.

## Key constraints

- **Front-end only** (D-001): no backend, database, accounts or real payments. `docs/DATABASE_SCHEMA.md` and `docs/API_SPEC.md` say so.
- **No SEO work** (D-002): the site is a demo. The Next.js move (D-014) gave it real URLs and prerendered HTML as a side effect, but no sitemap, structured data or per-page metadata is planned. There is no `docs/SEO.md` on purpose; revisit if the site must rank (PRD Q-06).
- **Agents:** Claude Code only (plus `AGENTS.md`, which also covers Codex/OpenCode/Kimi).
- **Hosting, budget, deadline, scale, compliance:** not given. Hosted on Vercel (D-013, D-014). Assumed: tiny traffic, no personal data stored (PRD Q-02, Q-08). No payment data is collected, so PCI does not apply while checkout is simulated.
- Install is plain `npm install` (the old `esbuild` pin is gone).
- Vite, `vite.config.ts` and its AI Studio `DISABLE_HMR` toggles no longer exist (D-014).
- Imports use explicit `.ts`/`.tsx` extensions; the `@` alias is the **repo root**, not `src/`.

## Glossary

| Word | Meaning in this project |
|---|---|
| Sneaker | One catalogue product (`Sneaker` in `src/types/index.ts`), e.g. "Nike Dunk Low". |
| Colourway | One colour option of a sneaker (`colors[i]` + `colorwayNames[i]`). |
| Bag / cart | The shopping cart. UI says "bag", code says `cart`. Same thing. |
| Cart line | A `CartItem`: sneaker + size + colour index + quantity. Two lines are the same only if all three match. |
| Wishlist | Saved sneaker ids. No sizes. |
| Category | `Lifestyle`, `Running`, `Basketball`, `Casual` (a sneaker's `category`). |
| Collection | A category page (`/collections/<id>`) **or** a `collectionType` preset: `new-in`, `best-sellers`, `limited-edition`. |
| Drop / limited edition | A sneaker with `isLimitedDrop`; marketed as an exclusive release. |
| Promo code | A client-side discount: `KICKS10`, `NEXTSTEP`, `VIP20`, `DROPS`. |
| Simulation | Checkout and the contact form look real but send nothing. |
