/**
 * SharedMutationObserver — pool invariants and dispatch correctness.
 *
 * BEFORE (master): src/ch5-common/ch5-mutation-observer.ts created one
 * browser-level MutationObserver per component instance. On a panel with
 * N components, N MutationObservers ran simultaneously.
 *
 * AFTER (this branch): Ch5MutationObserver delegates to
 * Ch5SharedMutationObserver — a singleton with ONE underlying browser
 * MutationObserver regardless of N facade instances.
 *
 * These tests prove:
 *   1. N facade instances → 1 underlying browser MutationObserver.
 *   2. Per-target callback dispatch is correct under attribute mutations.
 *   3. unobserve(t) leaves other targets observed.
 *   4. The singleton tears down its underlying observer when empty.
 *
 * They run in JSDOM. JSDOM's MutationObserver fires asynchronously (just
 * like the browser), so we await microtasks before assertions.
 */
import { Ch5SharedMutationObserver } from '../../../src/ch5-core/ch5-shared-mutation-observer';

const flushMicrotasks = (): Promise<void> =>
  new Promise<void>((resolve) => queueMicrotask(() => resolve()));

describe('Ch5SharedMutationObserver', () => {
  let observerCtorSpy: jest.SpyInstance;
  let realCtor: typeof MutationObserver;

  beforeEach(() => {
    Ch5SharedMutationObserver._resetForTesting();
    realCtor = global.MutationObserver;
    observerCtorSpy = jest.fn();
    // Wrap MutationObserver so we can count instantiations
    (global as any).MutationObserver = class extends realCtor {
      constructor(cb: MutationCallback) {
        observerCtorSpy();
        super(cb);
      }
    };
  });

  afterEach(() => {
    Ch5SharedMutationObserver._resetForTesting();
    global.MutationObserver = realCtor;
  });

  it('creates ONE underlying MutationObserver regardless of how many targets are observed', () => {
    const shared = Ch5SharedMutationObserver.getInstance();
    const config: MutationObserverInit = { attributes: true, attributeFilter: ['style'] };
    const targets: HTMLDivElement[] = [];
    for (let i = 0; i < 50; i++) {
      const el = document.createElement('div');
      document.body.appendChild(el);
      targets.push(el);
      shared.observe(el, config, () => {});
    }
    expect(observerCtorSpy).toHaveBeenCalledTimes(1);
    expect(shared._underlyingObserverCount).toBe(1);
    expect(shared.size()).toBe(50);
  });

  it('dispatches mutations to the right per-target callback', async () => {
    const shared = Ch5SharedMutationObserver.getInstance();
    const a = document.createElement('div');
    const b = document.createElement('div');
    document.body.append(a, b);

    const cbA = jest.fn();
    const cbB = jest.fn();
    const config: MutationObserverInit = { attributes: true, attributeFilter: ['style'] };
    shared.observe(a, config, cbA);
    shared.observe(b, config, cbB);

    a.setAttribute('style', 'opacity: 0.5');
    await flushMicrotasks();

    expect(cbA).toHaveBeenCalledTimes(1);
    expect(cbB).not.toHaveBeenCalled();

    b.setAttribute('style', 'visibility: hidden');
    await flushMicrotasks();

    expect(cbA).toHaveBeenCalledTimes(1);
    expect(cbB).toHaveBeenCalledTimes(1);
  });

  it('unobserve removes one target without disturbing the others', async () => {
    const shared = Ch5SharedMutationObserver.getInstance();
    const a = document.createElement('div');
    const b = document.createElement('div');
    const c = document.createElement('div');
    document.body.append(a, b, c);

    const cbA = jest.fn();
    const cbB = jest.fn();
    const cbC = jest.fn();
    const config: MutationObserverInit = { attributes: true, attributeFilter: ['style'] };
    shared.observe(a, config, cbA);
    shared.observe(b, config, cbB);
    shared.observe(c, config, cbC);

    expect(shared.size()).toBe(3);
    shared.unobserve(b);
    expect(shared.size()).toBe(2);
    expect(shared.isObserving(a)).toBe(true);
    expect(shared.isObserving(b)).toBe(false);
    expect(shared.isObserving(c)).toBe(true);

    // After unobserve(b), only a and c should still notify.
    a.setAttribute('style', 'opacity: 0');
    b.setAttribute('style', 'opacity: 0');
    c.setAttribute('style', 'opacity: 0');
    await flushMicrotasks();

    expect(cbA).toHaveBeenCalledTimes(1);
    expect(cbB).not.toHaveBeenCalled();
    expect(cbC).toHaveBeenCalledTimes(1);
  });

  it('tears down the underlying observer when the last target is unobserved', () => {
    const shared = Ch5SharedMutationObserver.getInstance();
    const a = document.createElement('div');
    const b = document.createElement('div');
    document.body.append(a, b);

    const config: MutationObserverInit = { attributes: true };
    shared.observe(a, config, () => {});
    shared.observe(b, config, () => {});
    expect(shared._underlyingObserverCount).toBe(1);

    shared.unobserve(a);
    expect(shared._underlyingObserverCount).toBe(1); // b still observed
    shared.unobserve(b);
    expect(shared._underlyingObserverCount).toBe(0); // pool empty → torn down
  });

  it('observe() on the same target replaces the previous callback', async () => {
    const shared = Ch5SharedMutationObserver.getInstance();
    const a = document.createElement('div');
    document.body.appendChild(a);

    const first = jest.fn();
    const second = jest.fn();
    const config: MutationObserverInit = { attributes: true, attributeFilter: ['style'] };
    shared.observe(a, config, first);
    shared.observe(a, config, second);

    a.setAttribute('style', 'opacity: 0');
    await flushMicrotasks();

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
    expect(shared.size()).toBe(1);
  });

  it('ignores observe/unobserve calls with null targets', () => {
    const shared = Ch5SharedMutationObserver.getInstance();
    expect(() => shared.observe(null as unknown as Node, {}, () => {})).not.toThrow();
    expect(() => shared.unobserve(null as unknown as Node)).not.toThrow();
    expect(shared.size()).toBe(0);
  });

  it('routes subtree:true mutations to the ancestor callback', async () => {
    // Reviewer caught this: under subtree:true the browser reports the
    // deepest mutated node as `mutation.target`, but the caller registered
    // an ancestor. Dispatch must walk up to find a matching entry.
    const shared = Ch5SharedMutationObserver.getInstance();
    const root = document.createElement('section');
    const child = document.createElement('div');
    const grandchild = document.createElement('span');
    child.appendChild(grandchild);
    root.appendChild(child);
    document.body.appendChild(root);

    const cb = jest.fn();
    shared.observe(
      root,
      { attributes: true, attributeFilter: ['style'], subtree: true },
      cb,
    );

    grandchild.setAttribute('style', 'color: red');
    await flushMicrotasks();

    expect(cb).toHaveBeenCalledTimes(1);
    // The callback receives the ancestor (the registered node), not the deep target.
    expect(cb.mock.calls[0][0]).toBe(root);
    // The raw MutationRecord still carries the original deep target.
    const mutation = cb.mock.calls[0][1] as MutationRecord;
    expect(mutation.target).toBe(grandchild);
  });
});
