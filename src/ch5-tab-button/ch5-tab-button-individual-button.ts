import _ from "lodash";
import { Ch5ButtonListIndividualButtonBase } from "./../ch5-button-list/base-classes/ch5-button-list-individual-button-base";

export class Ch5TabButtonIndividualButton extends Ch5ButtonListIndividualButtonBase {

	//#region Variables

	public static ELEMENT_NAME = 'ch5-tab-button-individual-button';

	public primaryCssClass = 'ch5-tab-button-individual-button';

	//#endregion

	//#region Static Methods

	public static registerCustomElement() {
		if (typeof window === "object"
			&& typeof window.customElements === "object"
			&& typeof window.customElements.define === "function"
			&& window.customElements.get(Ch5TabButtonIndividualButton.ELEMENT_NAME) === undefined) {
			window.customElements.define(Ch5TabButtonIndividualButton.ELEMENT_NAME, Ch5TabButtonIndividualButton);
		}
	}

	//#endregion

}

Ch5TabButtonIndividualButton.registerCustomElement();