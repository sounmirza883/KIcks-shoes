# Design system — KICKS.

> First draft by setup-expert-v1 from the existing UI. Owner: premium-ui-expert-v1 (refines it when it runs). Non-interactive defaults were used (no brand brief, no references, no motion preference given): Confident intensity, light theme with dark tokens. Questions: PRD Q-03.

## Emotion and peak moment

- **Emotion:** confident street-culture energy with premium restraint. Copy and visuals already say "Built for what's next", black and white, big uppercase headlines.
- **Peak moment:** the home hero: a full-bleed sneaker, three slides, one clear "Shop Collection" action. Spend the motion budget here; everything else stays quiet.
- **Motion intensity:** Confident. E-commerce defaults are modules 0, 2, 4, 5, 6, 13, 14 (premium-ui). Because the site has **no real data** (PRD Q-04), skip 4 (live activity pings), 5 (review shuffle) and 6 (count-up stats). Use 0 reveal foundation, 2 hero reveal, 13 click-to-success (add to bag, order placed), 14 micro-interactions.
- **Ethics:** no fake social proof or scarcity. "10K+ Happy Customers" with stock-photo avatars, "verified purchase" seed reviews and "Authenticity Guarantee" are placeholders until the owner confirms them (T-014).

## Color tokens

Today the UI uses Tailwind classes plus raw hex values (`#111111` ×45, `#FFFFFF`, `#F8F9FA`, `#E2E8F0`, `#DC2626`, ...). Move to these tokens (T-010). All pairs below were checked with `contrast-check.mjs`: **26 pass, 0 fail**.

```css
:root {
  --bg: #F8F9FA;       --surface: #FFFFFF;   --text: #111111;     --muted: #595959;
  --accent: #DC2626;   --on-accent: #FFFFFF; --success: #047857;  --warning: #B45309;
  --danger: #B91C1C;   --border: #E2E8F0;
}
[data-theme=dark] {
  --bg: #0B0B0C;       --surface: #161617;   --text: #F5F5F7;     --muted: #A3A3A3;
  --accent: #F87171;   --on-accent: #111111; --success: #34D399;  --warning: #FBBF24;
  --danger: #F87171;   --border: #2A2A2C;
}
```

| Pair (light) | Ratio | Pair (dark) | Ratio |
|---|---|---|---|
| text on bg | 17.91 | text on bg | 18.07 |
| muted on bg | 6.65 | muted on bg | 7.8 |
| accent on bg | 4.58 | accent on bg | 7.11 |
| on-accent on accent | 4.83 | on-accent on accent | 6.83 |
| success / warning / danger on surface | 5.48 / 5.02 / 6.47 | same, on surface | 9.41 / 10.83 / 6.54 |

- Dark tokens are defined for later; **no dark mode is built or required** (PRD out of scope).
- **Known failure (B-10):** `text-neutral-400` (#A3A3A3) on white is 2.52:1 and is used 52 times; `text-neutral-500` (#737373) on `#F8F9FA` is just under 4.5:1 (44 uses). Light surfaces must use `--muted` (#595959). On the dark `#111111` footer and newsletter, #A3A3A3 is fine (7.49:1).
- `--border` is a decoration colour, not text: it is exempt.

## Typography

| Role | Font | Use |
|---|---|---|
| Display | Outfit 400-900 | headings, big uppercase headlines (weights 800-900) |
| Body | Plus Jakarta Sans 300-700 | paragraphs, buttons, inputs |
| Label | Space Mono 400/700 | small uppercase labels with wide tracking (`tracking-widest`) |

Loaded from Google Fonts by `<link>` tags in `src/app/layout.tsx`; CSS variables `--font-display`, `--font-sans`, `--font-mono` in `src/app/globals.css`. Fluid sizing with `clamp()` for hero and section headlines (add in T-010); body 16px minimum; labels never below 12px.

## Spacing and shape

- Spacing: Tailwind 4/8 scale (`p-4`, `gap-6`, `py-16` to `py-20` for sections).
- One radius family: 12px (inputs, buttons, small cards), 24px (cards, modals, drawers), full (pills, avatars). Today there is a mix of `rounded-xl`, `rounded-2xl`, `rounded-3xl`; converge on these.
- One shadow family: soft shadow on cards, `shadow-2xl` on overlays only.
- Layout: mobile first, must work at 320px with no horizontal scroll (`body` currently hides `overflow-x`, which masks overflow bugs: check without it).

## Motion tokens

```css
:root {
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);   --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-in: cubic-bezier(0.55, 0, 1, 0.45);
  --dur-1: 120ms; --dur-2: 240ms; --dur-3: 480ms; --dur-4: 800ms; --stagger: 60ms;
}
```

- Animate only `transform`, `opacity`, `clip-path`. Entrances ease-out, exits ease-in, 12-24px travel, stagger 40-80ms.
- **Reduced motion:** there is none today (0 matches). Under `prefers-reduced-motion: reduce`, drop movement, keep fades at 200ms or less, show final states.
- **Bug B-09:** `animate-in`, `fade-in`, `slide-in-from-*`, `zoom-in-*` are no-ops (no animation plugin). Define the keyframes in `src/app/globals.css` with these tokens (T-012). **Do not add a plugin or a second animation library**; `motion` is already installed if CSS is not enough.
- Hero carousel has no autoplay (verified), so no pause control is needed. If autoplay is added, add a pause toggle (`<html data-motion="paused">`).
- Hover effects only inside `@media (hover: hover) and (pointer: fine)`.

## Components

| Component | File | Must have |
|---|---|---|
| Button (primary black, secondary outline) | inline classes everywhere | visible focus ring, 44px touch target |
| Input / select / radio | `CheckoutModal`, `ContactPage`, `DiscountNewsletter`, `CartDrawer` | `<label htmlFor>` tied to the input (0 today: B-11), inline error text |
| ProductCard | `components/ProductCard.tsx` | image, name, price, wishlist toggle, quick add |
| SneakerVisual | `components/SneakerVisual.tsx` | real image with SVG fallback; meaningful `alt` |
| Drawer (bag, wishlist) | `CartDrawer`, `WishlistDrawer` | `role="dialog"`, `aria-modal`, focus trap, Esc, focus return |
| Modal (product, checkout) | `ProductDetailModal`, `CheckoutModal` | same as drawer; reset state on open |
| Toast | `StoreProvider.tsx` | `role="status"` / `aria-live="polite"`; 2.6 s |
| Header, Footer, Hero, section banners | `components/*` | landmarks (`header`, `nav`, `main`, `footer`), heading order |

Icons: `lucide-react` only. No emoji icons, no mixed icon sets.

## Screens

| Screen | Route | Job | Animation module | Indexable? |
|---|---|---|---|---|
| Home | `/` | Hook the visitor, route to Shop | 0 reveal, 2 hero reveal, 14 | No (D-002) |
| Shop | `/shop` (presets by query: `?collectionType=`, `?category=`) | Find a pair: search, filters, sort | 0, 14 | No |
| Collections (all) | `/collections` | Browse by category | 0, 14 | No |
| Collection | `/collections/<id>` (lifestyle, running, basketball, casual; any other id is a 404) | Category landing | 0, 14 | No |
| About | `/about` | Brand story and trust | 0 | No |
| Contact | `/contact` | Support form, FAQ, stores | 13 click-to-success | No |
| Product detail (modal) | none (state) | Choose colour and size, read reviews, add | 13, 14 | No |
| Bag (drawer) | none | Review items, promo, shipping progress | 14 | No |
| Wishlist (drawer) | none | Saved pairs | 14 | No |
| Checkout (modal) | none | Simulated order | 13 | No |

QA for any UI change: `node <skills-dir>/premium-ui-expert-v1/scripts/ui-audit.mjs src` and the contrast script on `src/app/globals.css` once tokens exist (T-010, T-015).
