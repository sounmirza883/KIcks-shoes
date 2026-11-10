# Changelog

All notable changes are listed here. Every finished task adds one line under Added / Changed / Fixed / Security.

## [Unreleased]

### Changed
- Moved the storefront from Vite to Next.js 16 (App Router) on branch `Move-to-Next.js` (D-014): real routes (`/shop`, `/collections/[id]`, `/about`, `/contact`, `/account`) replace the `#hash` router, shared state moved from `App.tsx` into `StoreProvider`, screens moved from `src/pages/` to `src/screens/`, shop filters can come from the query string, and the Supabase env vars are now `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### Removed
- Vite, `vite.config.ts` (with its `DISABLE_HMR` toggles), `index.html`, `src/main.tsx`, `metadata.json` and the unused AI Studio packages (`@google/genai`, `express`, `dotenv`, `@types/express`) and `.env.example` entries (closes D-009).

### Added
- `src/utils/routes.ts` (`hrefFor`, `pageFromPathname`, `parseShopFilters`) with 5 unit tests.
- Project docs created by setup-expert-v1 from the existing code: PRD, CONTEXT, PROJECT_PLAN, TASKS, PROGRESS, TECH_STACK, ARCHITECTURE, DATABASE_SCHEMA, API_SPEC, DESIGN_SYSTEM, CODING_STANDARDS, TESTING, SECURITY, DECISIONS, README and AGENTS.md.
