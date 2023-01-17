import _ from "lodash";
import { Ch5ButtonListIndividualButtonBase } from "./../ch5-button-list/base-classes/ch5-button-list-individual-button-base";
import { Ch5TabButton } from "./ch5-tab-button";

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

	public getParentButton(): Ch5TabButton {
    const getTheMatchingParent = (node: Node): Ch5TabButton => {
      if (!_.isNil(node) && node.nodeName.toString().toUpperCase() !== "CH5-TAB-BUTTON") {
        return getTheMatchingParent(node.parentNode as Node);
      }
      return node as Ch5TabButton;
    }
    return getTheMatchingParent(this.parentElement as Node);
  }

}

Ch5TabButtonIndividualButton.registerCustomElement();