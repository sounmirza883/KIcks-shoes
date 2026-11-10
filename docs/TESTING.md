# Testing — KICKS.

> First draft by setup-expert-v1. Owner: tester-expert-v1 (the Test Handoff section is normally written by backend-expert-v1; there is no backend, see below).

## Strategy

Risk first (tester-expert-v1): **money** (cart totals, promo, shipping, tax), **trust** (placeholder "verified" content, privacy of the checkout form), **state** (a modal reopening on the old success screen, double submit), then looks and accessibility. Business rules live in pure functions in `src/utils/` so most of them are unit-testable without a browser. Browser-level flows need Playwright, which needs the owner's OK (D-008). Never weaken or delete a test to make it pass.

## Tools and commands

| What | Command | Status |
|---|---|---|
| Static check | `npm run lint` (`tsc --noEmit`) | works |
| Unit tests | `npx tsx --test src/utils/*.test.ts` | works (12 tests); `npm test` after T-002 |
| One test | `npx tsx --test --test-name-pattern="promo code" src/utils/cart.test.ts` | works |
| Production build | `npm run build`, then `npm run preview` | build works; images missing (B-04) |
| UI audit | `node <skills-dir>/premium-ui-expert-v1/scripts/ui-audit.mjs src` | T-015 |
| Contrast | `node <skills-dir>/premium-ui-expert-v1/scripts/contrast-check.mjs src/index.css` | after T-010 |
| Secrets/calls scan | `node <skills-dir>/backend-expert-v1/scripts/security-scan.mjs .` and `call-map.mjs .` | T-009 |
| E2E | `npx playwright test` | not installed; T-021 (needs OK) |

`<skills-dir>` is `~/.claude/skills` (global install, D-007). Tests sit next to the code (`cart.ts` and `cart.test.ts`). There are no component tests.

## Critical flows

Ranked by what hurts most if broken. IDs are used by T-021 and T-022.

| ID | Flow | Must hold |
|---|---|---|
| C-1 | **Buy:** open a product, pick size and colour, add to bag, open bag, apply promo, check out, see success, bag empties | Checkout total equals the bag total; one order number per submit; reopening checkout shows the form, not the old success screen (B-01, B-02) |
| C-2 | **Promo and shipping:** `KICKS10`, `NEXTSTEP`, `VIP20`, `DROPS`; invalid, lower-case, padded codes; newsletter unlocks `KICKS10`; remove promo; $149.99 vs $150 shipping edge | Percent comes from `validatePromoCode` only; threshold uses the pre-discount subtotal |
| C-3 | **Find:** search, category, brand, size, price range, sort, presets, collection pages; filters survive reload; corrupt saved filters do not crash | No empty-state crash; `kicks_store_filters` tampering is ignored |
| C-4 | **Save:** wishlist toggle from card and modal, move to bag, counts in header | Counts and lists stay in sync; a line is sneaker + size + colour |
| C-5 | **Contact form:** required fields, ticket id, reset | No data sent anywhere; errors tell the visitor what to fix |

Break-it list for T-022 (from the tester playbook, adapted to a client-only app): double-click add-to-bag and place-order, rapid quantity changes, quantity to 0 and negative, back/refresh/hash change mid-checkout, two tabs, very long text in forms, emoji in names, 320 px and 1920 px viewports, keyboard-only checkout, reduced-motion on.

## Test Handoff

No backend, so there are **no endpoints, roles, rate limits or authorization matrix to hand off**: one anonymous role, nothing server-side (see [SECURITY.md](SECURITY.md#authorization-matrix)). The client-side handoff is:

### Functions and cases to test
| Function | Cases that must have a test |
|---|---|
| `calculateCartTotals` | empty bag; exactly $150.00 (free shipping); $149.99 (paid shipping); each promo percent; discount rounding to cents; quantity > 1; discount that crosses the shipping threshold |
| `validatePromoCode` | each valid code; lower-case; leading/trailing spaces; empty; unknown |
| `filterAndSortSneakers` | empty result; min/max price bounds; size not offered; combined filters; each sort; search by name, brand, category, description |
| `calculateReviewStats` | empty; rounding; star distribution adds to 100% (± rounding) |
| Catalogue data | unique ids; `price > 0`; `colors` and `colorwayNames` same length; every hero, cart and featured id exists in `SNEAKERS`; hero prices match the catalogue (B-06) |

### Data integrity cases
- Two clicks on "Place order" create **one** order and one bag clear (B-02/T-004).
- Adding the same sneaker with the same size and colour increments quantity; a different size or colour creates a new line.
- Quantity set to 0 removes the line.

### Environments and test data
Local dev server (`npm run dev`, http://localhost:3000) and `npm run preview`. No accounts, no seed script, no third-party sandbox. Never load-test Google Fonts or Unsplash.

## Load targets

**Not applicable.** The site is static files; there is no server to load-test and no backend capacity estimate. Performance is measured with Lighthouse on the built preview (PRD target: mobile performance ≥ 90, T-023). Load tests, if ever needed (for a deployed host), run only after the owner approves the exact target and window, never against production or third parties.

## Results

Latest run **2026-11-10** (setup baseline, nothing changed in code):

| Check | Result |
|---|---|
| `npm run lint` | pass, 0 errors |
| `npx tsx --test src/utils/*.test.ts` | 12 pass, 0 fail (cart 6, reviews 2, store 4) |
| `npm run build` | pass; `dist/` has no product images (B-04) |
| E2E, load, UI audit, security scan | not run yet |

Open bugs, found by reading the code and a scripted check, **not yet reproduced with a test**:

| ID | Sev | Area | Title | Status |
|---|---|---|---|---|
| B-01 | S2 | Checkout | `App.tsx` passes `appliedPromo ? 10 : 0` to checkout; bag uses the real percent, so NEXTSTEP (15%) and VIP20 (20%) are charged 10% | open, T-003 |
| B-03 | S2 | Privacy | Checkout form pre-filled with the owner's real name and email; already in git history | open, T-004 |
| B-04 | S2 | Build | Product images use `/src/assets/...` strings; verified: the production build contains no images | open, T-006 |
| B-02 | S3 | Checkout | `step` never resets, reopening shows the old success screen | open, T-004 |
| B-05 | S3 | Data | `SNEAKERS[2]` assumed to be `jordan-4-retro` in two places | open, T-005 |
| B-06 | S3 | Data | Hero slide price (Jordan 4: $189.99) differs from the catalogue ($199.99) | open, T-005 |
| B-07 | S3 | Navigation | Footer social links are `#instagram`, `#tiktok`, ...; the router treats them as unknown routes and shows Home | open, T-007 |
| B-08 | S3 | Tooling | Plain `npm install` fails with ERESOLVE (`esbuild ^0.25` vs Vite 8) | open, T-008 |
| B-10 | S3 | A11y | Muted text below 4.5:1 (`text-neutral-400` ×52, `text-neutral-500` ×44) | open, T-011 |
| B-11 | S3 | A11y | No `role="dialog"`/`aria-modal`, no Esc handling, no `htmlFor` labels, no reduced-motion rule (0 matches each) | open, T-013 |
| B-12 | S3 | Privacy | Newsletter consent pre-ticked; 7 Unsplash hot-links | open, T-014, T-006 |
| B-13 | S3 | Content | Placeholder trust claims: "10K+ Happy Customers" with stock avatars, "verified purchase" seed reviews, guarantees, 555 phone numbers | open, T-014 |
| B-09 | S4 | Motion | `animate-in` and related classes do nothing | open, T-012 |
