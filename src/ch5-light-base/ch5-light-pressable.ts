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

	// Target bounds for the pointermove hit-test. Read lazily on the first move
	// (a tap that never moves does no layout read); cleared on release.
	private _pressRect: DOMRect | null = null;

	// press / release events, created ONCE per instance (bubble so a consumer can
	// listen on the host custom element directly).
	private readonly _pressEvent: Event = new CustomEvent('press', { bubbles: true, cancelable: false });
	private readonly _releaseEvent: Event = new CustomEvent('release', { bubbles: true, cancelable: false });

	// Cached handlers (allocated once). up/leave/cancel share one release handler;
	// move releases when the pointer leaves the target bounds (touch - see above).
	private readonly _onPointerDown = () => this.setPressed(true);
	private readonly _onPointerUp = () => this.setPressed(false);
	private readonly _onPointerMove = (event: PointerEvent) => {
		const rect = this._pressRect ??= this._target.getBoundingClientRect();
		const x = event.clientX;
		const y = event.clientY;
		if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
			this.setPressed(false);
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
	public setPressed(value: boolean): void {
		if (value === this._pressed) { return; }
		this._pressed = value;
		if (value) { this._onPress(); } else { this._onRelease(); }
		if (this._onChange) { this._onChange(value); }
	}

	private _onPress(): void {
		this._attachReleaseListeners();
		this._addCssPressedClass();
		this._host.setAttribute(Ch5LightPressable.PRESSED_ATTRIBUTE, 'true');
		this._host.dispatchEvent(this._pressEvent);
	}

	private _onRelease(): void {
		this._detachReleaseListeners();
		this._pressRect = null;
		this._removeCssPressedClass();
		this._host.removeAttribute(Ch5LightPressable.PRESSED_ATTRIBUTE);
		this._host.dispatchEvent(this._releaseEvent);
	}

	private _attachReleaseListeners(): void {
		if (this._releaseListenersAttached) { return; }
		this._releaseListenersAttached = true;
		this._target.addEventListener('pointermove', this._onPointerMove);
		this._target.addEventListener('pointerup', this._onPointerUp);
		this._target.addEventListener('pointerleave', this._onPointerUp);
		this._target.addEventListener('pointercancel', this._onPointerUp);
	}

	private _detachReleaseListeners(): void {
		if (!this._releaseListenersAttached) { return; }
		this._releaseListenersAttached = false;
		this._target.removeEventListener('pointermove', this._onPointerMove);
		this._target.removeEventListener('pointerup', this._onPointerUp);
		this._target.removeEventListener('pointerleave', this._onPointerUp);
		this._target.removeEventListener('pointercancel', this._onPointerUp);
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
