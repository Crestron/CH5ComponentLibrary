import _ from "lodash";
import { Ch5Log } from "../../ch5-common/ch5-log";
import { Ch5ButtonList } from "./../ch5-button-list";
import { Ch5Properties } from "../../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../../ch5-core/ch5-property";
import { Ch5RoleAttributeMapping } from "../../utility-models/ch5-role-attribute-mapping";
import { ICh5ButtonListIndividualButtonAttributes } from './../interfaces/i-ch5-button-list-individual-button-attributes';

export class Ch5ButtonListIndividualButtonBase extends Ch5Log implements ICh5ButtonListIndividualButtonAttributes {

	//#region Variables

	public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [
		{
			default: "",
			name: "buttonLabelInnerHTML",
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

	public static  ELEMENT_NAME = 'ch5-button-list-individual-button';

	public cssClassPrefix = 'ch5-button-list-individual-button';
	public primaryCssClass = 'ch5-button-list-individual-button';

	private _ch5Properties: Ch5Properties;
	private _parentCh5ButtonList: Ch5ButtonList;

	//#endregion

	//#region Getters and Setters

	public set buttonLabelInnerHTML(value: string) {
		this._ch5Properties.set<string>("buttonLabelInnerHTML", value, () => {
			if (typeof this._parentCh5ButtonList.debounceButtonDisplay === "function") {
				this._parentCh5ButtonList.debounceButtonDisplay();
			}
		});
	}
	public get buttonLabelInnerHTML(): string {
		return this._ch5Properties.get<string>("buttonLabelInnerHTML");
	}

	public set iconUrl(value: string) {
		this._ch5Properties.set<string>("iconUrl", value, () => {
			if (typeof this._parentCh5ButtonList.debounceButtonDisplay === "function") {
				this._parentCh5ButtonList.debounceButtonDisplay();
			}
		});
	}
	public get iconUrl(): string {
		return this._ch5Properties.get<string>("iconUrl");
	}

	public set iconClass(value: string) {
		this._ch5Properties.set<string>("iconClass", value, () => {
			if (typeof this._parentCh5ButtonList.debounceButtonDisplay === "function") {
				this._parentCh5ButtonList.debounceButtonDisplay();
			}
		});
	}
	public get iconClass(): string {
		return this._ch5Properties.get<string>("iconClass");
	}

	public set onRelease(value: string) {
		this._ch5Properties.set<string>("onRelease", value, () => {
			if (typeof this._parentCh5ButtonList.debounceButtonDisplay === "function") {
				this._parentCh5ButtonList.debounceButtonDisplay();
			}
		});
	}
	public get onRelease(): string {
		return this._ch5Properties.get<string>("onRelease");
	}

	//#endregion

	//#region Component Lifecycle

	public constructor() {
		super();
		this.logger.start('constructor()', Ch5ButtonListIndividualButtonBase.ELEMENT_NAME);
		this._ch5Properties = new Ch5Properties(this, Ch5ButtonListIndividualButtonBase.COMPONENT_PROPERTIES);
		this._parentCh5ButtonList = this.getParentButton();
	}

	public static get observedAttributes(): string[] {
		const inheritedObsAttrs = Ch5Log.observedAttributes;
		const newObsAttrs: string[] = [];
		for (let i: number = 0; i < Ch5ButtonListIndividualButtonBase.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5ButtonListIndividualButtonBase.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				newObsAttrs.push(Ch5ButtonListIndividualButtonBase.COMPONENT_PROPERTIES[i].name.toLowerCase());
			}
		}
		return inheritedObsAttrs.concat(newObsAttrs);
	}

	public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
		this.logger.start("attributeChangedCallback", this.primaryCssClass);
		if (oldValue !== newValue) {
			this.logger.log('ch5-button-list-individual-button attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
			const attributeChangedProperty = Ch5ButtonListIndividualButtonBase.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
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
	 * Called when the Ch5ButtonListIndividualButtonBase component is first connected to the DOM
	 */
	public connectedCallback() {
		this.logger.start('connectedCallback()', Ch5ButtonListIndividualButtonBase.ELEMENT_NAME);
		if (_.isNil(this._parentCh5ButtonList)) {
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

	//#endregion

	//#region Protected / Private Methods

	protected initAttributes() {
		super.initAttributes();

		const thisRef: any = this;
		for (let i: number = 0; i < Ch5ButtonListIndividualButtonBase.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5ButtonListIndividualButtonBase.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				if (this.hasAttribute(Ch5ButtonListIndividualButtonBase.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
					const key = Ch5ButtonListIndividualButtonBase.COMPONENT_PROPERTIES[i].name;
					thisRef[key] = this.getAttribute(key);
				}
			}
		}
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
	//#endregion

}
