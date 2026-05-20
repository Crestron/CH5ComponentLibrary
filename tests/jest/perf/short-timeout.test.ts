/**
 * Regression guard — no setTimeout / setInterval with a sub-frame delay.
 *
 * BEFORE (master): src/ch5-list/ch5-list.ts:508 had `setTimeout(..., 0.5)` —
 * almost certainly a typo for 500. A 0.5 ms delay collapses to the next
 * macrotask, defeating the debounce and forcing a synchronous resize on
 * every viewport-change event.
 *
 * AFTER (this branch): the typo is fixed, and this test prevents another
 * one from creeping back in.
 *
 * Threshold: 0 < delay < 16. Reasoning:
 *   • `setTimeout(fn, 0)` is the standard "yield to the next macrotask" idiom
 *     and is allowed. (Browsers clamp it to ≥ 1ms anyway.)
 *   • Anything strictly between 0 and one frame (16ms ≈ 60Hz) is almost
 *     always a typo or a misunderstanding of how debouncing works.
 *   • For microtask deferral inside a Promise chain, use queueMicrotask().
 *     For next-frame work, use requestAnimationFrame().
 *
 * Identifier delays (e.g. `setTimeout(fn, TIMEOUT_MS)`) are NOT flagged
 * here — those have to be checked at the value site, not the call site.
 */
import {
  findCalls,
  isCalleeNamed,
  getNumericLiteralArg,
  formatHits,
} from '../_helpers/ts-call-finder';

const MIN_SAFE_DELAY_MS = 16;
const TIMER_FNS = ['setTimeout', 'setInterval'] as const;

describe('Performance guard — no sub-frame setTimeout/setInterval', () => {
  it(`flags every {setTimeout, setInterval}(..., n) where 0 < n < ${MIN_SAFE_DELAY_MS}`, () => {
    const hits = findCalls((call) => {
      if (!TIMER_FNS.some((n) => isCalleeNamed(call, n))) return false;
      const delay = getNumericLiteralArg(call, 1);
      // delay === 0 is the standard macrotask-yield idiom; allow it.
      return delay !== undefined && delay > 0 && delay < MIN_SAFE_DELAY_MS;
    });

    if (hits.length) {
      throw new Error(
        `Found ${hits.length} sub-frame timer call(s) (< ${MIN_SAFE_DELAY_MS}ms).\n` +
          `Sub-frame delays defeat their own debounce and force sync work on the next tick.\n` +
          `For microtask deferral use queueMicrotask(). For next-frame use requestAnimationFrame().\n\n` +
          formatHits(hits),
      );
    }
    expect(hits).toEqual([]);
  });
});
