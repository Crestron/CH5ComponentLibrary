/**
 * Ultra-light, dependency-free press/release helper for the "light" family (the
 * counterpart of `Ch5Pressable`, too heavy at 1000+ instances). Plain DOM + a callback.
 *
 * Exposes a `pressed` boolean, the host `pressed` attribute (pure-CSS styling), bubbling
 * `press`/`release` events, an optional pressed CSS class and an optional `onChange`.
 *
 * Perf: one always-on `pointerdown` listener; release listeners exist only while a press
 * is in flight; handlers and events allocated once. Release is detected via `pointerleave`
 * (mouse) and a `pointermove` bounds hit-test (touch, which has implicit capture).
 */
export interface ICh5LightPressableOptions {
	/** Element the pressed CSS class is toggled on. Omit to rely on the host `pressed` attribute. */
	cssTargetElement?: HTMLElement;
	/** Space-separated CSS class(es) added to `cssTargetElement` while pressed. */
	cssPressedClass?: string;
	/**
	 * When true (buttons inside a scrolling `ch5-button-list`), presses are swipe-aware: the press
	 * is deferred briefly so a finger swipe (or a mouse click-drag) scrolls instead of triggering.
	 * A tap or a hold still presses. Default false (standalone buttons press instantly).
	 */
	enableSwipe?: boolean;
}

/** Notified with the new pressed state (`true` on press, `false` on release). */
export type TCh5LightPressableChangeHandler = (pressed: boolean) => void;

export class Ch5LightPressable {

	/** Host attribute reflecting the pressed state (for pure-CSS styling). */
	public static readonly PRESSED_ATTRIBUTE = 'pressed';

	/** Element the `pressed` attribute is set on and `press`/`release` fire from. */
	private readonly _host: HTMLElement;

	/** Element the pointer listeners are attached to (defaults to the host). */
	private readonly _target: HTMLElement;

	private readonly _options: ICh5LightPressableOptions | null;
	private readonly _onChange: TCh5LightPressableChangeHandler | null;

	private _pressed = false;
	private _pointerDownAttached = false;
	private _releaseListenersAttached = false;
	private _programaticSetter = false;

	// Target bounds for the pointermove hit-test; read lazily on first move, cleared on release.
	private _pressRect: DOMRect | null = null;

	// Swipe-aware deferred press (touch + enableSwipe only): a hold timer + move threshold
	// decide press-vs-scroll so a slight move keeps the press and a real swipe scrolls.
	private readonly _swipeEnabled: boolean;
	private _pending = false;              // finger down, press not yet committed
	private _holdTimer: number | null = null;
	private _startX = 0;
	private _startY = 0;
	private static readonly SWIPE_HOLD_TIMEOUT = 250;   // ms held still before the press commits
	private static readonly SWIPE_MOVE_THRESHOLD = 10;  // px of movement that turns the touch into a scroll
	private readonly _onTouchHoldTimer = () => { this._holdTimer = null; this._fingerIsDownActions(); };

	// Quick-tap pulse: a synchronous press+release is invisible and its zero-width digital
	// pulse can be coalesced away, so a tap presses now and releases after TAP_MIN_PRESS.
	private static readonly TAP_MIN_PRESS = 150; // ms a quick tap stays pressed (visible + pulse width)
	private _tapReleaseTimer: number | null = null;
	private readonly _onTapPulseEnd = () => { this._tapReleaseTimer = null; this.setPressed(false); };

	// press / release events, created once per instance (bubble to the host custom element).
	private readonly _pressEvent: Event = new CustomEvent('press', { bubbles: true, cancelable: false });
	private readonly _releaseEvent: Event = new CustomEvent('release', { bubbles: true, cancelable: false });

	// Pointer handlers, allocated once. Lift, cancel and leave all funnel through
	// `resetPressAndReleaseActions`, which turns a pending window into a tap, lets a running tap
	// pulse finish, or releases a committed press (a cancelled release clears it without a click).
	private readonly _onPointerDown = (event: PointerEvent) => {
		// Swipe-aware buttons defer the press for every pointer type so a finger swipe or a mouse
		// click-drag can scroll without triggering (matches Ch5Pressable); others press instantly.
		if (this._swipeEnabled) {
			this._endTapPulse(); // finish any still-running tap pulse so a rapid re-tap isn't dropped
			this._beginPendingPress(event);
		} else {
			this.setPressed(true);
		}
	};
	private readonly _onPointerUp = (event: PointerEvent) => this.resetPressAndReleaseActions(false, event);
	private readonly _onPointerCancel = () => this.resetPressAndReleaseActions(true);
	private readonly _onPointerLeave = (event: PointerEvent) => {
		// Ignore the synthetic leave a programmatic press can trigger.
		if (this._programaticSetter) { return; }
		this.resetPressAndReleaseActions(false, event);
	};
	private readonly _onPointerMove = (event: PointerEvent) => {
		// While pending, enough movement means the user is scrolling, not pressing.
		if (this._pending) {
			if (this._movedPastSwipeThreshold(event)) { this._abandonPendingPress(); }
			return;
		}
		if (this._programaticSetter) { return; }
		// A committed press cancels (no click) once the finger slides off the target.
		if (this._isOutsideTarget(event)) { this._cancel(); }
	};

	/**
	 * @param host     carries the `pressed` attribute + emits `press`/`release`.
	 * @param target   element the pointer listeners attach to (default `host`); an inner
	 *                 `<button>` lets a `disabled` (pointer-events:none) target block presses.
	 * @param options  optional pressed CSS-class feedback.
	 * @param onChange optional callback fired with the new pressed state.
	 */
	public constructor(
		host: HTMLElement,
		target?: HTMLElement,
		options?: ICh5LightPressableOptions,
		onChange?: TCh5LightPressableChangeHandler
	) {
		this._host = host;
		this._target = target ?? host;
		this._options = options ?? null;
		this._onChange = onChange ?? null;
		this._swipeEnabled = !!(options && options.enableSwipe);
	}

	/** Current pressed state. */
	public get pressed(): boolean {
		return this._pressed;
	}

	/** Attach the single always-on `pointerdown` listener. No-op if already done. */
	public init(): void {
		if (this._pointerDownAttached) { return; }
		this._pointerDownAttached = true;
		// Swipe-aware buttons allow browser scroll on a finger drag (inline style beats the
		// theme's non-important `touch-action: none`); standalone buttons keep the theme value.
		if (this._swipeEnabled) {
			this._target.style.touchAction = 'manipulation';
		}
		this._target.addEventListener('pointerdown', this._onPointerDown);
	}

	/** Release if still pressed and remove all listeners. Safe to re-init afterwards. */
	public destroy(): void {
		this._clearHoldTimer();
		this._endTapPulse();
		this._pending = false;
		if (this._pressed) { this.setPressed(false); }
		if (this._pointerDownAttached) {
			this._target.removeEventListener('pointerdown', this._onPointerDown);
			this._pointerDownAttached = false;
		}
		this._detachReleaseListeners();
	}

	/** Set the pressed state. No-op when unchanged, so it's safe to call defensively. */
	public setPressed(value: boolean, flag: boolean = false): void {
		this._programaticSetter = flag && value;
		if (value === this._pressed) { return; }
		this._pressed = value;
		if (value) { this._onHold(); } else { this._onRelease(false); }
		if (this._onChange) { this._onChange(value); }
		if (!value) {
			this._programaticSetter = false;
		}
	}

	// Abort a press without a click: clears the pressed state but suppresses the release event
	// / inline onrelease (used when a scroll/pan or drag-off steals the gesture).
	private _cancel(): void {
		if (!this._pressed) { return; }
		this._pressed = false;
		this._onRelease(true);
		if (this._onChange) { this._onChange(false); }
	}

	// Resolve a lift / cancel / leave. A still-open pending window becomes a quick tap ONLY on a
	// genuine lift that hasn't moved past the swipe threshold. A pointercancel (the browser claimed
	// the gesture for a scroll/pan) or a lift whose final position already moved is a swipe and is
	// dropped without a click - some panels (e.g. DGE1000) start scrolling and fire cancel/up before
	// pointermove ever crosses the threshold. A running tap pulse releases itself; otherwise the
	// committed press is released (cancelled = no click). Mirrors `Ch5Pressable.resetPressAndReleaseActions`.
	public resetPressAndReleaseActions(cancelled: boolean = false, event?: PointerEvent): void {
		if (this._pending) {
			if (cancelled || (event !== undefined && this._movedPastSwipeThreshold(event))) {
				this._abandonPendingPress();
			} else {
				this._commitAsTap();
			}
			return;
		}
		if (this._tapReleaseTimer !== null) { return; }
		if (cancelled) { this._cancel(); } else { this.setPressed(false); }
	}

	// --- Swipe-aware press arbitration (touch + enableSwipe only) --------------------
	// A finger-down opens a short "pending" window that resolves one of three ways:
	// a held press (hold timer), a quick tap (early lift) or a scroll (moved too far).

	// Open the pending window: watch for movement/lift and arm the hold timer, but show no press yet.
	private _beginPendingPress(event: PointerEvent): void {
		if (this._pending || this._pressed) { return; }
		this._pending = true;
		this._startX = event.clientX;
		this._startY = event.clientY;
		this._attachReleaseListeners();
		this._holdTimer = window.setTimeout(this._onTouchHoldTimer, Ch5LightPressable.SWIPE_HOLD_TIMEOUT);
	}

	// Held long enough: the finger is down, so commit a normal, sustained press.
	// Named to mirror `Ch5Pressable._fingerIsDownActions`.
	private _fingerIsDownActions(): void {
		if (this._closePendingWindow()) { this.setPressed(true); }
	}

	// Lifted before the hold elapsed: press now and auto-release after TAP_MIN_PRESS so a quick tap
	// still paints and its digital pulse has width (a synchronous press+release is invisible).
	private _commitAsTap(): void {
		if (!this._closePendingWindow()) { return; }
		this.setPressed(true);
		this._tapReleaseTimer = window.setTimeout(this._onTapPulseEnd, Ch5LightPressable.TAP_MIN_PRESS);
	}

	// Moved too far: the gesture is a scroll, so drop the deferred press without ever pressing.
	private _abandonPendingPress(): void {
		this._clearHoldTimer();
		if (!this._pending) { return; }
		this._pending = false;
		this._pressRect = null;
		this._detachReleaseListeners();
	}

	// Close the pending window and lock touch-action so a late scroll can't steal the press.
	// Returns false when nothing was pending (the caller then does nothing).
	private _closePendingWindow(): boolean {
		this._clearHoldTimer();
		if (!this._pending) { return false; }
		this._pending = false;
		this._target.style.touchAction = 'none';
		return true;
	}

	// End an in-flight tap pulse right now (a rapid re-tap or teardown shouldn't wait for it).
	private _endTapPulse(): void {
		if (this._tapReleaseTimer !== null) {
			window.clearTimeout(this._tapReleaseTimer);
			this._tapReleaseTimer = null;
			this.setPressed(false);
		}
	}

	private _clearHoldTimer(): void {
		if (this._holdTimer !== null) {
			window.clearTimeout(this._holdTimer);
			this._holdTimer = null;
		}
	}

	// True once the finger has moved past the swipe threshold (a scroll, not a tap/hold).
	private _movedPastSwipeThreshold(event: PointerEvent): boolean {
		const dx = event.clientX - this._startX;
		const dy = event.clientY - this._startY;
		const threshold = Ch5LightPressable.SWIPE_MOVE_THRESHOLD;
		return dx * dx + dy * dy > threshold * threshold;
	}

	// True when the pointer is outside the target's bounds (rect cached on first read).
	private _isOutsideTarget(event: PointerEvent): boolean {
		const rect = this._pressRect ??= this._target.getBoundingClientRect();
		const x = event.clientX;
		const y = event.clientY;
		return x < rect.left || x > rect.right || y < rect.top || y > rect.bottom;
	}

	// Press action (mirrors `Ch5Pressable._onHold`): wire release listeners, add feedback,
	// set the `pressed` attribute and dispatch `press`.
	private _onHold(): void {
		this._attachReleaseListeners();
		this._toggleCssPressedClass(true);
		this._host.setAttribute(Ch5LightPressable.PRESSED_ATTRIBUTE, 'true');
		this._host.dispatchEvent(this._pressEvent);
		this._runInlineHandler('onpress');
	}

	private _onRelease(cancelled: boolean): void {
		this._detachReleaseListeners();
		this._pressRect = null;
		this._toggleCssPressedClass(false);
		this._host.removeAttribute(Ch5LightPressable.PRESSED_ATTRIBUTE);
		// Re-allow scrolling for the next gesture (a committed press locked touch-action).
		if (this._swipeEnabled) {
			this._target.style.touchAction = 'manipulation';
		}
		if (cancelled) {
			return;
		}
		this._host.dispatchEvent(this._releaseEvent);
		this._runInlineHandler('onrelease');
	}

	// Evaluate the inline on<event> attribute like a native onclick (mirrors Ch5Pressable).
	private _runInlineHandler(attr: 'onpress' | 'onrelease'): void {
		const code = this._host.getAttribute(attr);
		if (code !== null) {
			try {
				// tslint:disable-next-line: no-eval
				eval(code);
			}
			// tslint:disable-next-line: no-empty
			catch (e) {
				// Ignore
			}
		}
	}

	private _attachReleaseListeners(): void {
		if (this._releaseListenersAttached) { return; }
		this._releaseListenersAttached = true;
		this._target.addEventListener('pointermove', this._onPointerMove);
		this._target.addEventListener('pointerup', this._onPointerUp);
		this._target.addEventListener('pointercancel', this._onPointerCancel);
		this._target.addEventListener('pointerleave', this._onPointerLeave);
	}

	private _detachReleaseListeners(): void {
		if (!this._releaseListenersAttached) { return; }
		this._releaseListenersAttached = false;
		this._target.removeEventListener('pointermove', this._onPointerMove);
		this._target.removeEventListener('pointerup', this._onPointerUp);
		this._target.removeEventListener('pointercancel', this._onPointerCancel);
		this._target.removeEventListener('pointerleave', this._onPointerLeave);
	}

	// Add/remove the optional pressed CSS class(es) on the configured target element.
	private _toggleCssPressedClass(add: boolean): void {
		const options = this._options;
		if (options && options.cssTargetElement && options.cssPressedClass) {
			const list = options.cssTargetElement.classList;
			options.cssPressedClass.split(' ').forEach((cls) => {
				if (cls) { if (add) { list.add(cls); } else { list.remove(cls); } }
			});
		}
	}
}
