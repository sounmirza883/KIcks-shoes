# Database schema — KICKS.

> First draft by setup-expert-v1 from the code. Owner: backend-expert-v1 (refines it if a backend is ever added).

**Two stores.** The catalogue, categories, hero slides, cart and reviews are in-code data (below). Accounts, orders and the saved wishlist live in Supabase (D-012, which supersedes D-001): Auth plus the tables in [Supabase tables](#supabase-tables), defined in `supabase/schema.sql`. Source of truth for the in-code model: `src/types/index.ts` and `src/data/products.ts`.

## Tables

Static data (TypeScript constants), not tables:

**`Sneaker`** (14 rows in `SNEAKERS`)

| Field | Type | Null | Default | Notes |
|---|---|---|---|---|
| id | string | no | | unique slug, e.g. `jordan-4-retro`; used as wishlist id and in the cart-line key |
| name, brand | string | no | | 7 brands: Nike, Jordan, New Balance, Adidas, Asics, Salomon, Converse |
| category | `'Lifestyle' \| 'Running' \| 'Basketball' \| 'Casual'` | no | | |
| collectionType | `'all' \| 'new-in' \| 'best-sellers' \| 'limited-edition'` | no | | preset views |
| price | number (USD) | no | | $110 to $390 today |
| originalPrice | number | yes | | strike-through price |
| rating, reviewsCount | number | no | | static display values, not computed from reviews |
| image, silhouette | string, union | no | | image path string (B-04); silhouette picks the fallback SVG |
| colors, colorwayNames | string[] | no | | hex swatches; **same length** |
| sizes | number[] | no | | US sizes, e.g. 7 to 13 |
| description, details | string, string[] | no | | |
| isNewArrival, isBestSeller, isLimitedDrop, tag, reviews | | yes | | flags and optional seed reviews |

**`CartItem`** (runtime state in `App.tsx`): `sneaker`, `selectedSize`, `selectedColorIndex`, `quantity`. Key = `sneaker.id` + size + colour index.
**`Review`**: `id, author, rating 1-5, date (text), title, comment, verifiedPurchase?, helpfulCount?`. Seed reviews exist for 3 sneakers (`utils/reviews.ts`); reviews written in the modal live in component state only.
**`CollectionCategory`** (4 in `CATEGORIES`): `id, name, itemCount, imageSilhouette, image?, bgColor, tagline`.

Browser storage: key `kicks_store_filters` = JSON of `StoreFilterState` (search, category, brand, size, min/max price, sort, collectionType).

## Supabase tables

Defined in `supabase/schema.sql` (idempotent; run it in the SQL editor). Row-level security is on for every table because the anon key is public.

| Table | Written by | Readable by | Notes |
|---|---|---|---|
| `products` (id, name, price) | seed only | nobody directly (`place_order` reads it) | server-side price source; the seed must match `SNEAKERS` |
| `promo_codes` (code, percent) | seed only | nobody directly | the seed must match `validatePromoCode` |
| `orders` | `place_order` only | the owner (`select`) | unique `(user_id, client_request_id)` for idempotency; numbers are `KICKS-<sequence>`; the shipping address is copied onto the row |
| `order_items` | `place_order` only | the owner, via the parent order | snapshots `name` and `unit_price` at order time |
| `wishlist_items` (user_id, sneaker_id) | the owner (`insert`, `delete`) | the owner | primary key `(user_id, sneaker_id)`; `sneaker_id` references `products` |

`place_order(request_id, items, shipping, payment_method, promo)` is `security definer` and callable by signed-in users only. It validates 1 to 50 lines with quantity 1 to 10, prices them from `products`, applies the promo from `promo_codes`, computes shipping (free from $150, else $15), tax (8%) and the total exactly as `calculateCartTotals` does, allows at most 20 orders per user per hour, inserts the order and its lines in one transaction, and returns `{order_number, total}`. A repeat of the same `request_id` returns the original order instead of creating a second one.

## Relations

```mermaid
erDiagram
  SNEAKER ||--o{ CART_ITEM : "in bag as"
  SNEAKER ||--o{ REVIEW : "has (seed)"
  SNEAKER }o--|| CATEGORY : "belongs to"
  WISHLIST }o--o{ SNEAKER : "saves id"
```

## Indexes

None. Lookups scan 14 items in memory. If the catalogue grows past a few hundred items, build an `id → Sneaker` map once.

## Constraints and concurrency rules

- `Sneaker.id` is unique; `colors.length === colorwayNames.length`; `price > 0`; every `HERO_SLIDES` entry and every id referenced in `App.tsx`/`HomePage.tsx` must exist in `SNEAKERS` (today they are index-based or duplicated: B-05, B-06). T-020 adds a test for all of these.
- Money is in dollars with two decimals, rounded in `utils/cart.ts` only.
- Concurrency: the browser is single-threaded, so there are no races between visitors. The real hazard is **double submit** (two clicks on "Place order" produce two order numbers): guard it in T-004.
- If money or stock ever move to a server: atomic conditional updates in a transaction and idempotency keys (backend-expert-v1 defaults).

## Migrations and backups

Supabase has no migration tool here: `supabase/schema.sql` is idempotent, so re-run it in the SQL editor after a change (altering a column or constraint on existing data needs a hand-written `alter`). Backups for orders and wishlists are the Supabase project's own (plan-dependent); git holds the schema and the seed. A change to `StoreFilterState` must tolerate old saved JSON: merge over `INITIAL_STORE_FILTERS` (already done) and ignore unknown or invalid values (T-022 tests a tampered value). Static catalogue data: the git history is the only copy.
