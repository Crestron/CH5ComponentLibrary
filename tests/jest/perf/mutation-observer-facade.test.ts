/**
 * Ch5MutationObserver facade — proves backward-compatibility with the old
 * constructor / observe / disconnectObserver API, AND that the pool win is
 * realised end-to-end (N facade instances still share ONE underlying
 * browser MutationObserver).
 *
 * BEFORE (master): `new Ch5MutationObserver(component)` created its own
 *   MutationObserver inside the constructor.
 * AFTER (this branch): the facade delegates to Ch5SharedMutationObserver,
 *   which lazily creates ONE underlying observer for all targets.
 *
 * The existing Ch5MutationObserver imports Ch5Common, which imports a
 * very large chunk of the library. To keep this test fast and isolated,
 * we don't import Ch5Common — we pass a minimal duck-typed stand-in
 * that satisfies the facade's only use of the element parameter
 * (`updateElementVisibility(boolean)`).
 */
import { Ch5MutationObserver } from '../../../src/ch5-common/ch5-mutation-observer';
import { Ch5SharedMutationObserver } from '../../../src/ch5-core/ch5-shared-mutation-observer';

interface FakeComponent {
  updateElementVisibility: jest.Mock;
}

const makeFakeComponent = (): FakeComponent => ({
  updateElementVisibility: jest.fn(),
});

const flushMicrotasks = (): Promise<void> =>
  new Promise<void>((resolve) => queueMicrotask(() => resolve()));

describe('Ch5MutationObserver facade — pooled delegation', () => {
  let observerCtorSpy: jest.Mock;
  let realCtor: typeof MutationObserver;

  beforeEach(() => {
    Ch5SharedMutationObserver._resetForTesting();
    realCtor = global.MutationObserver;
    observerCtorSpy = jest.fn();
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

  it('50 facade instances → 1 underlying MutationObserver (pre-refactor would have been 50)', () => {
    const targets: HTMLElement[] = [];
    for (let i = 0; i < 50; i++) {
      const el = document.createElement('div');
      document.body.appendChild(el);
      targets.push(el);
      const obs = new Ch5MutationObserver(makeFakeComponent() as unknown as never);
      obs.observe(el);
    }
    expect(observerCtorSpy).toHaveBeenCalledTimes(1);
    expect(Ch5SharedMutationObserver.getInstance()._underlyingObserverCount).toBe(1);
    expect(Ch5SharedMutationObserver.getInstance().size()).toBe(50);
  });

  it('disconnectObserver() removes the facade\'s targets but leaves siblings observed', () => {
    const elA = document.createElement('div');
    const elB = document.createElement('div');
    document.body.append(elA, elB);
    const obsA = new Ch5MutationObserver(makeFakeComponent() as unknown as never);
    const obsB = new Ch5MutationObserver(makeFakeComponent() as unknown as never);
    obsA.observe(elA);
    obsB.observe(elB);
    expect(Ch5SharedMutationObserver.getInstance().size()).toBe(2);

    obsA.disconnectObserver();
    expect(Ch5SharedMutationObserver.getInstance().size()).toBe(1);
    expect(Ch5SharedMutationObserver.getInstance().isObserving(elB)).toBe(true);
  });

  it('disconnectObserver() is idempotent — calling twice is a no-op', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const obs = new Ch5MutationObserver(makeFakeComponent() as unknown as never);
    obs.observe(el);
    obs.disconnectObserver();
    expect(() => obs.disconnectObserver()).not.toThrow();
  });

  it('dispatches visibility updates to the originating component, not its peers', async () => {
    const elA = document.createElement('div');
    const elB = document.createElement('div');
    document.body.append(elA, elB);
    const compA = makeFakeComponent();
    const compB = makeFakeComponent();
    new Ch5MutationObserver(compA as unknown as never).observe(elA);
    new Ch5MutationObserver(compB as unknown as never).observe(elB);

    elA.setAttribute('style', 'opacity: 0.5');
    await flushMicrotasks();

    expect(compA.updateElementVisibility).toHaveBeenCalled();
    expect(compB.updateElementVisibility).not.toHaveBeenCalled();
  });

  it('checkElementValidity still works (unchanged public static)', () => {
    expect(Ch5MutationObserver.checkElementValidity(document.body)).toBe(false);
    const ok = document.createElement('div');
    expect(Ch5MutationObserver.checkElementValidity(ok)).toBe(true);
    const swiper = document.createElement('div');
    swiper.classList.add('swiper-wrapper');
    expect(Ch5MutationObserver.checkElementValidity(swiper)).toBe(false);
  });
});
