// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

/**
 * Per-target resize callback. `entry` is the raw ResizeObserverEntry.
 */
export type Ch5SharedResizeCallback = (target: Element, entry: ResizeObserverEntry) => void;

/**
 * Singleton ResizeObserver pool.
 *
 * Why this exists: callers previously did `new ResizeObserver(cb)` per
 * component (or worse, called a fire-and-forget helper that leaked one
 * ResizeObserver per call with no way to disconnect). On a panel with N
 * resize-aware components, that meant N ResizeObservers — each carrying
 * its own callback closure and lifecycle.
 *
 * This singleton wraps ONE underlying ResizeObserver and routes each
 * entry to a per-target callback. The native ResizeObserver already
 * supports both per-target observe() and per-target unobserve(), so this
 * pool is simpler than its MutationObserver cousin.
 *
 * Browser support: this requires the native global ResizeObserver. On
 * platforms where it's missing, the pool stays empty and observe() is a
 * no-op. (Callers who need the polyfill should load it before importing
 * this module.)
 */
export class Ch5SharedResizeObserver {
  private static _instance: Ch5SharedResizeObserver | null = null;

  private _observer: ResizeObserver | null = null;
  private readonly _callbacks = new Map<Element, Ch5SharedResizeCallback>();
  private readonly _supported: boolean;

  private constructor() {
    this._supported = typeof (globalThis as { ResizeObserver?: unknown }).ResizeObserver === 'function';
  }

  public get _underlyingObserverCount(): number {
    return this._observer ? 1 : 0;
  }

  public static getInstance(): Ch5SharedResizeObserver {
    if (!Ch5SharedResizeObserver._instance) {
      Ch5SharedResizeObserver._instance = new Ch5SharedResizeObserver();
    }
    return Ch5SharedResizeObserver._instance;
  }

  /** Test hook — drops the singleton and disconnects the underlying observer. */
  public static _resetForTesting(): void {
    if (Ch5SharedResizeObserver._instance) {
      Ch5SharedResizeObserver._instance._teardown();
    }
    Ch5SharedResizeObserver._instance = null;
  }

  /** True iff the runtime has a native ResizeObserver. */
  public isSupported(): boolean {
    return this._supported;
  }

  /**
   * Begin observing `target`. Returns a disposer that, when invoked,
   * unregisters this exact (target, callback) pair. Calling observe()
   * again on the same target replaces the previous callback.
   *
   * If the runtime lacks ResizeObserver the disposer is a no-op.
   */
  public observe(target: Element, callback: Ch5SharedResizeCallback): () => void {
    if (target == null) return () => undefined;
    if (!this._supported) return () => undefined;

    if (!this._observer) {
      this._observer = new ResizeObserver((entries) => this._dispatch(entries));
    }
    this._callbacks.set(target, callback);
    this._observer.observe(target);

    return () => this.unobserve(target);
  }

  /** Stop observing `target`. Other targets remain observed. */
  public unobserve(target: Element): void {
    if (target == null) return;
    if (!this._callbacks.delete(target)) return;
    if (!this._observer) return;
    this._observer.unobserve(target);
    if (this._callbacks.size === 0) {
      this._teardown();
    }
  }

  /** Diagnostics — number of currently observed targets. */
  public size(): number {
    return this._callbacks.size;
  }

  /** True iff `target` is currently registered. */
  public isObserving(target: Element): boolean {
    return this._callbacks.has(target);
  }

  private _dispatch(entries: ResizeObserverEntry[]): void {
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const cb = this._callbacks.get(entry.target);
      if (cb) cb(entry.target, entry);
    }
  }

  private _teardown(): void {
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
    this._callbacks.clear();
  }
}
