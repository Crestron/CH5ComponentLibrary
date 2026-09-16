import { Ch5LightBaseClass } from "../ch5-light-base/ch5-light-base-class";
import { Ch5SignalAttributeRegistry } from "../ch5-common/ch5-signal-attribute-registry";
import { ICh5ButtonListContractObj } from "../ch5-button-list/interfaces/t-for-ch5-button-list-contract";
import { Ch5ButtonBase } from "./ch5-button-base";

// The full-featured button. All shared behavior (properties, rendering,
// signal wiring, lifecycle) lives in Ch5ButtonBase - see ch5-button-base.ts
// and ch5-button.md for the full design reference. This class only supplies
// the concrete identity (ELEMENT_NAME / PRIMARY_CSS_CLASS) and the
// per-custom-element registration (observedAttributes, signal attribute
// types, the customElements.define call), mirroring the
// Ch5AdvancedButtonBase / Ch5AdvancedButton split. Update ch5-button.md
// alongside any behavior/API change made to the base class.
export class Ch5Button extends Ch5ButtonBase {

	//#region Constants

	public static readonly ELEMENT_NAME = 'ch5-button';
	public static readonly PRIMARY_CSS_CLASS = 'ch5-button';

	/**
	 * Observed attributes for ch5-button. Auto-generated from the FULL
	 * PROPERTY_SETTINGS on Ch5ButtonBase - single source of truth. A subclass
	 * that needs fewer attributes (e.g. Ch5SliderButton) builds its own smaller
	 * list the same way from its own PROPERTY_SETTINGS.
	 */
	private static readonly OBSERVED_ATTRIBUTES = Ch5ButtonBase.toObservedAttributeNames(Ch5ButtonBase.PROPERTY_SETTINGS);

	//#endregion

	//#region Static Methods

	public static registerCustomElement() {
		if (typeof window === "object"
			&& typeof window.customElements === "object"
			&& typeof window.customElements.define === "function"
			&& window.customElements.get(Ch5Button.ELEMENT_NAME) === undefined) {
			window.customElements.define(Ch5Button.ELEMENT_NAME, Ch5Button);
		}
	}

	/**
	 * Registers ch5-button's signal attributes with the global Ch5SignalAttributeRegistry
	 * so Ch5AugmentVarSignalsNames.differentiateTmplElemsAttrs can process join offsets
	 * in templates/subpages. Auto-generated from the full PROPERTY_SETTINGS (single
	 * source of truth - see Ch5ButtonBase.buildSignalAttributeRegistryEntries).
	 */
	public static registerSignalAttributeTypes(): void {
		Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(
			Ch5Button.ELEMENT_NAME,
			Ch5ButtonBase.buildSignalAttributeRegistryEntries(Ch5ButtonBase.PROPERTY_SETTINGS)
		);
	}

	public static get observedAttributes(): string[] {
		return [
			...Ch5LightBaseClass.LIGHT_BASE_OBSERVED_ATTRIBUTES,
			...Ch5Button.OBSERVED_ATTRIBUTES
		];
	}

	//#endregion

	//#region Component Lifecycle

	public constructor(buttonListContractObj?: ICh5ButtonListContractObj) {
		super(buttonListContractObj);
	}

	//#endregion
}

Ch5Button.registerCustomElement();
Ch5Button.registerSignalAttributeTypes();
