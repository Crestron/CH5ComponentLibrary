/**
 * SharedResizeObserver — pool invariants, dispatch, and disposer behavior.
 *
 * BEFORE (master):
 *   • src/ch5-core/resize-observer.ts created a new browser ResizeObserver
 *     per call AND returned void — every caller leaked one observer with no
 *     disconnect path.
 *   • src/ch5-video-switcher/...:742 and src/ch5-signal-level-gauge/...:371
 *     each held their own per-instance ResizeObserver.
 *
 * AFTER (this branch):
 *   • All routes go through Ch5SharedResizeObserver — a singleton with ONE
 *     underlying browser ResizeObserver regardless of N callers.
 *   • The `resizeObserver()` utility returns a disposer so opt-in callers
 *     can finally clean up; the two direct consumers are migrated to use
 *     the disposer in their respective `removeEventListeners`.
 *
 * These tests run in JSDOM with a controllable ResizeObserver shim that
 * lets us fire synthetic entries on demand (see _helpers/fake-resize-observer).
 */
import { Ch5SharedResizeObserver } from '../../../src/ch5-core/ch5-shared-resize-observer';
import { resizeObserver as legacyResizeObserver } from '../../../src/ch5-core/resize-observer';
import {
  installFakeResizeObserver,
  FakeResizeObserverHandle,
} from '../_helpers/fake-resize-observer';

describe('Ch5SharedResizeObserver', () => {
  let fake: FakeResizeObserverHandle;

  beforeEach(() => {
    Ch5SharedResizeObserver._resetForTesting();
    fake = installFakeResizeObserver();
  });

  afterEach(() => {
    Ch5SharedResizeObserver._resetForTesting();
    fake.restore();
  });

  it('creates ONE underlying ResizeObserver for many targets', () => {
    const shared = Ch5SharedResizeObserver.getInstance();
    for (let i = 0; i < 30; i++) {
      const el = document.createElement('div');
      document.body.appendChild(el);
      shared.observe(el, () => undefined);
    }
    expect(fake.instances).toBe(1);
    expect(shared._underlyingObserverCount).toBe(1);
    expect(shared.size()).toBe(30);
  });

  it('routes entries to the right per-target callback', () => {
    const shared = Ch5SharedResizeObserver.getInstance();
    const a = document.createElement('div');
    const b = document.createElement('div');
    document.body.append(a, b);

    const cbA = jest.fn();
    const cbB = jest.fn();
    shared.observe(a, cbA);
    shared.observe(b, cbB);

    fake.fire(a, { width: 100, height: 50 });
    expect(cbA).toHaveBeenCalledTimes(1);
    expect(cbB).not.toHaveBeenCalled();
    const firstCall = cbA.mock.calls[0];
    expect(firstCall[0]).toBe(a);
    expect((firstCall[1] as ResizeObserverEntry).contentRect.width).toBe(100);

    fake.fire(b);
    expect(cbB).toHaveBeenCalledTimes(1);
  });

  it('observe() returns a disposer that unregisters exactly that target', () => {
    const shared = Ch5SharedResizeObserver.getInstance();
    const a = document.createElement('div');
    const b = document.createElement('div');
    document.body.append(a, b);

    const cbA = jest.fn();
    const cbB = jest.fn();
    const disposeA = shared.observe(a, cbA);
    shared.observe(b, cbB);

    expect(shared.size()).toBe(2);
    disposeA();
    expect(shared.size()).toBe(1);
    expect(shared.isObserving(a)).toBe(false);
    expect(shared.isObserving(b)).toBe(true);

    fake.fire(a);
    expect(cbA).not.toHaveBeenCalled();
    fake.fire(b);
    expect(cbB).toHaveBeenCalledTimes(1);
  });

  it('tears down the underlying observer when empty', () => {
    const shared = Ch5SharedResizeObserver.getInstance();
    const el = document.createElement('div');
    document.body.appendChild(el);
    const dispose = shared.observe(el, () => undefined);
    expect(shared._underlyingObserverCount).toBe(1);
    dispose();
    expect(shared._underlyingObserverCount).toBe(0);
  });

  it('ignores null targets gracefully', () => {
    const shared = Ch5SharedResizeObserver.getInstance();
    const dispose = shared.observe(null as unknown as Element, () => undefined);
    expect(typeof dispose).toBe('function');
    expect(() => dispose()).not.toThrow();
    expect(shared.size()).toBe(0);
  });

  it('returns a no-op disposer when ResizeObserver is unavailable', () => {
    // Tear down the singleton, remove the shim, then re-create the singleton.
    Ch5SharedResizeObserver._resetForTesting();
    fake.restore();
    const noSupport = Ch5SharedResizeObserver.getInstance();
    expect(noSupport.isSupported()).toBe(false);
    const dispose = noSupport.observe(document.createElement('div'), jest.fn());
    expect(typeof dispose).toBe('function');
    expect(noSupport.size()).toBe(0);
    // restore so the afterEach can run normally
    fake = installFakeResizeObserver();
  });
});

describe('legacy resizeObserver() utility — pooled, disposer-returning', () => {
  let fake: FakeResizeObserverHandle;

  beforeEach(() => {
    Ch5SharedResizeObserver._resetForTesting();
    fake = installFakeResizeObserver();
  });
  afterEach(() => {
    Ch5SharedResizeObserver._resetForTesting();
    fake.restore();
  });

  it('routes through the singleton — N calls, 1 underlying observer', () => {
    for (let i = 0; i < 10; i++) {
      const el = document.createElement('div');
      document.body.appendChild(el);
      legacyResizeObserver(el, () => undefined);
    }
    expect(fake.instances).toBe(1);
    expect(Ch5SharedResizeObserver.getInstance().size()).toBe(10);
  });

  it('returns a disposer that unregisters the caller', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const cb = jest.fn();
    const dispose = legacyResizeObserver(el, cb);
    fake.fire(el);
    expect(cb).toHaveBeenCalledTimes(1);
    dispose();
    fake.fire(el);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('still works for callers that ignore the disposer (back-compat)', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const cb = jest.fn();
    // Older call sites do exactly this — we just don't unregister.
    legacyResizeObserver(el, cb);
    fake.fire(el);
    expect(cb).toHaveBeenCalledTimes(1);
  });
});
