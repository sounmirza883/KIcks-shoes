# AGENTS.md — KICKS.

A sneaker storefront (React 19 + Vite + Tailwind v4, TypeScript) hosted on Vercel, with Supabase for accounts, the saved wishlist and orders (D-012, D-013): browse, filter, bag, wishlist, sign-in and a checkout that saves the order. No real payments: card details are never collected (see docs/PRD.md).

## Read first (every session, in this order)
1. docs/CONTEXT.md — what we are building and the current status
2. docs/PROGRESS.md — where the last session stopped
3. docs/TASKS.md — pick the next unchecked task
Then read only the docs the task needs (links in the Skills table).

## Skills
Installed **globally** on this machine: `~/.claude/skills/` (Claude Code) and `~/.agents/skills/` (Codex, Cursor, Copilot, Antigravity, OpenCode, Kimi). The project has no copy yet; copy the folders into `.claude/skills/` or `.agents/skills/` to pin versions (decision D-007). Below, `<skills-dir>` means whichever of these exists.

| Work | Skill — MUST read before starting | Docs it owns |
|---|---|---|
| Project docs, plan, tasks, tooling, new skills | `<skills-dir>/setup-expert-v1/SKILL.md` | PRD, CONTEXT, PROJECT_PLAN, TASKS, PROGRESS, TECH_STACK, CODING_STANDARDS, DECISIONS, README, CHANGELOG |
| Any UI, styling, animation, accessibility, responsiveness, performance | `<skills-dir>/premium-ui-expert-v1/SKILL.md` | DESIGN_SYSTEM |
| Backend, API, database, auth, security scans, host headers (Supabase: `supabase/schema.sql`) | `<skills-dir>/backend-expert-v1/SKILL.md` | ARCHITECTURE, DATABASE_SCHEMA, API_SPEC, SECURITY |
| Testing, QA, bug fixing with regression tests | `<skills-dir>/tester-expert-v1/SKILL.md` | TESTING |
| SEO, metadata, sitemap (parked, decision D-002) | `<skills-dir>/seo-expert-v1/SKILL.md` | none until SEO.md exists |

- Before UI work you MUST read `<skills-dir>/premium-ui-expert-v1/SKILL.md` and docs/DESIGN_SYSTEM.md.
- Before backend, security-scan or hosting work you MUST read `<skills-dir>/backend-expert-v1/SKILL.md`, docs/SECURITY.md and docs/ARCHITECTURE.md. The only backend is Supabase (`supabase/schema.sql`, D-012): do not add another API or database.
- Before testing or fixing a bug you MUST read `<skills-dir>/tester-expert-v1/SKILL.md` and docs/TESTING.md.
- SEO is out of scope. Do not start SEO work unless the owner reverses D-002; then read `<skills-dir>/seo-expert-v1/SKILL.md` first.
- A task touching two areas reads both skills. Skill rules beat personal habit; this file beats the skills.

## How to work (one task at a time)
1. Take the next unchecked task in docs/TASKS.md (or the one the user names). Tasks marked "needs the owner's OK" wait for it.
2. Read the skill named in the task, then the docs it needs.
3. Do the task. Small, complete change; follow docs/CODING_STANDARDS.md.
4. Test: run the commands below; the task's "done when" must be true. UI changes are also checked in the browser.
5. Tick the task `- [x]` in docs/TASKS.md.
6. Update docs/PROGRESS.md and CHANGELOG.md; update the owned doc if the design changed (bug ids live in docs/TESTING.md → Results).
7. Record any real choice in docs/DECISIONS.md. Unknown facts → an Open question in docs/PRD.md, not a guess.

## Commands
- Install: `npm install` (copy `.env.example` to `.env.local` and set the two `VITE_SUPABASE_*` values to use accounts and orders)
- Run: `npm run dev` (http://localhost:3000; can take a few seconds to start)
- Test: `npx tsx --test src/utils/*.test.ts` (`npm test` after T-002); single test: `npx tsx --test --test-name-pattern="promo code" src/utils/cart.test.ts`
- Lint: `npm run lint` (`tsc --noEmit`; there is no ESLint or Prettier)
- Build: `npm run build`, then `npm run preview`

## Project facts that bite
- Routing is hand-rolled over `location.hash`; all shared state is in `src/App.tsx` (D-003, D-004). Do not add a router or state library.
- Money maths lives only in `src/utils/cart.ts` (D-010). Imports use explicit `.ts`/`.tsx` extensions; `@` is the repo root.
- Overlays (`CartDrawer`, `WishlistDrawer`, `ProductDetailModal`, `CheckoutModal`, `AuthModal`) stay mounted: reset their state when they open.
- Clients never write orders directly: only the `place_order` RPC does, and it prices from the server's `products` table. `supabase/schema.sql` duplicates prices, promo percents and cart constants; `orders.test.ts` fails on drift (D-012).
- Product images live in `public/images/` as `/images/...` strings; never `/src/assets/...` (it breaks the Vercel build).
- Leave the `DISABLE_HMR` toggles in `vite.config.ts` alone.

## Never
- Never commit secrets, `.env` or personal data; never put secrets in frontend code or `VITE_` variables (the Supabase anon key is public by design and safe only because RLS is on; the `service_role` key is a secret and is never used here).
- Never change TECH_STACK.md choices, add a dependency or reverse a DECISIONS.md entry without the user's OK.
- Never build out-of-scope features (docs/PRD.md → Out of scope): real payments, guest checkout, SEO. Accounts, the saved wishlist and orders on Supabase are in scope (D-012).
- Never add card-number fields; never present placeholder reviews, guarantees or customer counts as real.
- Never run load tests or security scans against production or third parties (Google Fonts, Unsplash).
- Never weaken or delete a test to make it pass.
- Never commit, push or rewrite git history unless the user asks.
- Never leave docs out of date after finishing a task.
