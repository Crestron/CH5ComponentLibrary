/**
 * Ultra-light, dependency-free press/release helper for the "light" family - the
 * counterpart of `Ch5Pressable` (which pulls in `Ch5Common` + RxJS, too heavy at
 * 1000+ instances). Plain DOM + a callback, no imports.
 *
 * Mirrors `Ch5Pressable`'s visible behaviour: a `pressed` boolean, the host
 * `pressed` attribute (pure-CSS `[pressed]` styling), bubbling `press`/`release`
 * events, an optional pressed CSS class, and an optional `onChange(pressed)`.
 *
 * Perf: one always-on `pointerdown` listener; move/up/leave/cancel listeners exist
 * only while a press is in flight; handlers and events allocated once.
 *
 * Release uses BOTH `pointerleave` (mouse: no capture, moves stop at the edge) and
 * a `pointermove` bounds hit-test (touch: implicit capture keeps delivering moves
 * and suppresses `pointerleave`, so the leave is detected here).
 */
export interface ICh5LightPressableOptions {
	/**
	 * Element the pressed CSS class is toggled on. Optional - omit it (or
	 * `cssPressedClass`) to rely purely on the host `pressed` attribute.
	 */
	cssTargetElement?: HTMLElement;
	/** Space-separated CSS class(es) added to `cssTargetElement` while pressed. */
	cssPressedClass?: string;
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

	// Target bounds for the pointermove hit-test. Read lazily on the first move
	// (a tap that never moves does no layout read); cleared on release.
	private _pressRect: DOMRect | null = null;

	// press / release events, created ONCE per instance (bubble so a consumer can
	// listen on the host custom element directly).
	private readonly _pressEvent: Event = new CustomEvent('press', { bubbles: true, cancelable: false });
	private readonly _releaseEvent: Event = new CustomEvent('release', { bubbles: true, cancelable: false });

	// Cached handlers (allocated once). up/leave share one release handler. cancel and
	// the move-out-of-bounds path go through `_cancel()`: a `pointercancel` (browser
	// hijacking the gesture for a scroll/pan inside a scrollable list) or the finger
	// leaving the button must NOT count as a click - the press is cleared but no `release`
	// event and no inline `onrelease` fire, so a scroll/drag never selects the item.
	private readonly _onPointerDown = () => this.setPressed(true);
	private readonly _onPointerUp = () => this.setPressed(false);
	private readonly _onPointerCancel = () => {
		this._cancel();
	}
	private readonly _onPointerLeave = () => {
		if (this._programaticSetter) {
			return;
		}
		this.setPressed(false);
	};
	private readonly _onPointerMove = (event: PointerEvent) => {
		if (this._programaticSetter) {
			return;
		}
		const rect = this._pressRect ??= this._target.getBoundingClientRect();
		const x = event.clientX;
		const y = event.clientY;
		if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
			this._cancel();
		}
	};

	/**
	 * @param host     carries the `pressed` attribute + emits `press`/`release`.
	 * @param target   element the pointer listeners attach to (default `host`); pass
	 *                 an inner `<button>` so a `disabled` (pointer-events:none) target
	 *                 blocks presses for free.
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
	}

	/** Current pressed state. */
	public get pressed(): boolean {
		return this._pressed;
	}

	/** Attach the single always-on `pointerdown` listener. No-op if already done. */
	public init(): void {
		if (this._pointerDownAttached) { return; }
		this._pointerDownAttached = true;
		this._target.addEventListener('pointerdown', this._onPointerDown);
	}

	/**
	 * Release if still pressed and remove all listeners. Safe if nothing was wired;
	 * `init()` may be called again afterwards (reconnect).
	 */
	public destroy(): void {
		if (this._pressed) { this.setPressed(false); }
		if (this._pointerDownAttached) {
			this._target.removeEventListener('pointerdown', this._onPointerDown);
			this._pointerDownAttached = false;
		}
		this._detachReleaseListeners();
	}

	/**
	 * Set the pressed state (also used by the pointer handlers). No-op when
	 * unchanged, so it's safe to call defensively (e.g. force-release on blur).
	 */
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

	// Abort a press without a click: clears the pressed state but suppresses the `release`
	// event and inline `onrelease`. Used when a scroll/pan steals the gesture (pointercancel
	// or the finger leaving the button), so a drag never selects the item.
	private _cancel(): void {
		if (!this._pressed) { return; }
		this._pressed = false;
		this._onRelease(true);
		if (this._onChange) { this._onChange(false); }
	}

	private _onPress(): void {
		this._attachReleaseListeners();
		this._addCssPressedClass();
		this._host.setAttribute(Ch5LightPressable.PRESSED_ATTRIBUTE, 'true');
		this._host.dispatchEvent(this._pressEvent);
		this._runInlineHandler('onpress');
	}

	private _onRelease(cancelled: boolean): void {
		this._detachReleaseListeners();
		this._pressRect = null;
		this._removeCssPressedClass();
		this._host.removeAttribute(Ch5LightPressable.PRESSED_ATTRIBUTE);
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

	private _addCssPressedClass(): void {
		const options = this._options;
		if (options && options.cssTargetElement && options.cssPressedClass) {
			const el = options.cssTargetElement;
			options.cssPressedClass.split(' ').forEach((cls) => { if (cls) { el.classList.add(cls); } });
		}
	}

	private _removeCssPressedClass(): void {
		const options = this._options;
		if (options && options.cssTargetElement && options.cssPressedClass) {
			const el = options.cssTargetElement;
			options.cssPressedClass.split(' ').forEach((cls) => { if (cls) { el.classList.remove(cls); } });
		}
	}
}
