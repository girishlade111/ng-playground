# ng-playground

An interactive Angular 18+ playground — nine working exhibits covering the modern
Angular primitives: signals, forms, CRUD, SSR with `@defer`, RxJS, dependency
injection, the router, animations, and zoneless change detection.

**Live demo:** https://ng-playground.pages.dev

## Exhibits

| Route | Exhibit | What it demonstrates |
|-------|---------|----------------------|
| `/signals` | Signals | `signal`, `computed`, `effect`, linked state |
| `/forms` | Forms | Template-driven + reactive forms, async username validator with real debounce |
| `/crud` | CRUD | Full create/read/update/delete against a mock HTTP backend, toasts, request log |
| `/ssr-defer` | SSR `@defer` | `@defer` triggers: `on viewport`, `on idle`, `on timer` |
| `/rxjs` | RxJS | Live search/filter over observable streams |
| `/di` | DI | Hierarchical dependency injection |
| `/router` | Router | Nested routes, resolvers, guards, lazy loading |
| `/animations` | Animations | Angular animation states and transitions |
| `/zoneless` | Zoneless | Change detection without zone.js |

Every exhibit is a standalone component, lazy-loaded at the route boundary.

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | Angular 18.2 (standalone components, SSR via `@angular/ssr`) |
| Language | TypeScript (strict) |
| State | Signals + RxJS |
| Server | Node + Express (SSR), mock HTTP backend via interceptor |
| Styling | Tailwind CSS |
| Tests | Karma + Jasmine (unit), Playwright + Chromium (E2E) |
| Lint | ESLint (Angular recommended) |

## Quick start

Prerequisites: Node.js 18+ (tested on Node 24), npm 10+.

```bash
npm install
npm start            # dev server at http://localhost:4200
```

## Scripts

| Command | What it does |
|---------|--------------|
| `npm start` | `ng serve` — dev server |
| `npm run build` | Production build (client + SSR server + prerendered routes) |
| `npm run serve:ssr` | Serve the production SSR build (`PORT=4200 node dist/ng-playground/server/server.mjs`) |
| `npm test` | Karma unit tests, headless Chromium |
| `npm run lint` | ESLint over the whole workspace |
| `npm run watch` | Build in watch mode |

Type-check without emitting:

```bash
npx tsc -p tsconfig.app.json --noEmit
npx tsc -p tsconfig.spec.json --noEmit
```

## Project structure

```
src/
  app/
    core/            # interceptors (error, logging, mock-backend),
                     # models, singleton services (toast, http-log)
    features/        # the nine exhibits (signals, forms, crud, rxjs,
                     # ssr-defer, ssr-hydration, di, router, animations, zoneless)
    shared/          # toast container, HTTP request log panel, guards, pipes
    app.config.ts    # withComponentInputBinding, provideAnimations, interceptors
    app.routes.ts    # lazy route map
  main.ts            # browser bootstrap
  main.server.ts     # SSR bootstrap
server.ts            # Express SSR server entry
public/              # static assets + _redirects (SPA fallback)
docs/
  AUDIT.md           # full code-audit report (findings, fixes, evidence)
```

## How it works

- **Mock backend** (`core/interceptors/mock-backend.interceptor.ts`): intercepts
  `/api/*` calls and serves deterministic in-memory data with simulated latency.
  No real backend or environment variables are needed.
- **HTTP request log**: every request/response passes through the logging
  interceptor into a floating dev-tool panel (bottom-right), useful for watching
  the mock backend traffic.
- **SSR**: the production build prerenders routes and serves them through the
  Express server (`server.ts`). The deployed static build additionally ships a
  `_redirects` SPA fallback so deep links boot the client router.
- **Error handling**: a global error interceptor maps HTTP statuses to toasts;
  it is SSR-safe (no `ErrorEvent` reference on the server).

## Deployment

Static deployment to Cloudflare Pages (no permission prompt needed per project
rules):

```bash
npm run build
~/workspace/skills/cloudflare/bin/cloudflare pages_deploy ng-playground dist/ng-playground/browser
```

The app is fully static-capable (mock backend is client-side), so Pages serves the
prerendered routes and `public/_redirects` falls back to `index.html` for the rest.

## Quality bars

Audited 27 Sep 2026 — full report in [`docs/AUDIT.md`](docs/AUDIT.md):

- `tsc` (app + spec): clean
- ESLint: clean
- Unit tests: **17/17** (Karma + headless Chromium), incl. async-validator
  timing/cancellation and HTTP-log race regression tests
- Production SSR build: clean, 14 routes prerendered
- Browser E2E (Playwright, desktop + 390px mobile): **44/47** — the 3 remaining
  items are environmental (sandbox blocks Google Fonts) or test-script artifacts,
  not app bugs
- SSR probes: `/`, `/router/task/1`, `/router/task/999` (redirect, no crash),
  invalid route — all healthy

Security notes: `express` 4.22.3 (qs 6.16.0 — GHSA-4mjr-xmp4-gh2g,
GHSA-x5fp-wj9c-mxmx). Angular 18 is end-of-life (LTS ended 2025-11-21); upgrading
to a supported major is recommended.

---

Built with ❤ by [Girish Lade](https://github.com/girishlade111) · [ladestack.in](https://ladestack.in)
