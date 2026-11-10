# Testing — KICKS.

> First draft by setup-expert-v1. Owner: tester-expert-v1 (the Test Handoff section is normally written by backend-expert-v1; there is no backend, see below).

## Strategy

Risk first (tester-expert-v1): **money** (cart totals, promo, shipping, tax), **trust** (placeholder "verified" content, privacy of the checkout form), **state** (a modal reopening on the old success screen, double submit), then looks and accessibility. Business rules live in pure functions in `src/utils/` so most of them are unit-testable without a browser. Browser-level flows need Playwright, which needs the owner's OK (D-008). Never weaken or delete a test to make it pass.

## Tools and commands

| What | Command | Status |
|---|---|---|
| Static check | `npm run lint` (`tsc --noEmit`) | works |
| Unit tests | `npx tsx --test src/utils/*.test.ts` | works (18 tests); `npm test` after T-002 |
| One test | `npx tsx --test --test-name-pattern="promo code" src/utils/cart.test.ts` | works |
| Production build | `npm run build`, then `npm run preview` | build works; `dist/images` has the 5 product photos |
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

The server side is Supabase (D-012): two roles (anonymous, signed-in user), one RPC and three RLS-protected tables. Sign-up, sign-in and password reset are Supabase Auth's own. The cases below need a Supabase **test** project with `supabase/schema.sql` applied and two throwaway users; the unit tests cannot cover them, and none of them has been run yet.

### Endpoints
| Call | Auth | Owner check | Limit | Valid → expected | Invalid → expected |
|---|---|---|---|---|---|
| RPC `place_order` | signed-in | `auth.uid()` | 20 orders per user per hour | one order with lines; returns `{order_number, total}` | `invalid_items`, `invalid_promo`, `invalid_payment`, `rate_limited`, `not_authenticated` |
| `select` on `orders` with `order_items` | signed-in | RLS: own rows | `limit(25)` in the client | own orders, newest first | signed-out: empty |
| `select` / `insert` / `delete` on `wishlist_items` | signed-in | RLS: own rows | primary key + foreign key cap it at 14 rows per user | list / add / remove | duplicate: `23505`; unknown `sneaker_id`: foreign-key error |

### Authorization and abuse cases
| Case | Expected |
|---|---|
| Signed-out `select` on `orders` | empty |
| User B reads user A's orders | empty |
| Direct `insert` / `update` / `delete` on `orders` or `order_items` | permission denied |
| User B `select` / `delete` on user A's wishlist rows | empty / no rows affected |
| `insert` into `wishlist_items` with another user's `user_id` | RLS violation |
| `select` on `products` or `promo_codes` | permission denied |
| `place_order` as anonymous | permission denied |
| `place_order` with a forged price in the payload | ignored; the server price is used |
| Same `request_id` twice | one order, same response |
| Unknown promo, unknown `sneaker_id`, quantity 0 or 11, 51 lines | rejected |
| 21st order within an hour | `rate_limited` |
| Order of $150 or more | free shipping; server total equals `calculateCartTotals` for the same cart and promo |
| Password-reset and confirmation links | return to the deployed site and open the right form (needs Supabase Redirect URLs set) |

### Client-side handoff
The client-side handoff is:

### Functions and cases to test
| Function | Cases that must have a test |
|---|---|
| `calculateCartTotals` | empty bag; exactly $150.00 (free shipping); $149.99 (paid shipping); each promo percent; discount rounding to cents; quantity > 1; discount that crosses the shipping threshold |
| `validatePromoCode` | each valid code; lower-case; leading/trailing spaces; empty; unknown |
| `filterAndSortSneakers` | empty result; min/max price bounds; size not offered; combined filters; each sort; search by name, brand, category, description |
| `calculateReviewStats` | empty; rounding; star distribution adds to 100% (± rounding) |
| Catalogue data | unique ids; `price > 0`; `colors` and `colorwayNames` same length; every hero, cart and featured id exists in `SNEAKERS`; hero prices match the catalogue (B-06) |

### Data integrity cases
- Two clicks on "Place order" create **one** order and one bag clear: the button locks while the request runs, and the server also dedupes on the per-checkout `client_request_id` (B-02).
- Adding the same sneaker with the same size and colour increments quantity; a different size or colour creates a new line.
- Quantity set to 0 removes the line.

### Environments and test data
Local dev server (`npm run dev`, http://localhost:3000) and `npm run preview`. A Supabase test project (its URL and anon key in `.env.local`) with `supabase/schema.sql` applied; create two throwaway users to test isolation. Never test against a production project's real users, and never load-test Google Fonts, Unsplash or Supabase's shared infrastructure.

## Load targets

**Not applicable for now.** The site is static files on Vercel's CDN; the only server work is Supabase (managed, limits set by the project plan), and `place_order` is capped at 20 orders per user per hour. No capacity estimate was made. Performance is measured with Lighthouse on the built preview (PRD target: mobile performance ≥ 90, T-023). Load tests, if ever needed (for a deployed host), run only after the owner approves the exact target and window, never against production or third parties.

## Results

Latest run **2026-11-11** (after the Supabase and Vercel work; no browser or Supabase checks run yet):

| Check | Result |
|---|---|
| `npm run lint` | pass, 0 errors |
| `npx tsx --test src/utils/*.test.ts` | 18 pass, 0 fail (cart 6, reviews 2, store 4, orders 6) |
| `npm run build` | pass; `dist/images` has the 5 product photos and no `/src/assets` string remains |
| E2E, load, UI audit, security scan | not run yet |

Open bugs, found by reading the code and a scripted check, **not yet reproduced with a test**:

| ID | Sev | Area | Title | Status |
|---|---|---|---|---|
| B-01 | S2 | Checkout | `App.tsx` passes `appliedPromo ? 10 : 0` to checkout; bag uses the real percent, so NEXTSTEP (15%) and VIP20 (20%) are charged 10% | fixed in code 2026-11-11 (App passes `validatePromoCode(...).discountPercent`; the server recomputes); browser check pending |
| B-03 | S2 | Privacy | Checkout form pre-filled with the owner's real name and email; already in git history | fixed in code 2026-11-11 (empty fields, email prefilled from the account); history untouched |
| B-04 | S2 | Build | Product images use `/src/assets/...` strings; verified: the production build contains no images | fixed 2026-11-11 (images in `public/images`; build verified); the Unsplash hot-links remain (B-12) |
| B-02 | S3 | Checkout | `step` never resets, reopening shows the old success screen | fixed in code 2026-11-11 (resets on open; submit locks); browser check pending |
| B-05 | S3 | Data | `SNEAKERS[2]` assumed to be `jordan-4-retro` in two places | open, T-005 |
| B-06 | S3 | Data | Hero slide price (Jordan 4: $189.99) differs from the catalogue ($199.99) | open, T-005 |
| B-07 | S3 | Navigation | Footer social links are `#instagram`, `#tiktok`, ...; the router treats them as unknown routes and shows Home | open, T-007 |
| B-08 | S3 | Tooling | Plain `npm install` fails with ERESOLVE (`esbuild ^0.25` vs Vite 8) | fixed 2026-11-11 (pin removed; plain `npm install` verified) |
| B-10 | S3 | A11y | Muted text below 4.5:1 (`text-neutral-400` ×52, `text-neutral-500` ×44) | open, T-011 |
| B-11 | S3 | A11y | No `role="dialog"`/`aria-modal`, no Esc handling, no `htmlFor` labels, no reduced-motion rule (0 matches each) | open, T-013 |
| B-12 | S3 | Privacy | Newsletter consent pre-ticked; 7 Unsplash hot-links | open, T-014, T-006 |
| B-13 | S3 | Content | Placeholder trust claims: "10K+ Happy Customers" with stock avatars, "verified purchase" seed reviews, guarantees, 555 phone numbers | open, T-014 |
| B-09 | S4 | Motion | `animate-in` and related classes do nothing | open, T-012 |
