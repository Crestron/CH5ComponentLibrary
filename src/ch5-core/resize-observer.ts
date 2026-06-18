// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5SharedResizeObserver } from "./ch5-shared-resize-observer";

/**
 * Observe `node` for size changes, invoking `callback` on every resize.
 *
 * Historically this function constructed a new browser-level
 * ResizeObserver per call AND returned `void`, so callers had no way to
 * disconnect — every invocation leaked one observer permanently. The
 * implementation now delegates to {@link Ch5SharedResizeObserver}, so
 * all calls share a single underlying observer.
 *
 * Callers that want to clean up should use the returned disposer in
 * their `disconnectedCallback()`. Older callers that ignore the return
 * value still benefit from the pool (one ResizeObserver instead of N)
 * but their registration persists for the lifetime of the page — that
 * leak is incremental rather than per-resize and should be fixed by
 * adopting the disposer.
 *
 * @returns a disposer that, when called, unregisters this callback.
 *
 * The `callback` is typed as `any` to preserve compatibility with the
 * historical signature — pre-existing callers pass handlers shaped like
 * `(event: Event) => void` and `() => void`, neither of which is the
 * spec'd `ResizeObserverCallback`. Tightening this is a separate cleanup.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resizeObserver(node: HTMLElement, callback: any): () => void {
    if (node == null) return () => undefined;
    return Ch5SharedResizeObserver.getInstance().observe(node, (_target, entry) => {
        callback([entry], Ch5SharedResizeObserver.getInstance() as unknown as ResizeObserver);
    });
}
