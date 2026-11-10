# Project plan — KICKS.

Phase goal: a correct, accessible, tested, documented **front-end** storefront (D-001). Task details and order: [TASKS.md](TASKS.md).

## Milestones

| # | Milestone | Ends with something usable | Tasks |
|---|---|---|---|
| M1 | **Fix money, privacy and build defects** | A build that charges what the bag shows, has no personal data in source, shows every image in production, installs with plain `npm install`, and has a `test` script | T-001 to T-009 |
| M2 | **Tokens, accessibility, honest content** | A UI with checked colour tokens, working animations with reduced-motion support, keyboard-operable dialogs and labelled sample content | T-010 to T-015 |
| M3 | **Test and harden** | Unit tests for every money rule, Playwright flows C-1 to C-5 (if approved), a break-it report, a Lighthouse pass | T-020 to T-023 |
| M4 | **Launch on Vercel** (Next.js) | A deployed URL with security headers and a final QA result | T-040 to T-042 |

Backlog (not scheduled, needs the owner): persistence (T-030, T-031), real backend (T-032), SEO (T-033).

## Phases

| Phase | Skill workflow | Where |
|---|---|---|
| Design | premium-ui-expert-v1: tokens, motion, accessibility, honest content | M2 (brief already in [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)) |
| Backend design | backend-expert-v1: **skipped**, no backend (D-001); only the scan (T-009) and host headers (T-040) apply | M1, M4 |
| Build | fix defects, then tokens and accessibility | M1, M2 |
| Test | tester-expert-v1: unit, E2E, break-it, Lighthouse | M3 |
| SEO | **skipped** (D-002) | none |
| Launch | host, headers, final QA, release notes | M4 |

## Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Money maths wrong (promo percent mismatch, B-01) | Happened | High (wrong totals) | T-003 plus tests for every code and the $150 edge |
| Personal data and placeholder trust claims published | Happened (B-03, B-13) | High (privacy, honesty) | T-004, T-014; owner decides about git history |
| Production build looks broken (no images, B-04) | Happened | High | T-006; build and preview are part of the definition of done |
| Dependency drift: Next.js 16, React 19, TypeScript 7 are new (`eslint-config-next` conflicts with the TypeScript 7 peers, so there is no ESLint) | Medium | Medium | Commit the lockfile, one major upgrade per task |
| Agents add a backend, new libraries or SEO work on their own | Medium | Medium | AGENTS.md "Never" list and the PRD out-of-scope list |
| Hot-linked Unsplash images or Google Fonts become unavailable | Low | Medium | Local assets (T-006); `SneakerVisual` already falls back to SVG |
| Scope change (real store) arrives late | Medium | High | Backlog T-032 exists; D-001 says what has to be superseded |

## Definition of done

A task is done only when all of these are true:

1. The task's "done when" check passes.
2. `npm run lint` and `npx tsx --test src/utils/*.test.ts` pass; `npm run build` passes (and `npm start` after the build shows the change if it is visible).
3. The owning skill's QA ran: UI work gets the browser sweep, `ui-audit.mjs` and the contrast check; fixes get a regression test.
4. No console errors, no failed network requests, no new hard-coded colours, no new dependency without the owner's OK.
5. Accessibility for UI: keyboard operable, labels, contrast ≥ 4.5:1, reduced motion respected.
6. Docs updated: task ticked in TASKS.md, PROGRESS.md and CHANGELOG.md updated, the owned doc changed if the design changed, a DECISIONS.md entry for any real choice.
