# Progress

Update after every task. Dated bullets: `2026-11-10 T-002 done — test script, 12 tests green`.

## Done

- 2026-11-10 Setup: PRD derived from the code, 17 project docs written, decisions D-001 to D-010 recorded. Baseline measured: lint clean, 12 of 12 tests pass, build passes (no images in `dist/`, B-04). No source code was changed.

- 2026-11-11 T-050 done — moved to the Next.js 16 App Router on branch `Move-to-Next.js` (D-014), not merged to `main`. Lint clean (strict on), 23 of 23 unit tests pass, `next build` prerenders all 12 routes. Checked in the browser: every route, header active state, footer filter links, `/shop?collectionType=…`, saved-filter reload with no hydration warning, `/collections/[id]` tab switching, 404 for an unknown collection, the bag surviving navigation, sign-in prompt at checkout, Escape closing it. Not checked: the password-recovery link and sign-in against a real Supabase project (no keys here). T-008 closed by the same change.
- Owner to do: switch the Vercel project to the Next.js preset (clear any `dist` Output Directory), rename the two env vars to `NEXT_PUBLIC_SUPABASE_*` in Vercel and `.env.local`, then redeploy.

## In progress

- Nothing. Docs are waiting for the owner's review.

## Blocked

| What | Why | Who answers |
|---|---|---|
| T-021 add Playwright | adds a dependency, needs the owner's OK (D-008) | owner |
| T-014 final wording of trust claims | depends on whether the claims are real (PRD Q-04) | owner |
| T-030 persistence, T-032 backend, T-033 SEO | backlog: PRD Q-07, Q-01, Q-06 | owner |

## Next

T-001, T-002, T-003 (then T-004 to T-007, which need no answers).
