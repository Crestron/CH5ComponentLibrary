export interface ICh5LightPropertySettings {
	/** Property name (also the lowercase attribute name). */
	name: string;
	/** Default value used until an attribute / property assignment overrides it. */
	default: boolean | string | number;
	/**
	 * OPTIONAL metadata mirroring `ICh5PropertySettings` (`ch5-core/ch5-property.ts`)
	 * for familiarity. The runtime store never reads it (ZERO per-instance cost);
	 * signal fields are omitted since the light family has no signal machinery.
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
 * Ultra-light property store for the "light" family: a plain key/value store with
 * change detection only. Free of Ch5Property, Ch5Signal, Ch5SignalFactory and lodash
 * (unlike the full `Ch5Properties`), keeping per-instance cost near a bare object.
 */
export class Ch5LightProperties {

	private readonly _values: Record<string, boolean | string | number> = Object.create(null);

	public constructor(settings: ICh5LightPropertySettings[]) {
		for (let i = 0; i < settings.length; i++) {
			const setting = settings[i];
			this._values[setting.name] = setting.default;
		}
	}

	/**
	 * Registers more properties (with defaults) on the SAME store post-construction,
	 * letting a derived component extend the base store without a second allocation.
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
	 * Sets a property value. `onChange` fires only on an actual change (avoiding
	 * redundant DOM work) and receives the PREVIOUS value, so callers keyed by the old
	 * value (e.g. to unsubscribe) can accept the parameter instead of shadowing it.
	 * Callers that don't need it can pass a zero-arg callback (`() => this.handleX()`),
	 * since TypeScript lets a shorter function satisfy a wider callback type.
	 */
	public set<T extends boolean | string | number>(name: string, value: T, onChange?: (oldValue: T) => void): void {
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
			onChange(currentValue as T);
		}
	}

	/**
	 * Stores a value WITHOUT firing a change callback. Used at init (the "bypass
	 * setters on init" pattern) so the caller applies the handlers exactly once.
	 */
	public setValue<T extends boolean | string | number>(name: string, value: T): void {
		this._values[name] = value;
	}
}
