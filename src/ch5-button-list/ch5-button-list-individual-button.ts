import _ from "lodash";
import { Ch5ButtonListIndividualButtonBase } from "./base-classes/ch5-button-list-individual-button-base";
import { Ch5ButtonList } from "./ch5-button-list";

export class Ch5ButtonListIndividualButton extends Ch5ButtonListIndividualButtonBase {

	//#region Variables

	public static ELEMENT_NAME = 'ch5-button-list-individual-button';

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

	/**
	 * Called when the Ch5ButtonListLabel component is first connected to the DOM
	 */
	public connectedCallback() {
		const _parentCh5ButtonList = this.getParentButton();
		if (_.isNil(_parentCh5ButtonList)) {
			throw new Error(`Invalid parent element for ch5-button-list-individual-button.`);
		}
		super.connectedCallback();
		this.parentComponent = _parentCh5ButtonList;
	}

	public getParentButton(): Ch5ButtonList {
		const getTheMatchingParent = (node: Node): Ch5ButtonList => {
			if (!_.isNil(node) && node.nodeName.toString().toUpperCase() !== "CH5-BUTTON-LIST") {
				return getTheMatchingParent(node.parentNode as Node);
			}
			return node as Ch5ButtonList;
		}
		return getTheMatchingParent(this.parentElement as Node);
	}

}

Ch5ButtonListIndividualButton.registerCustomElement();