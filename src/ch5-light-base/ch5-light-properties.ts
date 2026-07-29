import { Ch5LightSignal, TCh5LightSignalType } from "./ch5-light-signal";

export interface ICh5LightPropertySettings {
	/** Property name (also the lowercase attribute name). */
	name: string;
	/** Default value used until an attribute / property assignment overrides it. */
	default: boolean | string | number;
	/**
	 * OPTIONAL metadata below — field names mirror `ICh5PropertySettings`
	 * (from `ch5-core/ch5-property.ts`) purely for familiarity/consistency.
	 * They are NOT consumed by the runtime store, so they add ZERO per-instance
	 * cost. Signal-related fields are intentionally omitted: the light family
	 * has no signal machinery.
	 */
	/** Optional value type hint: 'boolean' | 'enum' | 'string' | 'number'. */
	type?: string;
	/** Allowed values for enum-style properties (e.g. noshowtype modes). */
	enumeratedValues?: (boolean | string | number)[];
	/** Value applied when the attribute is present but empty. */
	valueOnAttributeEmpty?: boolean | string | number;
	/** Whether the value may be null / unset. */
	isNullable?: boolean;
	/** Whether the attribute should be removed when the value is null. */
	removeAttributeOnNull?: boolean;
	/** Bounds metadata for numeric properties. */
	numberProperties?: {
		min: number;
		max: number;
	};
}

/**
 * Declarative config for a single `receiveState*` signal-driven attribute.
 * Registering one of these lets `Ch5LightProperties` own the entire
 * subscribe/unsubscribe/apply lifecycle, so a component only supplies WHAT the
 * signal drives, not HOW subscriptions are managed.
 */
export interface ICh5LightSignalPropertySettings {
	/** Name of the receiveState* property, e.g. 'receiveStateType'. */
	name: string;
	/** Value type of the underlying Crestron signal. */
	signalType: TCh5LightSignalType;
	/**
	 * Host attribute the resolved value is written to (the SEPARATE styling
	 * channel the theme SCSS gives priority over the author's static attribute).
	 */
	dataAttribute: string;
	/** Normalizes/validates the raw signal value before it is written to `dataAttribute`. */
	resolve: (value: string | number | boolean) => string;
}

/**
 * Ultra-light property store for the "light" component family.
 *
 * It intentionally does NOT depend on Ch5Property or the full `Ch5Properties`
 * / lodash machinery. It is a plain key/value store with change detection
 * only, so the per-instance cost stays close to a bare object and the
 * performance gains of the light components are preserved. The optional
 * signal-property support below reuses the equally lightweight `Ch5LightSignal`
 * helper and stays fully lazy: nothing is allocated unless a component actually
 * registers a signal property AND a `receiveState*` name is set.
 */
export class Ch5LightProperties {

	private readonly _values: Record<string, boolean | string | number> = Object.create(null);

	// --- Signal-property support (opt-in, lazy) ------------------------------
	private _signals: Ch5LightSignal | null = null;
	private readonly _signalSettings: Record<string, ICh5LightSignalPropertySettings> = Object.create(null);
	private readonly _signalNames: Record<string, string> = Object.create(null);

	public constructor(settings: ICh5LightPropertySettings[]) {
		for (let i = 0; i < settings.length; i++) {
			const setting = settings[i];
			this._values[setting.name] = setting.default;
		}
	}

	/**
	 * Registers additional properties (with their defaults) on the SAME store
	 * after construction. Lets a derived component extend the base store with its
	 * own attributes without allocating a second store. Zero extra dependencies.
	 */
	public add(settings: ICh5LightPropertySettings[]): void {
		for (let i = 0; i < settings.length; i++) {
			const setting = settings[i];
			this._values[setting.name] = setting.default;
		}
	}

	/** Returns the current value of a property. */
	public get<T extends boolean | string | number>(name: string): T {
		return this._values[name] as T;
	}

	/**
	 * Sets a property value. `onChange` runs only when the value actually
	 * changes, so redundant DOM work is avoided.
	 */
	public set<T extends boolean | string | number>(name: string, value: T, onChange?: () => void): void {
		const currentValue = this._values[name];
		if (currentValue === value) {
			return;
		}

		let nextValue = value as boolean | string | number;
		const unsafeValue = value as unknown;
		// Defensive fallback for runtime nullish inputs from external callers.
		if ((unsafeValue === null || unsafeValue === undefined) && typeof currentValue === 'string') {
			nextValue = '';
			if (currentValue === nextValue) {
				return;
			}
		}

		this._values[name] = nextValue;
		if (onChange) {
			onChange();
		}
	}

	/**
	 * Stores a value WITHOUT invoking a change callback. Used during
	 * initialization so the caller can apply the handlers exactly once
	 * (mirrors the "bypass setters on init" pattern used by the light components).
	 */
	public setValue<T extends boolean | string | number>(name: string, value: T): void {
		this._values[name] = value;
	}

	// --- Signal-property API --------------------------------------------------
	// Generalizes the "receiveState* signal name -> data-signal-* channel"
	// pattern so a light component declares its signal-driven attributes once
	// (name / signalType / dataAttribute / resolve) instead of hand-writing a
	// subscribe/unsubscribe/apply method trio per attribute. All state (the
	// shared `Ch5LightSignal` helper, the registered settings, the current
	// signal names) lives here, so it is naturally shared by every property that
	// uses it and by every light component that adopts this store.

	/**
	 * Registers one or more signal-driven properties (with their config) on
	 * this store. Safe to call multiple times / after construction, mirroring
	 * `add()` for plain properties.
	 */
	public addSignalProperties(settings: ICh5LightSignalPropertySettings[]): void {
		for (let i = 0; i < settings.length; i++) {
			const setting = settings[i];
			this._signalSettings[setting.name] = setting;
			this._signalNames[setting.name] = '';
		}
	}

	/** Returns the current signal name assigned to a registered signal property. */
	public getSignalName(name: string): string {
		return this._signalNames[name] ?? '';
	}

	/**
	 * Sets the signal NAME for a registered signal property (i.e. what the
	 * component's `receiveStateX` setter receives). Tears down any previous
	 * subscription for this property, then either subscribes (when `host` is
	 * connected) or, when the name is cleared, removes the `dataAttribute`
	 * channel so the author's static attribute regains styling priority.
	 * No-op if `name` was never registered via `addSignalProperties`.
	 */
	public setSignalName(name: string, signalName: string, host: HTMLElement): void {
		const settings = this._signalSettings[name];
		if (!settings) {
			return;
		}
		const newValue = signalName ?? '';
		if (newValue === this._signalNames[name]) {
			return;
		}
		if (this._signals !== null) {
			this._signals.unsubscribe(this._signalNames[name]);
		}
		this._signalNames[name] = newValue;

		if (newValue) {
			if (host.isConnected) {
				this._subscribeOne(name, host);
			}
		} else if (host.hasAttribute(settings.dataAttribute)) {
			host.removeAttribute(settings.dataAttribute);
		}
	}

	/**
	 * (Re)subscribes every registered signal property that currently has a
	 * non-empty signal name. Intended to be called from a component's
	 * `connectedCallback` (directly, or via `Ch5LightBaseClass`), including on
	 * reconnect after `disconnectSignals()` tore the previous subscriptions down.
	 */
	public connectSignals(host: HTMLElement): void {
		for (const name in this._signalSettings) {
			if (this._signalNames[name]) {
				this._subscribeOne(name, host);
			}
		}
	}

	/**
	 * Releases every active signal subscription, keeping the signal names so a
	 * later reconnect can re-subscribe transparently. Intended to be called from
	 * a component's `disconnectedCallback`.
	 */
	public disconnectSignals(): void {
		if (this._signals !== null) {
			this._signals.unsubscribeAll();
		}
	}

	/** Subscribes a single registered signal property, applying its value via `resolve` + `dataAttribute`. */
	private _subscribeOne(name: string, host: HTMLElement): void {
		const settings = this._signalSettings[name];
		const signalName = this._signalNames[name];
		if (!settings || !signalName || (this._signals !== null && this._signals.isSubscribedTo(signalName))) {
			return;
		}
		(this._signals ??= new Ch5LightSignal()).subscribe<string | number | boolean>(
			signalName,
			settings.signalType,
			(value) => host.setAttribute(settings.dataAttribute, settings.resolve(value))
		);
	}
}
