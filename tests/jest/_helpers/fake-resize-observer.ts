/**
 * Controllable ResizeObserver shim for tests.
 *
 * JSDOM (as of v29) does not implement ResizeObserver. Production code uses
 * it through Ch5SharedResizeObserver, which checks `globalThis.ResizeObserver`
 * at construction time. This helper installs a fake on `globalThis` and lets
 * tests synchronously fire entries for any observed target.
 *
 * Usage:
 *
 *   let fake: FakeResizeObserverHandle;
 *   beforeEach(() => { fake = installFakeResizeObserver(); });
 *   afterEach(() => { fake.restore(); });
 *
 *   // After observe() calls have been made:
 *   fake.fire(targetElement);            // dispatches a synthetic entry
 *   expect(fake.instances).toBe(1);     // pool invariant
 */

export interface FakeResizeObserverHandle {
  /** How many fake ResizeObservers have been constructed since install. */
  instances: number;
  /** Synchronously fire a resize entry for `target` on every observer watching it. */
  fire(target: Element, contentRect?: Partial<DOMRectReadOnly>): void;
  /** Restore whatever was on globalThis.ResizeObserver before install. */
  restore(): void;
}

interface InternalObserver {
  cb: ResizeObserverCallback;
  watching: Set<Element>;
}

export function installFakeResizeObserver(): FakeResizeObserverHandle {
  const previous = (globalThis as { ResizeObserver?: unknown }).ResizeObserver;
  const observers: InternalObserver[] = [];

  class Fake {
    private readonly _entry: InternalObserver;
    constructor(cb: ResizeObserverCallback) {
      this._entry = { cb, watching: new Set() };
      observers.push(this._entry);
    }
    observe(target: Element): void {
      this._entry.watching.add(target);
    }
    unobserve(target: Element): void {
      this._entry.watching.delete(target);
    }
    disconnect(): void {
      this._entry.watching.clear();
    }
  }

  (globalThis as { ResizeObserver?: unknown }).ResizeObserver = Fake;

  return {
    get instances(): number {
      return observers.length;
    },
    fire(target: Element, contentRect: Partial<DOMRectReadOnly> = {}): void {
      const rect: DOMRectReadOnly = {
        x: 0, y: 0, width: 0, height: 0, top: 0, left: 0, right: 0, bottom: 0,
        toJSON() { return {}; },
        ...contentRect,
      } as DOMRectReadOnly;
      const entry: ResizeObserverEntry = {
        target,
        contentRect: rect,
        borderBoxSize: [],
        contentBoxSize: [],
        devicePixelContentBoxSize: [],
      };
      for (const o of observers) {
        if (o.watching.has(target)) {
          o.cb([entry], {} as ResizeObserver);
        }
      }
    },
    restore(): void {
      if (previous === undefined) {
        delete (globalThis as { ResizeObserver?: unknown }).ResizeObserver;
      } else {
        (globalThis as { ResizeObserver?: unknown }).ResizeObserver = previous;
      }
    },
  };
}
