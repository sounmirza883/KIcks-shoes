# API spec — KICKS.

> First draft by setup-expert-v1 from the code. Owner: backend-expert-v1.

**No backend API because the storefront is client-only (D-001): there are no endpoints, no server and no network calls after load.** A new `fetch` call means the PRD changed: update PRD.md and DECISIONS.md first. The only "contract" is the set of pure functions the UI calls, listed here so agents do not change their behaviour by accident.

## Conventions

- Language: TypeScript modules in `src/utils/`; money in USD dollars, rounded to cents.
- Pure functions, no side effects, no I/O. Tested with `node:test` (D-005).

## Auth

None. Every visitor is anonymous. There are no sessions, cookies or tokens.

## Endpoints

| Method | Path | Auth/role | Owner check | Request | Response | Errors | Rate class |
|---|---|---|---|---|---|---|---|
| none | none | none | none | none | none | none | none |

Internal function contracts (the real interface):

| Function | Input | Output | Rules |
|---|---|---|---|
| `calculateCartTotals(items, discountPercent = 0, threshold = 150)` | `CartItem[]`, percent 0-100 | `{ itemCount, subtotal, discountPercent, discountAmount, shippingFee, tax, total, freeShipping* }` | Discount first; tax 8% on the discounted subtotal; shipping $15 unless **undiscounted** subtotal ≥ $150; empty bag = subtotal, shipping, tax and total are 0 |
| `validatePromoCode(raw)` | string | `{ valid, discountPercent, message }` | Trim and upper-case; `KICKS10` 10, `NEXTSTEP` 15, `VIP20` 20, `DROPS` 10; anything else invalid |
| `formatPrice(n)` | number | `"$12.34"` | |
| `filterAndSortSneakers(list, filters)` | `Sneaker[]`, `StoreFilterState` | `Sneaker[]` | Case-insensitive search over name, brand, category, description |
| `calculateReviewStats(reviews)` | `Review[]` | `{ averageRating, totalReviews, distribution[5..1] }` | Empty list gives 5.0 and 0 reviews |

Note: the shipping threshold uses the subtotal **before** the promo discount. If the owner wants it after the discount, that is a business-rule change (PRD Q-05).

## Errors

No HTTP errors exist. User-facing validation messages come from the forms (checkout, contact, newsletter) and from `validatePromoCode`. No stack traces or error details are shown to visitors.

## Rate limits

None: there is no API to limit. Do not add client-side "rate limiting" as security; it is not security.

## Pagination

None. The catalogue has 14 items and is rendered whole. Revisit if it grows past ~100 items.
