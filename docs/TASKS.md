# Tasks

Format: `- [ ] T-001 <task> (skill: <name>) (done when: <check>)`. One task per session, in order. Bug ids (B-xx) are in [TESTING.md](TESTING.md#results); features (F-xx) and open questions (Q-xx) are in [PRD.md](PRD.md).

## M1 — Fix money, privacy and build defects

- [ ] T-001 Make `package-lock.json` trackable (it is untracked) and re-confirm the baseline: `npm install --legacy-peer-deps`, lint, tests, build (skill: setup-expert-v1) (done when: the lockfile shows in `git status` for the owner to commit and the numbers match TESTING.md → Results)
- [ ] T-002 Add `"test": "tsx --test src/utils/*.test.ts"` to package.json and update the commands in README.md, AGENTS.md and CLAUDE.md (skill: setup-expert-v1) (done when: `npm test` runs the 12 tests green)
- [ ] T-003 Checkout charges what the bag shows: compute the percent once with `validatePromoCode(appliedPromo).discountPercent` and pass it to both `CartDrawer` and `CheckoutModal`; add tests for all four codes (F-05, F-07, B-01, D-010) (skill: tester-expert-v1) (done when: unit tests for KICKS10, NEXTSTEP, VIP20 and DROPS pass, and in the browser the bag total equals the checkout total for each code)
- [ ] T-004 `CheckoutModal`: reset step and form every time it opens, empty fields instead of personal data, lock the submit button after the first click (F-07, B-02, B-03) (skill: tester-expert-v1) (done when: reopening checkout after an order shows an empty form, double-clicking "Place order" gives one order number, and `grep -rn "@gmail" src` finds nothing)
- [ ] T-005 Replace `SNEAKERS[2]` in `App.tsx` and `HomePage.tsx` with a lookup by id, and make `HERO_SLIDES` read name and price from the catalogue by id (F-01, B-05, B-06) (skill: tester-expert-v1) (done when: a data test shows every hero, bag and featured id exists in `SNEAKERS`, and hero prices equal catalogue prices)
- [ ] T-006 Make images work in the production build: import them or move them to `public/`, replace the 7 Unsplash hot-links with local files (supplied by the owner or downloaded with the owner's OK), and ask before deleting the unused `public/assets/aistudio` (F-01 to F-04, B-04) (skill: premium-ui-expert-v1) (done when: after `npm run build && npm run preview` every image shows, the network tab has 0 failed requests and no `/src/assets` string remains)
- [ ] T-007 Footer social links: real external URLs with `target="_blank" rel="noopener noreferrer"`, or removed until real URLs exist (F-10, B-07) (skill: premium-ui-expert-v1) (done when: clicking any footer social icon never changes the current page)
- [ ] T-008 **Needs the owner's OK (PRD Q-09, D-009).** Remove `@google/genai`, `express`, `dotenv`, `@types/express`, the `esbuild` pin, `.env.example`, `metadata.json` and the `clean` script; update README (B-08) (skill: setup-expert-v1) (done when: plain `npm install` succeeds on a clean clone, lint, tests and build are green, and `grep -ri gemini .` finds nothing outside docs/)
- [ ] T-009 Run `security-scan.mjs .` and `call-map.mjs .` and triage the output (skill: backend-expert-v1) (done when: TESTING.md → Results says no secrets were found, zero API calls exist and the only external requests are Google Fonts and Unsplash, with each finding fixed or marked reviewed)

## M2 — Tokens, accessibility, honest content

- [ ] T-010 Put the colour and motion tokens and the fluid type scale from DESIGN_SYSTEM.md into `src/index.css` (skill: premium-ui-expert-v1) (done when: `contrast-check.mjs src/index.css` exits 0)
- [ ] T-011 Replace failing muted text colours on light surfaces with `--muted` (B-10) (skill: premium-ui-expert-v1) (done when: every text/background pair is at least 4.5:1 in a browser sweep of all screens and overlays, and `ui-audit.mjs` reports no contrast issue)
- [ ] T-012 Define the keyframes behind `animate-in`, `fade-in`, `slide-in-from-*` and `zoom-in-*` in `index.css` using the motion tokens, plus a `prefers-reduced-motion` block, with no new dependency (B-09) (skill: premium-ui-expert-v1) (done when: toast, drawers and modals animate, and with reduced motion on they appear without movement)
- [ ] T-013 Dialog semantics: `role="dialog"`, `aria-modal`, focus trap and return, Esc closes, `htmlFor` labels in checkout, contact and newsletter, toast `aria-live` (F-04 to F-07, B-11) (skill: premium-ui-expert-v1) (done when: add to bag, checkout and the success screen can be completed with the keyboard only, checked in the browser)
- [ ] T-014 Label sample content as sample or remove it unless the owner confirms it is real: "10K+ Happy Customers" and stock avatars, "verified purchase" seed reviews, guarantees, store addresses; newsletter consent unticked by default (F-08, F-09, B-12, B-13, Q-04) (skill: premium-ui-expert-v1) (done when: `ui-audit.mjs` reports no fake-social-proof findings and the consent box starts unchecked)
- [ ] T-015 Responsive sweep at 320, 375, 768 and 1440 px on every screen (F-01 to F-10) and run `ui-audit.mjs src`; fix the findings (skill: premium-ui-expert-v1) (done when: no horizontal scroll with `overflow-x: hidden` temporarily removed, and audit errors are fixed or reviewed with `scan-ignore`)

## M3 — Test and harden

- [ ] T-020 Add the unit tests listed in TESTING.md → Test Handoff: cart edges, promo normalisation, filter edges, catalogue integrity (F-02, F-05) (skill: tester-expert-v1) (done when: all pass and no existing test was weakened)
- [ ] T-021 **Needs the owner's OK (D-008).** Add Playwright and E2E tests for flows C-1 to C-5 (F-02, F-03, F-06, F-07) (skill: tester-expert-v1) (done when: `npx playwright test` is green against the dev server)
- [ ] T-022 Break-it pass from TESTING.md, including a tampered `kicks_store_filters`; fix each bug with a regression test (skill: tester-expert-v1) (done when: the Results table is updated and every S1 and S2 bug is fixed)
- [ ] T-023 Lighthouse on `npm run preview` (mobile) and fix the largest findings such as unsized images and font loading (skill: premium-ui-expert-v1) (done when: performance is at least 90 on Home, or the gap is written in TESTING.md)

## M4 — Launch on a static host

- [ ] T-040 Pick a host (PRD Q-02), deploy `dist/` and set the security headers from SECURITY.md (skill: backend-expert-v1) (done when: the deployed URL loads every screen with 0 console errors and the headers show in devtools)
- [ ] T-041 Final QA on the deployed URL and a "Test result" line in TESTING.md (skill: tester-expert-v1) (done when: the result says ready or not ready and lists open bugs by severity)
- [ ] T-042 Release: CHANGELOG 0.1.0, PROGRESS, CONTEXT status; check README on a clean clone (skill: setup-expert-v1) (done when: a fresh clone follows README to a running site)

## Backlog (needs the owner's answer first; not in the build order)

- [ ] T-030 Keep bag and wishlist in `localStorage` (versioned key, validated, corrupt value gives an empty list) and start with an empty bag (N-01, Q-07) (skill: premium-ui-expert-v1) (done when: a reload keeps both and a corrupted value does not crash the page)
- [ ] T-031 Tests for T-030: reload, corrupt JSON, old-version value (skill: tester-expert-v1) (done when: the cases pass)
- [ ] T-032 Only if Q-01 becomes "real store": backend design with catalogue DB, accounts, orders and hosted payments in test mode (skill: backend-expert-v1) (done when: ARCHITECTURE, DATABASE_SCHEMA, API_SPEC and SECURITY are rewritten and approved, and D-001 is superseded)
- [ ] T-033 Only if Q-06 becomes "must rank": SEO plan with real URLs, pre-rendering, metadata and sitemap (skill: seo-expert-v1) (done when: `docs/SEO.md` is written and approved, and D-002 and D-003 are superseded)
