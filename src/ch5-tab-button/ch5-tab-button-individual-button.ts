import _ from "lodash";
import { Ch5Log } from "../ch5-common/ch5-log";
import { Ch5TabButton } from "./ch5-tab-button";
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { ICh5TabButtonIndividualButtonAttributes } from "./interfaces/i-ch5-tab-button-individual-button-attributes";

export class Ch5TabButtonIndividualButton extends Ch5Log implements ICh5TabButtonIndividualButtonAttributes {

	//#region Variables

	public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [
		{
			default: "",
			name: "labelInnerHTML",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true,
		},
		{
			default: "",
			name: "iconUrl",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true,
		},
		{
			default: "",
			name: "iconClass",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true,
		},
		{
			default: "",
			name: "onRelease",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true,
		}
	];

	public static ELEMENT_NAME = 'ch5-tab-button-individual-button';
	public primaryCssClass = 'ch5-tab-button-individual-button';

	private _ch5Properties: Ch5Properties;
	protected _parentCh5TabButton: Ch5TabButton | null = null;

	//#endregion

	//#region Getters and Setters

	public set parentComponent(value: Ch5TabButton | null) {
		this._parentCh5TabButton = value;
	}
	public get parentComponent(): Ch5TabButton | null {
		return this._parentCh5TabButton;
	}

	public set labelInnerHTML(value: string) {
		this._ch5Properties.set<string>("labelInnerHTML", value, () => {
			if (this.parentComponent) {
				this.parentComponent.debounceButtonDisplay();
			}
		});
	}
	public get labelInnerHTML(): string {
		return this._ch5Properties.get<string>("labelInnerHTML");
	}

	public set iconUrl(value: string) {
		this._ch5Properties.set<string>("iconUrl", value, () => {
			if (this.parentComponent) {
				this.parentComponent.debounceButtonDisplay();
			}
		});
	}
	public get iconUrl(): string {
		return this._ch5Properties.get<string>("iconUrl");
	}

	public set iconClass(value: string) {
		this._ch5Properties.set<string>("iconClass", value, () => {
			if (this.parentComponent) {
				this.parentComponent.debounceButtonDisplay();
			}
		});
	}
	public get iconClass(): string {
		return this._ch5Properties.get<string>("iconClass");
	}

	public set onRelease(value: string) {
		this._ch5Properties.set<string>("onRelease", value, () => {
			if (this.parentComponent) {
				this.parentComponent.debounceButtonDisplay();
			}
		});
	}
	public get onRelease(): string {
		return this._ch5Properties.get<string>("onRelease");
	}

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

	//#region Component Lifecycle

	public constructor() {
		super();
		this.logger.start('constructor()');
		this._ch5Properties = new Ch5Properties(this, Ch5TabButtonIndividualButton.COMPONENT_PROPERTIES);
	}

	public static get observedAttributes(): string[] {
		const inheritedObsAttrs = Ch5Log.observedAttributes;
		const newObsAttrs: string[] = [];
		for (let i: number = 0; i < Ch5TabButtonIndividualButton.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5TabButtonIndividualButton.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				newObsAttrs.push(Ch5TabButtonIndividualButton.COMPONENT_PROPERTIES[i].name.toLowerCase());
			}
		}
		return inheritedObsAttrs.concat(newObsAttrs);
	}

	public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
		this.logger.start("attributeChangedCallback");
		if (oldValue !== newValue) {
			this.logger.log(this.nodeName + ' attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
			const attributeChangedProperty = Ch5TabButtonIndividualButton.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
			if (attributeChangedProperty) {
				const thisRef: any = this;
				const key = attributeChangedProperty.name;
				thisRef[key] = newValue;
			} else {
				super.attributeChangedCallback(attr, oldValue, newValue);
			}
		}
		this.logger.stop();
	}

	/**
	 * Called when the Ch5TabButtonIndividualButtonBase component is first connected to the DOM
	 */
	public connectedCallback() {
		this.logger.start('connectedCallback()');
		const _parentCh5TabButton = this.getParentButton();
		if (_.isNil(_parentCh5TabButton)) {
			throw new Error(`Invalid parent element for ch5-button-list-individual-button.`);
		}
		this.setAttribute('role', Ch5RoleAttributeMapping.ch5ButtonListIndividualButton);
		this.setAttribute('data-ch5-id', this.getCrId());
		this.initAttributes();
		this.logger.stop();
	}

	public disconnectedCallback() {
		this.logger.start('disconnectedCallback()');
		this.logger.stop();
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

	//#endregion

}

Ch5TabButtonIndividualButton.registerCustomElement();