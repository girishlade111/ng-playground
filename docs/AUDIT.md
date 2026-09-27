# ng-playground — Code Audit Report

**Date:** 27 September 2026
**Repo:** girishlade111/ng-playground (`~/workspace/ng-playground`)
**Stack:** Angular 18.2.x, SSR (Node/Express), standalone components, signals
**Baseline commit:** `fe9a83bc3d7123200bbe2dca90416dbffaca826a` (112 commits, byte-identical clone)

Full manual + terminal + server + browser audit. All fixes applied and verified.
No commit, no push, no deploy — changes remain uncommitted in the working tree
per standing instruction.

---

## 1. Manual (traditional) code review

Reviewed every feature module (`animations`, `crud`, `forms`, `router`, `rxjs`,
`signals`, `zoneless`, `ssr-defer`, `ssr-hydration`, `di`) plus core services,
interceptors, guards, and resolvers.

### Findings & fixes

| # | Finding | Fix |
|---|---------|-----|
| 1 | `ErrorEvent` referenced directly in `error.interceptor.ts` — **crashed the Node SSR process** (`ReferenceError: ErrorEvent is not defined`) on `/router/task/999` | Guarded with `typeof ErrorEvent !== 'undefined' &&` |
| 2 | `taskResolver` let fetch failures break navigation (unknown id → broken route) | `catchError` → `new RedirectCommand(router.parseUrl('/router'))`. Note: a plain `UrlTree` is NOT a redirect in Angular 18 resolvers — it would be stored as resolved data and bound to the component input; only `RedirectCommand` triggers redirect |
| 3 | Mock backend failed ~10% of CRUD requests via `Math.random()` — success paths randomly failed; SSR, resolver, and E2E inherently flaky | Removed random failures; failures now only on genuine error paths (404, validation) |
| 4 | Mock error responses used `throwError(...).pipe(delay(...))` — RxJS `delay()` does **not** delay error notifications, so error latency was never simulated | Replaced with `timer(simulateDelay()).pipe(mergeMap(() => throwError(...)))` |
| 5 | Mock errors were plain `Error` objects, losing HTTP status semantics for the error interceptor | Now `HttpErrorResponse` with real `status` (404/500) |
| 6 | HTTP request log race: interceptor called `addEntry()` then `updateLastEntry()` — concurrent/out-of-order responses updated the **wrong** log entry | Entries now carry a unique `id`; interceptor captures it and calls `updateEntry(id, patch)`. `updateLastEntry` removed |
| 7 | Toast progress bar: `absolute bottom-0` bar inside a card with no `relative` positioning → bar anchored to the fixed container instead of its toast | Added `relative` to the toast card |
| 8 | Toast container `fixed right-4 w-full max-w-sm` overflows horizontally on 390px viewports (400px > 390px) | `left-4 … sm:left-auto`, `w-auto sm:w-full sm:max-w-sm` |
| 9 | HTTP log panel same overflow (`fixed bottom-4 right-4 w-full max-w-2xl`) | Same responsive fix |
| 10 | Forms tab bar (`flex`, 4 long labels) overflows horizontally on 390px viewports | Added `overflow-x-auto` to the `tablist` container |
| 11 | `app.config.ts` missing `withComponentInputBinding()` (needed for resolver → component input binding) | Added |
| 12 | Missing `provideAnimations()` | Added |
| 13 | Missing `RouterLinkActive` import where used | Added |
| 14 | Effects created outside injection context in deferred heavy components; intervals not cleaned up | Effects moved into constructor injection context; `DestroyRef` cleanup |
| 15 | Deferred retry conditions incorrect | Fixed retry semantics |
| 16 | **NG0600 on `/signals` and `/zoneless`**: three `effect()`s wrote to signals without `{ allowSignalWrites: true }` — Angular 18 throws `NG0600: Writing to signals is not allowed in a computed or an effect by default` on page load (verified against `@angular/core` source: `SIGNAL_WRITE_FROM_ILLEGAL_CONTEXT`) | Added `{ allowSignalWrites: true }` to all three effects (the documented pattern for this manual-linkedSignal-style sync) |
| 17 | **Async username validator never debounced**: `of(value).pipe(debounceTime(300), …)` — `debounceTime` flushes immediately when a synchronous single-emission observable completes, so the "300 ms debounce" never happened (an earlier draft of this report wrongly called it equivalent to a delay — corrected here) | Replaced with `timer(300).pipe(switchMap(…))`: a real 300 ms pause; Angular still unsubscribes on each keystroke so rapid typing cancels the pending check. Unused `debounceTime` import removed |
| 18 | CRUD create/delete showed no toast while update did — the toast feature was undemonstrable on 2 of 3 mutations | Added `toast.success` on create and delete, matching the update pattern |
| 19 | Form accessibility: missing label/input `id` associations and `aria-describedby` | Added |
| 20 | Invalid `<label>` elements outside forms | Replaced with proper elements |
| 21 | Dead imports / unused functions across components | Removed |
| 22 | BOM / irregular whitespace in sources | Cleaned |

Lint baseline: 20 errors + 3 warnings → all fixed.

### Reviewed and judged correct (no change)

- Guard toggle on `/router` uses an `sr-only` checkbox + visible switch: clicking the
  wrapping `<label>` toggles correctly (verified in E2E).
- CRUD delete uses a native `confirm()` dialog — intentional; E2E accepts it.
- The floating HTTP Request Log panel occludes page content by default — it is a
  dev-tool overlay with collapse/close controls (same pattern as Redux DevTools);
  left as designed.

---

## 2. Terminal-based audit (static analysis, lint, tests, build)

| Check | Result |
|-------|--------|
| `tsc -p tsconfig.app.json --noEmit` | PASS |
| `tsc -p tsconfig.spec.json --noEmit` | PASS |
| `ng lint` | All files pass linting |
| Karma + headless Chromium unit tests | **17/17 SUCCESS** (3 original + 14 new regression tests) |
| `npm run build` (production SSR build, clean `dist`) | PASS, 14 routes prerendered |

New regression tests (`*.spec.ts`):
- `task.resolver.spec.ts` — resolver success, 404 redirect, backend-failure redirect
- `error.interceptor.spec.ts` — 404 message/status, 500 message/status, SSR-safe
  (no `ErrorEvent` in Node)
- `logging.interceptor.spec.ts` — success logging, **concurrent out-of-order
  completion updates the correct entries** (regression test for finding #6)
- `access.guard.spec.ts` — grant and deny-redirect
- `forms.component.spec.ts` — async validator: real 300 ms debounce + 800 ms check
  timing, taken/available verdicts, rapid-typing cancellation (exactly one server
  call), short values never call the server (regression tests for finding #17)

### Dependency / security audit

- `express` **4.22.2 → 4.22.3** (patch bump, within the declared `^4.18.2` range).
  express@4.22.3 declares `qs ~6.16.0`, fixing qs advisories **GHSA-4mjr-xmp4-gh2g**
  (crafted query string can stall the server) and **GHSA-x5fp-wj9c-mxmx**
  (array-limit bypass) — confirmed via the npm registry dependency metadata and
  third-party changelogs citing the same bump. Installed tree now: `express@4.22.3`
  → `qs@6.16.0`.
- Older Express floors (CVE-2024-29041 open redirect, fixed in 4.19.2) are covered.
  CVE-2024-51999 (qs/extended query parser) was **withdrawn** by GitHub as a
  correctness bug, not a vulnerability.
- `package-lock.json` diff: the express/qs bump above + `libc`-field normalization
  on optional native platform packages (esbuild/swc) from the npm version in use —
  no other dependency change. Retained deliberately.
- `glob@10.5.0` deprecation warning: transitive **dev-only** dependency
  (`@angular/cli → pacote → @npmcli/*`); not reachable from the production SSR
  server or browser bundle. No action (would require an Angular major upgrade).
- **Angular 18 is end-of-life**: per endoflife.date, v18 LTS ended **2025-11-21**
  (latest 18.x is 18.2.14, 2025-09-10). Supported majors are 20/21/22. The repo
  pins `^18.2.0`. Recommendation: plan an upgrade to a supported major; until then,
  no further security patches will ship for this line.
- `npm audit` is unusable in this environment (`403 policy_denied` from the
  registry), so **no "zero vulnerabilities" claim is made** — the above was checked
  against official advisories and registry metadata instead.

---

## 3. Server-based audit (production SSR)

Built with `npm run build`, served with `PORT=4200 node dist/ng-playground/server/server.mjs`.

| Probe | Result |
|-------|--------|
| `GET /` | 200 |
| `GET /router/task/1` | 200, SSR HTML contains `Set up project structure` |
| `GET /router/task/999` (unknown id) | **200, renders Router index** — redirect works, no SSR crash, server stays alive (previously: full Node process crash via `ErrorEvent`) |
| `GET /crud`, `/forms` | 200 |
| `GET /does-not-exist` | 200 (client-side redirect to `/`, verified in browser) |
| Server log after probes | No `ReferenceError`, no errors |

Note: keep `pkill` for the server in its own short command — `pkill -f "[s]erver.mjs"`
matches the invoking shell's own command line if combined with other commands.

---

## 4. Browser audit (functional E2E, responsive, accessibility)

Playwright + headless Chromium against the final production build at
`http://localhost:4200` (the managed remote browser cannot reach this VM's
localhost, so E2E was run locally via `playwright-core` + the cached Chromium).
**44/47 checks passed**; the 3 remaining items are explained below, not app bugs.

| Area | Result |
|------|--------|
| All 14 routes load over HTTP | PASS |
| Home search filters exhibit cards (18 → 6 on "signals") | PASS |
| Signals counter increments (doubled 0 → 2) | PASS |
| Zoneless counter increments (0 → 1) | PASS |
| Async username validator: "admin" → taken, "uniqueuser999" → available | PASS |
| Reactive forms route | PASS, no console errors |
| CRUD: list loads, create adds task, **toast shown on create**, HTTP log panel records `GET /api/tasks` + `POST` | PASS |
| CRUD: delete removes task, **toast shown on delete** (verified in focused retest; the suite's generic check clicked the wrong row — new tasks are prepended) | PASS (focused retest) |
| RxJS search filters results | PASS |
| Router: `/router/task/1` shows detail via resolver | PASS |
| Router: `/router/task/999` redirects to `/router`, no blank page | PASS |
| Router: guard denies `/router/protected` → access-denied page | PASS |
| Router: toggle ON → protected content visible (client-side nav) | PASS |
| Router: keyboard Tab moves focus | PASS |
| Animations, SSR hydration, DI routes | PASS, no console errors |
| `@defer` page: viewport/idle/timer blocks hydrate after scroll | PASS (3/3 trigger sections) |
| Invalid route `/does-not-exist` → home | PASS |
| Desktop 1440×900: no horizontal overflow anywhere | PASS |
| Mobile 390×844 (`/`, `/crud`, `/forms`): no horizontal overflow | PASS |
| Mobile hamburger menu opens | PASS |
| Zero `pageerror`s across all pages | PASS |

Explained non-failures (3):
1. `signals: no console errors` / `zoneless: no console errors` — the only remaining
   console entry is `Failed to load resource: net::ERR_EMPTY_RESPONSE` for a
   `fonts.gstatic.com` woff2: this sandbox has no external network, so Google Fonts
   is unreachable. **Environmental, not an app bug.** The NG0600 errors (finding
   #16) are gone — verified absent.
2. `crud: delete task` in the generic suite — test-script bug (clicked the last
   row's delete; the new task is first). Focused retest: create → delete (confirm
   accepted) → task gone → delete toast shown → zero console errors.

Screenshots: `/tmp/e2e/home.png`, `/tmp/e2e/forms.png`, `/tmp/e2e/crud.png`,
`/tmp/e2e/mobile-home.png`, `/tmp/e2e/mobile-menu.png` (ephemeral, not committed).

---

## 5. Remaining limitations (accepted)

1. Deterministic opt-in 500/error simulation for the mock backend was not added —
   the random-failure demo mechanism was removed for determinism; a future UI
   toggle could reintroduce it intentionally.
2. 404/error-latency unit tests for the mock backend are pending.
3. Coverage for CRUD service/component, mock CRUD interceptor, and deferred
   lifecycle is thin; browser QA covers them functionally.
4. Full security verification is limited by the blocked `npm audit` endpoint
   (see §2) — advisories were checked manually instead.
5. Angular 18 is EOL (see §2) — upgrade to a supported major is recommended but
   out of scope for this audit.

---

## 6. Change summary

23 files changed (+210/−138), 5 new spec files, `docs/AUDIT.md` (this file).
`package-lock.json`: express 4.22.2 → 4.22.3 (qs 6.15.3 → 6.16.0 security fix) +
harmless `libc` field normalization. No commit, no push, no deploy.
