# CH5 SOLID Upgrade — Phase 1 Migration Notes

Branch: `research/upgrade-ch5-for-solid`

This document captures the changes shipped in Phase 1 of the SOLID
upgrade. It is written for the engineering team — the same people who
authored the library — so it focuses on what changed, *why*, what
behaviour is preserved, and what the migration path looks like for
future phases.

---

## What shipped in Phase 1

| Change                                      | Surface                                   | Behaviour change | Test coverage |
|---------------------------------------------|-------------------------------------------|------------------|---------------|
| Jest harness alongside mocha + WCT          | `tests/jest/`, `jest.config.js`           | None (additive)  | n/a           |
| 0.5 ms → 500 ms typo                        | `src/ch5-list/ch5-list.ts:508`            | Fixed regression | Yes (AST scan)|
| Shared MutationObserver pool                | `src/ch5-core/ch5-shared-mutation-observer.ts` + facade refactor of `src/ch5-common/ch5-mutation-observer.ts` | None (facade preserved) | Yes (11 tests) |
| Shared ResizeObserver pool                  | `src/ch5-core/ch5-shared-resize-observer.ts` + utility refactor of `src/ch5-core/resize-observer.ts` | Disposer now returned | Yes (9 tests) |
| Direct ResizeObserver → pool migration      | `ch5-video-switcher`, `ch5-signal-level-gauge` | None (private fields) | Covered by pool tests |
| Language-change subscription leak fix       | `src/ch5-common/ch5-common.ts`            | Leak resolved    | Yes (4 tests) |
| Color-picker silent-catch fix               | `src/ch5-color-picker/color-picker.ts`    | Now logs failures | Yes (2 tests) |
| eslint: `no-explicit-any`, `no-console` → warn | `.eslintrc`                            | Warnings only    | n/a           |
| Dead tslint script removed                  | `package.json`                            | n/a              | n/a           |

Total: **31 Jest tests pass, 0 fail.** Library still type-checks
under `tsconfig.umd.json` (two pre-existing missing-module errors in
`src/_interfaces/index.ts` predate this branch and are out of scope).

---

## How to run the new test harness

```bash
npm run test:jest            # one-shot
npm run test:jest:watch      # watch mode while iterating
npm run test:jest:coverage   # with coverage report
```

The existing mocha (`npm run test:mocha`) and WCT (`npm run test:wct`)
suites are untouched. Jest tests live in `tests/jest/**/*.test.ts` and
do **not** pick up the existing `src/**/*.spec.ts` mocha files —
`testPathIgnorePatterns` in `jest.config.js` excludes them.

---

## The new observer pools

### Ch5SharedMutationObserver

```ts
import { Ch5SharedMutationObserver } from 'ch5-core/ch5-shared-mutation-observer';

const dispose = Ch5SharedMutationObserver
  .getInstance()
  .observe(target, config, (node, mutation) => { /* … */ });

// later — in disconnectedCallback or removeEventListeners
shared.unobserve(target);
// (the existing Ch5MutationObserver facade does this internally)
```

**Existing call sites need not change.** `Ch5MutationObserver` is now a
thin facade over the pool: `new Ch5MutationObserver(component)` still
works exactly as before, but all instances now share ONE underlying
browser MutationObserver. Verified by `tests/jest/perf/mutation-observer-facade.test.ts`.

### Ch5SharedResizeObserver

```ts
import { Ch5SharedResizeObserver } from 'ch5-core/ch5-shared-resize-observer';

const dispose = Ch5SharedResizeObserver
  .getInstance()
  .observe(target, (target, entry) => { /* … */ });

// later
dispose();
```

The legacy `resizeObserver(node, callback)` utility in
`src/ch5-core/resize-observer.ts` now delegates to the pool **and**
returns a disposer. Older callers that ignore the return value still
work and still benefit from pooling. The two direct
`new ResizeObserver(...)` users (`ch5-video-switcher`,
`ch5-signal-level-gauge`) are migrated to the pool.

### Why this matters

Before: N components meant N browser-level observers — each carrying a
callback closure, each firing on every relevant mutation/resize on its
own targets, each leaking if `disconnect()` wasn't called.

After: one shared observer per type, regardless of N. On a panel
running 50 components with the previous patterns, this drops 50
MutationObservers to 1.

---

## What you should know about the leak fix in `Ch5Common`

```ts
// new fields
private _languageChangeSubKey: string = '';        // bridge subscription key
private _baseClassSubscriptions: Subscription[] = []; // raw RxJS subs

// new in unsubscribeFromSignals()
if (this._languageChangeSubKey !== '') {
  const langSig = Ch5SignalFactory.getInstance()
    .getStringSignal(languageChangedSignalName);
  if (langSig !== null) langSig.unsubscribe(this._languageChangeSubKey);
  this._languageChangeSubKey = '';
}
for (let i = 0; i < this._baseClassSubscriptions.length; i++) {
  this._baseClassSubscriptions[i].unsubscribe();
}
this._baseClassSubscriptions = [];
```

Two patterns, **don't mix them**:

- **Bridge-mediated** subscriptions (anything via `Ch5Signal.subscribe`)
  return a string key. Track the key + the signal name, release with
  `signal.unsubscribe(key)`.
- **Raw RxJS** subscriptions (e.g. on a `Subject` directly) return an
  rxjs `Subscription`. Push it onto `_baseClassSubscriptions` to have it
  released automatically in `unsubscribeFromSignals()`.

Subclasses that override `unsubscribeFromSignals()` must call
`super.unsubscribeFromSignals()` — same as today.

---

## Regression guards baked into the test suite

These tests fail if the patterns they protect are re-introduced. They
serve as living documentation of the invariants this PR establishes.

- `tests/jest/perf/short-timeout.test.ts` — no `setTimeout/setInterval`
  with delay in `(0, 16)` ms.
- `tests/jest/perf/shared-mutation-observer.test.ts` —
  N targets → 1 underlying observer.
- `tests/jest/perf/mutation-observer-facade.test.ts` — 50 facade
  instances → 1 browser MutationObserver; cleanup is idempotent.
- `tests/jest/perf/shared-resize-observer.test.ts` — pool invariants;
  legacy utility routes through the pool; disposer behaviour.
- `tests/jest/leaks/language-subscription.test.ts` — base-class subs
  are released; the `_keepListeningOnSignalsAfterRemoval` flag does
  not pin the language sub.
- `tests/jest/leaks/color-picker-silent-catch.test.ts` — init failures
  emit a warning instead of being swallowed.

### Test isolation requirement

Tests that touch either pool **must** call the `_resetForTesting()` static
in `beforeEach`/`afterEach` to clear singleton state and (for the resize
pool) install/restore the JSDOM `ResizeObserver` shim. See the existing
tests for the template.

### Adding a new regression guard

For structural / source-text guards, use the AST helper:

```ts
import { findCalls, isCalleeNamed, getNumericLiteralArg, formatHits }
  from '../_helpers/ts-call-finder';

const hits = findCalls(call =>
  isCalleeNamed(call, 'doSuspiciousThing') &&
  /* … additional predicates … */
);
if (hits.length) throw new Error(`…\n${formatHits(hits)}`);
```

For runtime / behavioural guards, write a normal Jest test using JSDOM
plus the helpers in `tests/jest/_helpers/`.

---

## Explicitly out of scope for Phase 1

These appeared in the architecture review's recommendation list but
were *not* shipped in Phase 1. They are deferred to later phases per
the agreed scope. Doing them now without the test coverage they need
would have done more harm than good.

| Recommendation                                  | Why deferred                                                                                                                                 |
|-------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------|
| Unify `Ch5Common` and `Ch5BaseClass`            | Touches 47 component subclasses; needs the behavioural test backfill that is itself Phase 2 work.                                            |
| Virtualise the list family                      | A multi-week refactor of `ch5-list`, `ch5-spinner`, `ch5-button-list`, `ch5-subpage-reference-list`. Plan separately.                        |
| Replace `@raghavendradabbir/mycolorpicker`      | Requires sourcing a replacement and integration testing the picker UI. The silent-catch fix in this PR at least stops hiding init failures.  |
| Upgrade `swiper` 7 → 13, `hammerjs` → Pointer Events, `i18next` → 24, `ts-loader` → 9 | Each is a contained but real migration. Stage as a separate dependency-refresh PR.                                                           |
| Delete `bower.json` + one of the lockfiles      | Bower is still referenced by every `wct_tests/**/*.html` file. Removing it requires the WCT suite to be migrated first. yarn.lock is benign. |
| Backfill the ~70 stray `console.log` calls      | The eslint rule is now `warn`. Migrating to the existing `Ch5Logger` per file is a follow-up sweep.                                          |
| Pre-existing TS errors in `src/_interfaces/index.ts` | References to two `i-ch5-media-player-*-documentation` files that have never existed. Out of scope; predates this branch.                |

---

## Planned Phase 2 (maintainability focus)

Per the agreed split, Phase 2 will tackle maintainability:

1. Decompose `Ch5Common` into mixins / services (visibility, gestures,
   signals, i18n) using the existing test scaffolding plus the new
   Jest harness.
2. Pick one base class and stage the migration. The Phase 1 leak fix
   was deliberately written to be portable to either base.
3. Introduce the declarative attribute schema utility, applied to one
   or two small components as a proof point.
4. Migrate stray `console.log` to `Ch5Logger`; flip the eslint rule
   from `warn` to `error`.

Phase 3 will tackle the dependency refresh and list virtualisation.

---

## Reviewer's note

The discipline this PR tries to establish:

- **Every bug fix gets a test that fails without the fix.** The 0.5ms
  typo, the silent catch, the leak — all have proof tests, not just
  "trust me, this is better."
- **Every new infrastructure piece gets a pool/contract test.** The
  shared observers each have full test coverage independent of the
  facade refactor.
- **Static regression guards beat one-time fixes.** A passing
  `short-timeout.test.ts` is more durable than just changing one line.

The aim isn't to retro-test the whole library in one PR. It is to make
each future change cheaper than the last by leaving the right rails
behind.
