// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

/**
 * Per-target mutation callback. `mutation` is the raw MutationRecord that
 * triggered dispatch, so callers can inspect attributeName, oldValue, etc.
 */
export type Ch5SharedMutationCallback = (target: Node, mutation: MutationRecord) => void;

interface Entry {
  config: MutationObserverInit;
  callback: Ch5SharedMutationCallback;
}

/**
 * Singleton MutationObserver pool.
 *
 * Why this exists: the original Ch5MutationObserver class created one
 * browser-level MutationObserver per component instance. On a panel running
 * 50+ components, that's 50+ observer callbacks firing on every relevant
 * mutation. This class collapses that to a single underlying observer that
 * dispatches to per-target callbacks.
 *
 * Model: one `MutationObserver` instance watches every registered target.
 * Each target stores its own config + callback. Mutations are routed to
 * the callback whose registered target is `mutation.target` OR an
 * ancestor of it. Ancestor matching is what makes `subtree: true`
 * configurations work correctly — the browser reports the deepest
 * affected node, but the caller registered an ancestor.
 *
 * `unobserve(target)` removes that target without disturbing the others —
 * MutationObserver itself has no per-target unobserve API, so we
 * re-build the observation set whenever a target leaves.
 *
 * Lifecycle: the underlying observer is created lazily on the first
 * `observe()` call. It is disposed when the last target is removed; the
 * next `observe()` will recreate it.
 *
 * Concurrency: not relevant — the DOM API is single-threaded.
 */
export class Ch5SharedMutationObserver {
  private static _instance: Ch5SharedMutationObserver | null = null;

  private _observer: MutationObserver | null = null;
  private readonly _entries = new Map<Node, Entry>();

  // Test hook: number of underlying MutationObservers (0 or 1).
  // Real callers never need this; tests use it to prove pool invariants.
  public get _underlyingObserverCount(): number {
    return this._observer ? 1 : 0;
  }

  public static getInstance(): Ch5SharedMutationObserver {
    if (!Ch5SharedMutationObserver._instance) {
      Ch5SharedMutationObserver._instance = new Ch5SharedMutationObserver();
    }
    return Ch5SharedMutationObserver._instance;
  }

  /**
   * Test hook — drops the singleton and disconnects the underlying observer.
   * Production code never calls this; tests use it to isolate state.
   */
  public static _resetForTesting(): void {
    if (Ch5SharedMutationObserver._instance) {
      Ch5SharedMutationObserver._instance._teardown();
    }
    Ch5SharedMutationObserver._instance = null;
  }

  /**
   * Begin observing `target` with `config`. The callback fires for every
   * mutation that matches `config`. Calling `observe()` again for the same
   * target replaces the previous callback/config.
   */
  public observe(target: Node, config: MutationObserverInit, callback: Ch5SharedMutationCallback): void {
    if (target == null) return;
    this._entries.set(target, { config, callback });
    if (!this._observer) {
      this._observer = new MutationObserver((mutations) => this._dispatch(mutations));
    }
    this._observer.observe(target, config);
  }

  /**
   * Stop observing `target`. Other targets remain observed.
   *
   * Note: MutationObserver has no per-target unobserve. We `disconnect()`
   * the underlying observer and re-`observe()` every remaining target
   * under its original config. For typical CH5 usage (<100 components)
   * this is cheap and only runs on disconnect, not every mutation.
   */
  public unobserve(target: Node): void {
    if (target == null) return;
    if (!this._entries.delete(target)) return;
    if (!this._observer) return;
    if (this._entries.size === 0) {
      this._teardown();
      return;
    }
    this._observer.disconnect();
    const obs = this._observer;
    this._entries.forEach((entry, node) => {
      obs.observe(node, entry.config);
    });
  }

  /** Diagnostics — number of currently observed targets. */
  public size(): number {
    return this._entries.size;
  }

  /** True iff `target` is currently registered. */
  public isObserving(target: Node): boolean {
    return this._entries.has(target);
  }

  private _dispatch(mutations: MutationRecord[]): void {
    for (const m of mutations) {
      // First try the exact target. Fast path: subtree:false callers and
      // subtree:true callers where the mutation happens to land on the
      // registered ancestor itself.
      const direct = this._entries.get(m.target);
      if (direct) {
        direct.callback(m.target, m);
        continue;
      }
      // Walk up the ancestor chain. This is what makes subtree:true work
      // correctly under the pool — the browser reports the deepest node,
      // but the caller observed an ancestor.
      let node: Node | null = m.target.parentNode;
      while (node !== null) {
        const entry = this._entries.get(node);
        if (entry) {
          entry.callback(node, m);
          break;
        }
        node = node.parentNode;
      }
    }
  }

  private _teardown(): void {
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
    this._entries.clear();
  }
}
