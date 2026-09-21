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
	 * When true (buttons inside a scrolling `ch5-button-list`), touch presses are swipe-aware:
	 * deferred briefly so a finger swipe scrolls instead of pressing. A tap or hold still
	 * presses; mouse/pen press instantly. Default false (standalone buttons press instantly).
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
	private readonly _onHoldTimer = () => { this._holdTimer = null; this._commitPress(); };

	// Quick-tap pulse: a synchronous press+release is invisible and its zero-width digital
	// pulse can be coalesced away, so a tap presses now and releases after TAP_MIN_PRESS.
	private static readonly TAP_MIN_PRESS = 150; // ms a quick tap stays pressed (visible + pulse width)
	private _tapReleaseTimer: number | null = null;
	private readonly _onTapReleaseTimer = () => { this._tapReleaseTimer = null; this.setPressed(false); };

	// press / release events, created once per instance (bubble to the host custom element).
	private readonly _pressEvent: Event = new CustomEvent('press', { bubbles: true, cancelable: false });
	private readonly _releaseEvent: Event = new CustomEvent('release', { bubbles: true, cancelable: false });

	// Cached handlers, allocated once. A pointercancel or the finger leaving the button goes
	// through `_cancel()` (clears the press, no release event) so a scroll/drag never selects it.
	private readonly _onPointerDown = (event: PointerEvent) => {
		// Swipe-aware touch defers the press so a finger swipe can scroll; others press instantly.
		if (this._swipeEnabled && event.pointerType === 'touch') {
			this._flushTapPulse(); // finish any still-running tap pulse so a rapid re-tap isn't dropped
			this._beginPending(event);
		} else {
			this.setPressed(true);
		}
	};
	private readonly _onPointerUp = () => {
		if (this._pending) { this._commitTap(); return; } // quick tap: lifted before the hold elapsed
		if (this._tapReleaseTimer !== null) { return; }   // tap pulse owns its own delayed release
		this.setPressed(false);
	};
	private readonly _onPointerCancel = () => {
		// Pending + cancel = a tap the browser cancelled instead of firing pointerup (a real swipe
		// was already dropped by _onPointerMove); pulse it so the click still registers.
		if (this._pending) { this._commitTap(); return; }
		if (this._tapReleaseTimer !== null) { return; }
		this._cancel();
	}
	private readonly _onPointerLeave = () => {
		if (this._programaticSetter) { return; }
		// Some panels report a tap's lift as pointerleave; still-pending means a tap (a real
		// drag-off already crossed the threshold and aborted).
		if (this._pending) { this._commitTap(); return; }
		if (this._tapReleaseTimer !== null) { return; } // tap pulse owns its own delayed release
		this.setPressed(false);
	};
	private readonly _onPointerMove = (event: PointerEvent) => {
		if (this._pending) {
			if (this._movedPastThreshold(event)) { this._abortPending(); } // moved past threshold -> swipe
			return;
		}
		if (this._programaticSetter) { return; }
		// Finger left the button bounds -> cancel (no click).
		const rect = this._pressRect ??= this._target.getBoundingClientRect();
		const x = event.clientX;
		const y = event.clientY;
		if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
			this._cancel();
		}
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
		this._flushTapPulse();
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
		if (value) { this._onPress(); } else { this._onRelease(false); }
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

	// Start the swipe window: record the start point, wire release listeners and arm the hold
	// timer, but show no press yet (move aborts, lift taps, holding commits the press).
	private _beginPending(event: PointerEvent): void {
		if (this._pending || this._pressed) { return; }
		this._pending = true;
		this._startX = event.clientX;
		this._startY = event.clientY;
		this._attachReleaseListeners();
		this._holdTimer = window.setTimeout(this._onHoldTimer, Ch5LightPressable.SWIPE_HOLD_TIMEOUT);
	}

	// Commit a held press: lock touch-action so a late scroll can't steal it, then press.
	private _commitPress(): void {
		this._clearHoldTimer();
		if (!this._pending) { return; }
		this._pending = false;
		this._target.style.touchAction = 'none';
		this.setPressed(true);
	}

	// Commit a quick tap: press now, release after TAP_MIN_PRESS so the state paints and the
	// pulse has width (a synchronous press+release is invisible). Release restores touch-action.
	private _commitTap(): void {
		this._clearHoldTimer();
		if (!this._pending) { return; }
		this._pending = false;
		this._target.style.touchAction = 'none';
		this.setPressed(true);
		this._tapReleaseTimer = window.setTimeout(this._onTapReleaseTimer, Ch5LightPressable.TAP_MIN_PRESS);
	}

	// Finish an in-flight tap pulse immediately so a rapid re-tap or teardown isn't blocked.
	private _flushTapPulse(): void {
		if (this._tapReleaseTimer !== null) {
			window.clearTimeout(this._tapReleaseTimer);
			this._tapReleaseTimer = null;
			this.setPressed(false);
		}
	}

	// Drop a deferred press without pressing (a swipe/scroll won the gesture).
	private _abortPending(): void {
		this._clearHoldTimer();
		if (!this._pending) { return; }
		this._pending = false;
		this._pressRect = null;
		this._detachReleaseListeners();
	}

	private _clearHoldTimer(): void {
		if (this._holdTimer !== null) {
			window.clearTimeout(this._holdTimer);
			this._holdTimer = null;
		}
	}

	// True once the finger has moved past the swipe threshold (a scroll, not a tap/hold).
	private _movedPastThreshold(event: PointerEvent): boolean {
		const dx = event.clientX - this._startX;
		const dy = event.clientY - this._startY;
		const threshold = Ch5LightPressable.SWIPE_MOVE_THRESHOLD;
		return dx * dx + dy * dy > threshold * threshold;
	}

	private _onPress(): void {
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
