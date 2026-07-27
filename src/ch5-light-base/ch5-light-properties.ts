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
 * Ultra-light property store for the "light" component family.
 *
 * It intentionally does NOT depend on Ch5Property, Ch5Signal, Ch5SignalFactory
 * or lodash (unlike the full `Ch5Properties`). It is a plain key/value store with
 * change detection only, so the per-instance cost stays close to a bare object
 * and the performance gains of the light components are preserved.
 */
export class Ch5LightProperties {

	private readonly _values: Record<string, boolean | string | number> = {};

	public constructor(settings: ICh5LightPropertySettings[]) {
		for (let i = 0; i < settings.length; i++) {
			this._values[settings[i].name] = settings[i].default;
		}
	}

	/**
	 * Registers additional properties (with their defaults) on the SAME store
	 * after construction. Lets a derived component extend the base store with its
	 * own attributes without allocating a second store. Zero extra dependencies.
	 */
	public add(settings: ICh5LightPropertySettings[]): void {
		for (let i = 0; i < settings.length; i++) {
			this._values[settings[i].name] = settings[i].default;
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
		if (this._values[name] !== value) {
			this._values[name] = value;
			if (onChange) {
				onChange();
			}
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
}
