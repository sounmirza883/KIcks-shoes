# Coding standards — KICKS.

Match the surrounding code. There is no ESLint or Prettier config: `npm run lint` (`tsc --noEmit`, `tsconfig.json`) is the only automatic check. `strict` is **not** enabled in `tsconfig.json`; do not turn it on inside a feature task (separate task and owner OK).

## Naming

- Components and pages: `PascalCase` named exports, one per file, file name = component name (`ProductCard.tsx`). The code uses `export const X: React.FC<Props>` and `export default function App`.
- Functions and variables: `camelCase`. Handlers in `App.tsx` are `handleX`; props that receive them are `onX`.
- Constants: `UPPER_SNAKE_CASE` (`FREE_SHIPPING_THRESHOLD`, `STORAGE_KEY`). Types and interfaces: `PascalCase`, no `I` prefix.
- Domain words follow the glossary in [CONTEXT.md](CONTEXT.md): code says `cart`, UI copy says "bag".
- Test files: `<module>.test.ts` next to the module.

## File structure

- `src/pages/` one screen per route; `src/components/` sections and overlays; `src/utils/` pure, tested logic; `src/data/` static data; `src/types/` shared types. See [ARCHITECTURE.md](ARCHITECTURE.md#folder-structure).
- **Shared state goes in `App.tsx` and flows down as props** (D-004). No new state library or Context.
- **Money maths only in `utils/cart.ts`** (D-010). Never compute totals, tax or discounts inside a component.
- Imports use explicit `.ts`/`.tsx` extensions (`allowImportingTsExtensions`). The `@` alias is the **repo root**, not `src/`. Use `import type` for type-only imports in files the tests load.
- Product images: import them or put them in `public/`; never new `/src/assets/...` strings (B-04).

## Error handling

- Validate at the boundary: form fields (`required`, `type=email`, explicit checks) and anything read from `localStorage` (wrap in `try/catch` and check the shape; fall back to defaults).
- Never swallow an error in a way that loses what the visitor typed. Messages say what to do ("Please enter a valid email address"), never show stack traces.
- Overlays that stay mounted reset their own state when they open (B-02). Disable a submit button after the first click.
- No `dangerouslySetInnerHTML`, `innerHTML` or `eval` (SECURITY.md).

## Style and formatting

- TypeScript, React function components and hooks, 2-space indent, single quotes, semicolons, trailing commas (as in the existing files).
- Tailwind utility classes in JSX; colours and motion come from the tokens in [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) once they exist (T-010). No new hard-coded hex values, no `transition: all`.
- UI work follows `premium-ui-expert-v1`; accessible by default (`<button>` for actions, labels on inputs, alt text on images).
- Do not add dependencies for a few lines; do not add a second animation or icon library.

## Comments

Explain **why**, not what, in one line. A deliberate shortcut gets `shortcut: <limit>, <when to upgrade>`. Keep the existing `@license` header in `App.tsx`.

## Git and commits

- Small commits, one task per commit, message `type(scope): summary (T-012)`, e.g. `fix(checkout): use validatePromoCode percent (T-003)`.
- Commit `package-lock.json`. Never commit `.env`, secrets or personal data (B-03). Do not commit or push unless the owner asks.
- Branch off `main`; the repo is on Windows (git warns about LF/CRLF): do not "fix" line endings in unrelated files.
