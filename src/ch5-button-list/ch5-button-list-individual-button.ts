import _ from "lodash";
import { Ch5ButtonListIndividualButtonBase } from "./base-classes/ch5-button-list-individual-button-base";

export class Ch5ButtonListIndividualButton extends Ch5ButtonListIndividualButtonBase {

	//#region Variables

	public static ELEMENT_NAME = 'ch5-button-list-individual-button';
	public primaryCssClass = 'ch5-button-list-individual-button';

	//#endregion

	//#region Static Methods

	public static registerCustomElement() {
		if (typeof window === "object"
			&& typeof window.customElements === "object"
			&& typeof window.customElements.define === "function"
			&& window.customElements.get(Ch5ButtonListIndividualButton.ELEMENT_NAME) === undefined) {
			window.customElements.define(Ch5ButtonListIndividualButton.ELEMENT_NAME, Ch5ButtonListIndividualButton);
		}
	}

	//#endregion

}

Ch5ButtonListIndividualButton.registerCustomElement();