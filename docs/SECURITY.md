# Security — KICKS.

> First draft by setup-expert-v1 from the code. Owner: backend-expert-v1. Every agent follows these rules.

Scope: a static front end with no server, accounts or payments (D-001). The attack surface is the browser: XSS, third-party content, data left in source, and honest handling of anything a visitor types.

## Secrets

- There are **no secrets** in the project. `.env.example` holds AI Studio placeholders (`GEMINI_API_KEY`, `APP_URL`) that nothing reads; it is removed in T-008.
- `.gitignore` already ignores `.env*` except `.env.example`. Keep it that way.
- Anything in a `VITE_`-prefixed variable ends up in the public bundle. Never put a key, token or password in one, or anywhere in `src/`.
- Do not add the `@google/genai` or any API-key-based client to the browser bundle.

## Authentication

None, by design. There is no login, session or token. If accounts are ever added: a new PRD revision, then server-side sessions in `HttpOnly; Secure; SameSite=Lax` cookies and Argon2id password hashes (backend-expert-v1 defaults).

## Authorization matrix

| Action | anonymous visitor |
|---|---|
| Browse, search, filter, read reviews | allowed |
| Bag, wishlist, promo code, simulated checkout | allowed (client state only) |
| Contact form, newsletter | allowed (nothing is sent) |
| Admin or any other role | does not exist |

There are no objects owned by a user, so no owner checks exist. Nothing here is protected by hiding a button.

## Input validation

- Forms: checkout (`required` + `type=email`), contact (required name, email, message), newsletter (contains `@`, consent box), promo code (trimmed and upper-cased in `validatePromoCode`).
- Rendering: React escapes text. A scan found **no** `dangerouslySetInnerHTML`, `innerHTML`, `eval` or `new Function`. Keep it so; a new use needs the owner's OK.
- `localStorage` value `kicks_store_filters` is parsed inside `try/catch` but its **shape is not validated** (a tampered value can put wrong types into the filters). T-022 tests it; fix by validating fields against `StoreFilterState`.
- Never trust `price`, `discountPercent` or totals passed from UI state as security: this app has no server, so a visitor can change anything. If real money is ever involved, totals are recomputed on a server.

## Data protection

- What is stored: only the shop filters, in the visitor's own browser. Checkout, contact and newsletter data stay in component state and are discarded.
- **B-03 (privacy):** `CheckoutModal.tsx` is pre-filled with the owner's real name and email address, and the repo has a public-looking GitHub remote. Removing it from the code (T-004) does not remove it from git history (first seen in commit `2a6bdef`). The owner decides whether to rewrite history; agents must not.
- Never add card-number, expiry or CVV inputs. If real payments are ever added, use the provider's hosted fields or hosted checkout in **test mode** first. The card/cash radio today collects no card data.
- Newsletter consent box is pre-ticked (`agreed` defaults to true): not valid consent under GDPR-style rules. Untick by default (T-014). No email is stored, so no data-protection duty exists until one is.
- Third-party requests: Google Fonts and Unsplash receive each visitor's IP address. Replace Unsplash (T-006); decide on self-hosting fonts (PRD Q-02).
- Compliance (from the PRD): none stated. PCI-DSS does not apply while no card data is handled. Sample content that looks real (reviews, guarantees, store addresses) is an honesty/legal risk (PRD Q-04, T-014).

## Headers and rate limits

Headers are set by the **host**, not the app. Set these at deploy time (T-040), then check them in the browser:

| Header | Value (starting point) |
|---|---|
| Content-Security-Policy | `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; frame-ancestors 'none'` (`'unsafe-inline'` styles are needed for React `style={{}}`; add `https://images.unsplash.com` to `img-src` only if T-006 is not done) |
| X-Content-Type-Options | `nosniff` |
| Referrer-Policy | `strict-origin-when-cross-origin` |
| Strict-Transport-Security | set by the host over HTTPS |

Rate limits: not applicable, there is no API (see [API_SPEC.md](API_SPEC.md#rate-limits)). Dependencies: run `npm audit` before launch and when a dependency changes; the unused `express` and `@google/genai` packages shrink the audit surface once removed (T-008).
