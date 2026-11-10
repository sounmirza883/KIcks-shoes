# PRD — KICKS.

> No PRD existed. This one was **derived from the code on 2026-11-10** (not written by the owner) plus three answers from the owner: front-end only, no SEO for now, Claude Code only. Anything the code could not tell us is an Open question below. Review and correct this file first: every other doc builds on it.

## Goal

KICKS. ("Built For What's Next") is a sneaker storefront: visitors browse a catalogue of 14 sneakers, filter and search it, save favourites, fill a bag, apply a promo code and walk through a **simulated** checkout. It is a React + Next.js front end with no custom server code (D-014); accounts, the saved wishlist and orders use Supabase (D-012). The goal of the current phase is a polished, correct, tested front-end storefront that can be shown as a demo or portfolio piece.

## Target users

| User | Need |
|---|---|
| Sneaker shopper (visitor) | Find a pair by brand, category, size or price; see colourways and reviews; trust the price and shipping total. |
| Owner / developer | A clean, tested, documented codebase that coding agents can extend without breaking the cart maths. |

No staff, admin or account roles exist. Everyone is an anonymous visitor.

## Must-have features

These already exist in the code. "Must-have" means: they must keep working and be tested.

| ID | Feature | Where it lives |
|---|---|---|
| F-01 | **Home page**: hero carousel (3 slides), featured product, best sellers, new arrivals, exclusive drops, collections, culture and quality banners, "why choose us". | `screens/HomePage.tsx`, `components/Hero.tsx` and the section components |
| F-02 | **Shop**: text search; filter by category, brand, size, price range; sort (featured, price up/down, rating, newest); preset views new-in / best-sellers / limited-edition. Filters are remembered in `localStorage` (`kicks_store_filters`) and can be preset by a link (`/shop?collectionType=new-in`). | `screens/ShopPage.tsx`, `utils/store.ts`, `utils/routes.ts` |
| F-03 | **Collections**: one page per category (`lifestyle`, `running`, `basketball`, `casual`) plus "all". | `screens/CollectionsPage.tsx` |
| F-04 | **Product detail**: colourway swatches, size picker, details, customer reviews (stats, "helpful" vote, write a review), add to bag, wishlist. | `components/ProductDetailModal.tsx`, `utils/reviews.ts` |
| F-05 | **Bag**: change quantity, remove, free-shipping progress, promo code, totals (subtotal, discount, shipping, tax, total). A line is sneaker + size + colour. | `components/CartDrawer.tsx`, `utils/cart.ts` |
| F-06 | **Wishlist**: save, remove, move to bag. | `components/WishlistDrawer.tsx` |
| F-07 | **Checkout (simulation)**: contact and address form, card or cash-on-delivery choice, order number, success screen, bag cleared. No payment is taken and nothing is sent anywhere. | `components/CheckoutModal.tsx` |
| F-08 | **Newsletter promo**: entering an email unlocks promo code `KICKS10` in the bag. The email is not stored. | `components/DiscountNewsletter.tsx` |
| F-09 | **About and Contact pages**: brand story; contact form that returns a fake ticket id; FAQ; store locations. | `screens/AboutPage.tsx`, `screens/ContactPage.tsx` |
| F-10 | **Navigation**: header menu and live search box, footer links, real URL routes (`/shop`, `/collections/<id>`, `/about`, `/contact`, `/account`), toast messages. | `components/StoreProvider.tsx`, `utils/routes.ts`, `components/Header.tsx`, `components/Footer.tsx` |

Business rules that exist today (treat as requirements until the owner changes them, see Q-05): free shipping at a $150 subtotal, otherwise $15 flat; tax 8% of the discounted subtotal; promo codes `KICKS10` 10%, `NEXTSTEP` 15%, `VIP20` 20%, `DROPS` 10%; prices in USD.

## Nice-to-have

Proposed by setup, **not confirmed by the owner**. Nothing here is built until the owner says yes (all sit in the TASKS.md backlog).

- N-01 Keep the bag and wishlist across page reloads (`localStorage`). Today a refresh resets both (Q-07).
- N-02 End-to-end browser tests for the five critical flows (Playwright).
- N-03 Real hosting with a preview URL (Vercel, Q-02).

## Out of scope

Agents must **not** build these unless this section is changed first:

- Any backend, database, API, user accounts, login, order history or admin area (decision D-001).
- Real payments, real card fields, real emails, real shipping or tax rates.
- SEO work: sitemap, structured data, per-page metadata, ranking (decision D-002, Q-06). The Next.js move (D-014) brought real URLs and prerendered HTML, but that is not an SEO effort.
- AI features. No AI dependency remains (the unused `@google/genai` scaffolding was removed, D-014).
- Translations, multiple currencies, a CMS.
- Adding a state library or a second router: shared state stays in `StoreProvider` and routing in the Next.js App Router (decisions D-004, D-014).

## Success metrics

Measurable, and proposed by setup (the owner gave none: Q-08):

| Metric | Target | How checked |
|---|---|---|
| Static checks | `npm run lint` has 0 errors | command |
| Unit tests | all pass; every rule in `utils/cart.ts` covered (shipping, tax, 4 promo codes, empty bag) | `npx tsx --test src/utils/*.test.ts` |
| Money consistency | bag total equals checkout total for every promo code | unit test + E2E |
| Production build | `npm run build` then `npm start`: every product image loads, 0 failed requests, 0 console errors | browser devtools |
| Responsiveness | no horizontal scroll at 320, 375, 768, 1440 px | `ui-audit.mjs` + browser |
| Accessibility | all text/background token pairs ≥ 4.5:1; drawers and modals keyboard-operable | `contrast-check.mjs` + manual |
| Performance | Lighthouse performance ≥ 90 on the home page (mobile) | Lighthouse |

## Open questions

Each has a default that the docs already follow. Answer any of them and the docs get updated.

> **Q-01** Is this a demo/portfolio, or a store that will sell real shoes? **Default:** demo, front-end only (D-001). Real sales would add a backend, payments and legal pages: a new PRD revision.
> **Q-02** Where will it be hosted and on which domain? **Default:** Vercel (D-013, D-014). A plain static file host would need `output: 'export'` in a `next.config`, which is not set up.
> **Q-03** Is the current look (black/white, Outfit + Plus Jakarta Sans + Space Mono, "KICKS." wordmark) the final brand, and is there a real logo? **Default:** keep as is (see DESIGN_SYSTEM.md).
> **Q-04** The UI makes claims: "Authenticity Guarantee", "30-Day returns", "free returns", reviews marked "verified purchase", five store addresses with 555 phone numbers. Are these real? **Default:** treat all as placeholder content and label it as sample (task T-014); no real customer data exists.
> **Q-05** Are the shipping, tax and promo rules above the intended business rules? **Default:** yes, unchanged.
> **Q-06** Must the site rank on Google? **Answered 2026-11-10: no, skip for now.** If this becomes a real store, add SEO.md and real URLs (D-002).
> **Q-07** Should the bag and wishlist survive a reload, and should the bag start empty? Today the bag starts with a Jordan 4 Retro and the wishlist with two pairs ("preview" data). **Default:** keep as is until answered; backlog task T-030.
> **Q-08** What does "done" mean for this phase (deadline, success numbers)? **Default:** the metrics above.
> **Q-09** May the unused AI Studio scaffolding be removed (`@google/genai`, `express`, `dotenv`, `@types/express`, `metadata.json`, the Gemini lines in `.env.example`) and the broken `esbuild` pin fixed? **Answered 2026-11-11: yes, done in the move to Next.js (D-014, closes T-008).**
