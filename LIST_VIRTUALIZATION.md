# DOM Weight & List Virtualisation

> Companion analysis to the CH5 architecture review.
> Branch: `research/upgrade-ch5-for-solid`. Phase 1 has shipped the
> rails (test harness, shared observers, leak fixes) that make this
> work safe to undertake. This document is the case for Phase 2/3
> picking it up.

---

## The finding, restated

Every list-family component in CH5 renders **every item to the DOM**,
regardless of viewport. There is no virtualisation, no windowing, no
node recycling. A 1,000-item list creates 1,000 DOM nodes — for a panel
that, at any moment, can see maybe 6–10 of them.

This was called out as the **#1 critical performance finding** in the
architecture review — the single biggest perf cliff on the deployment
target.

### Affected components

| File                                                          |   LOC | What it does                       |
|---------------------------------------------------------------|------:|------------------------------------|
| `src/ch5-list/ch5-list.ts` + `ch5-list-template.ts`           | ~3,400 | Generic list                       |
| `src/ch5-button-list/base-classes/ch5-button-list-base.ts`    | 2,755 | Button list                        |
| `src/ch5-subpage-reference-list/ch5-subpage-reference-list.ts`| 2,062 | Subpage-instantiating list         |
| `src/ch5-spinner/ch5-spinner.ts`                              | 1,796 | Wheel picker                       |

### Hot evidence

- **`ch5-list-template.ts:257–268`**
  `while (index < itemsToShowNrOnFirstRender) { listFragment.appendChild(...); }`
  then one bulk `element.appendChild(listFragment)`. The fragment is a
  batch insert, but the loop materialises *all N* template instances.
  No window.
- **`ch5-spinner.ts:1452–1483`** — `repaint()` removes every child and
  recreates every child on each pass. Not partial updates — full
  teardown/rebuild.
- **`ch5-list-buffered-items.ts`** — the name *sounds* like
  virtualisation but it's only prefetch *data* caching. The DOM still
  gets every row at init.

---

## Why it hurts specifically on Crestron panels

On the desktop you can paper over a lot of DOM weight — Chrome, beefy
CPU, 16 GB RAM, a GPU, modern compositing. On a panel:

- **Memory is tight.** Each DOM node carries layout boxes, style
  cascades, event-target slots, custom-element internals. A
  `<ch5-button>` with modes/labels/gestures is *not* a 200-byte object —
  closer to several KB. 1,000 buttons = several MB of resident DOM,
  on a device that may only have a few hundred MB free.
- **Layout cost is O(N).** Every reflow walks the tree. Adding 1,000
  items doesn't just cost N at insert — it costs N on every subsequent
  style change, attribute mutation, or resize. The
  `getBoundingClientRect()` calls in `ch5-list-template.ts:646–676`
  get more expensive with every item.
- **First paint is blocked.** Building N nodes synchronously in
  `connectedCallback` means the panel shows nothing until the loop
  finishes. On slow silicon this is the difference between "instant"
  and "did it crash?"
- **No GPU bailout.** Desktop browsers offload scrolling and offscreen
  layers to the GPU. Many panels do not. The cost is paid by the CPU,
  on a single thread, while the same thread is also handling signal
  traffic from the control system.

The combination — fixed RAM budget, weak/no GPU, single thread shared
with signal bus, the user's expectation that "panel = instant" — is
why virtualisation is non-negotiable here, even though desktop apps
regularly get away without it.

---

## What virtualisation means here, concretely

A virtualised list keeps the DOM **small and roughly constant**
regardless of `size`. Two patterns work:

1. **Windowing.** Render only `visibleCount + buffer` rows. As the
   user scrolls, recycle the off-screen rows: change their content +
   key rather than destroying and creating. The DOM stays at ~20 nodes
   whether the list has 100 items or 100,000.
2. **Sliding viewport with spacers.** Two empty `<div>` spacers above
   and below the rendered window simulate full scroll height. The
   browser scrollbar feels correct; only the active window is real.

For CH5 specifically the right answer is **windowing with recycling**,
because:

- Items are custom elements with their own state — destroying them on
  every scroll is expensive (more than recycling).
- Subpage-reference-list especially instantiates whole *subtrees* per
  item — those should absolutely be recycled.

The interface ends up looking roughly like:

```ts
class Ch5VirtualList {
  private _windowSize: number;       // visible + buffer
  private _pool: HTMLElement[];      // recycled item nodes
  private _scrollOffset: number;
  private _itemHeight: number;       // measured once

  private renderWindow(startIndex: number) {
    for (let i = 0; i < this._windowSize; i++) {
      const node = this._pool[i];                 // reuse, don't recreate
      this.bindItem(node, this.data[startIndex + i]);
      node.style.transform =
        `translateY(${(startIndex + i) * this._itemHeight}px)`;
    }
  }
}
```

### What's hard about it

The recycling itself is straightforward. The hard parts:

1. **Variable item heights.** Templates that produce different-height
   items break the fixed-stride assumption. Either constrain to
   uniform heights, or maintain a measured-height map with binary
   search.
2. **Focus and selection.** Recycling a node that has focus or is
   currently part of a gesture is a footgun. The windowing layer
   needs to suspend recycling while a node is "live."
3. **Signal subscriptions.** Each item's signal subscriptions need to
   be **unbound on recycle, rebound to the new data** — otherwise the
   recycled node fires the wrong handler. This is where the Phase 1
   shared-observer work matters: the cleanup discipline already
   installed is exactly the discipline a recycling list needs.
4. **Behavioural parity.** Today's tests don't validate that "item at
   index 547 has the right state when scrolled to" — because the DOM
   has the answer trivially. Virtualisation breaks that assumption;
   new tests are needed that prove **scroll → render → bind**
   correctness.

---

## Why we didn't do it in Phase 1

Phase 1 was scoped as "performance-focused quick wins" — and
virtualisation is none of those things. A faithful virtualisation
pass on the list family is a 2–4 week project:

- Touches 4 large components, each 2K–3K LOC.
- Requires behavioural tests for scroll/recycle correctness that don't
  exist today (and which Phase 1's Jest harness was a prerequisite
  for).
- Touches gesture handling (swipe-to-scroll inertia, drag-to-reorder)
  which is the most fragile part of these components.
- Risks regressions in `ch5-subpage-reference-list`, which is widely
  used in real customer projects.

The Phase 1 shared observers, the leak fix, the Jest harness, the AST
scanner — those are the *rails* virtualisation needs to land safely.
Without them, a virtualisation refactor is a 2-month debugging session
chasing mysterious leaks in production. With them, it's a contained
2–4 week project with a clear "this passes its tests" definition of
done.

---

## Proposed sequencing for Phase 2 / Phase 3

Roughly in order:

1. **Build a benchmark harness first.** A Jest test that asserts
   "rendering `size=1000` produces ≤ K DOM nodes." Before any
   virtualisation, this test fails on master and tells you exactly
   how much you've shaved as you implement. Same pattern as the
   regression guards already in `tests/jest/perf/`.

2. **Build `Ch5VirtualList` as a new sibling component** — not a
   refactor of `Ch5List`. Lets the pattern be proved end-to-end
   without risking the existing surface. Behavioural tests live
   alongside it.

3. **Migrate the smallest list first** — probably `ch5-spinner`
   (~1,800 LOC, fixed height, single column, narrow gesture surface).
   Get that production-quality before touching anything bigger.

4. **Then `ch5-list`**, with the existing component kept as
   `Ch5ListLegacy` for one release while integrators migrate.

5. **`ch5-button-list` and `ch5-subpage-reference-list` last** —
   they're the most complex and benefit most from the patterns
   already established by then.

---

## Pre-flight checklist before starting Phase 2

These are the questions worth resolving with the team before any code
gets written:

- **Uniform vs variable item heights?** If we can constrain real-world
  usage to uniform heights, the implementation is dramatically simpler
  and faster. Audit existing customer projects to find out.
- **What's the worst-case `size` we need to support gracefully?**
  Defines the test target. 1k, 10k, 100k?
- **Buffer size policy.** How many rows above/below the viewport
  should be pre-rendered? Affects perceived smoothness vs. memory.
- **Recycling vs full re-render on data change.** If `receiveStateData`
  changes wholesale, do we recycle or rebuild? Recycling preserves
  scroll position; rebuild is simpler.
- **API surface compatibility.** Can we keep `<ch5-list>` exactly as
  it is today and have it be virtualised internally? Or do we need a
  new tag (`<ch5-list-virtual>`) and a migration window?
- **Integration with the existing template system.** `processTemplate`
  in `ch5-list-template.ts` runs per-item logic that may not be
  recyclable as-is. What is its actual surface area?

---

## Related Phase 1 deliverables that this work depends on

These are already in `research/upgrade-ch5-for-solid` and serve as
the foundation:

- `tests/jest/` — the Jest harness this work's tests will live in.
- `tests/jest/_helpers/ts-call-finder.ts` — AST-level regression
  guards. Useful for a guard like "no DOM node creation in a tight
  loop without bounds."
- `src/ch5-core/ch5-shared-mutation-observer.ts` and
  `ch5-shared-resize-observer.ts` — observer pools. A virtualised
  list with N recycled items needs the resize observer to be a pool;
  otherwise the savings on item nodes are eaten by per-item
  observers.
- `src/ch5-common/ch5-common.ts` subscription-discipline pattern
  (`_languageChangeSubKey` + `_baseClassSubscriptions[]`) — the
  template for clean subscribe/unsubscribe lifecycles that recycling
  requires.

See `MIGRATION.md` for the full Phase 1 inventory.
