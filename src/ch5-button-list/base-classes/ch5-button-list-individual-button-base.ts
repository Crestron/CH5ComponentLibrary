import _ from "lodash";
import { Ch5Log } from "../../ch5-common/ch5-log";
import { Ch5Properties } from "../../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../../ch5-core/ch5-property";
import { Ch5RoleAttributeMapping } from "../../utility-models/ch5-role-attribute-mapping";
import { ICh5ButtonListIndividualButtonAttributes } from './../interfaces/i-ch5-button-list-individual-button-attributes';
import { Ch5ButtonListBase } from "./ch5-button-list-base";

export class Ch5ButtonListIndividualButtonBase extends Ch5Log implements ICh5ButtonListIndividualButtonAttributes {

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

	private _ch5Properties: Ch5Properties;
	private _parentCh5ButtonList: Ch5ButtonListBase | null = null;

	//#endregion

	//#region Getters and Setters

	public set parentComponent(value: Ch5ButtonListBase | null) {
		this._parentCh5ButtonList = value;
	}
	public get parentComponent(): Ch5ButtonListBase | null {
		return this._parentCh5ButtonList;
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

	//#region Component Lifecycle

	public constructor() {
		super();
		this.logger.start('constructor()');
		this._ch5Properties = new Ch5Properties(this, Ch5ButtonListIndividualButtonBase.COMPONENT_PROPERTIES);
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
		this.logger.start("attributeChangedCallback");
		if (oldValue !== newValue) {
			this.logger.log(this.nodeName + ' attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
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
		this.logger.start('connectedCallback()');
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

	//#endregion

}
