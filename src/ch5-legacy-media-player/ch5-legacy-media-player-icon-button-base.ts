import { Ch5Properties } from '../ch5-core/ch5-properties';
import { Ch5Log } from '../ch5-common/ch5-log';
import { ICh5PropertySettings } from '../ch5-core/ch5-property';

export class Ch5LegacyMediaPlayerIconButton extends Ch5Log {

	//#region Variables

	public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [
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

	public static readonly ELEMENT_NAME = 'ch5-legacy-media-player-icon-button';

	public primaryCssClass = 'ch5-legacy-media-player--icon-button';

	private _ch5Properties: Ch5Properties;
	private _icon: HTMLElement = {} as HTMLElement;
	private _elButton: HTMLElement = {} as HTMLElement;

	//#endregion

	//#region Getters and Setters

	public set iconClass(value: string) {
		this._ch5Properties.set<string>("iconClass", value, () => {
			this.handleIconClass(value);
		});
	}
	public get iconClass(): string {
		return this._ch5Properties.get<string>("iconClass");
	}

	public set onRelease(value: string) {
		this._ch5Properties.set<string>("onRelease", value, () => {
			this.handleIconClass(value);
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
			&& window.customElements.get(Ch5LegacyMediaPlayerIconButton.ELEMENT_NAME) === undefined) {
			window.customElements.define(Ch5LegacyMediaPlayerIconButton.ELEMENT_NAME, Ch5LegacyMediaPlayerIconButton);
		}
	}
	//#endregion

	//#region Component Lifecycle

	public constructor() {
		super();
		this.logger.start('constructor()', Ch5LegacyMediaPlayerIconButton.ELEMENT_NAME);
		this._ch5Properties = new Ch5Properties(this, Ch5LegacyMediaPlayerIconButton.COMPONENT_PROPERTIES);
		this.createInternalHtml();
		this.updateCssClass();
	}

	public static get observedAttributes(): string[] {
		const inheritedObsAttrs = Ch5Log.observedAttributes;
		const newObsAttrs: string[] = [];
		for (let i: number = 0; i < Ch5LegacyMediaPlayerIconButton.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5LegacyMediaPlayerIconButton.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				newObsAttrs.push(Ch5LegacyMediaPlayerIconButton.COMPONENT_PROPERTIES[i].name.toLowerCase());
			}
		}
		return inheritedObsAttrs.concat(newObsAttrs);
	}

	public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
		this.logger.start("attributeChangedCallback", this.primaryCssClass);
		if (oldValue !== newValue) {
			this.logger.log('ch5-legacy-media-player-icon-button attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
			const attributeChangedProperty = Ch5LegacyMediaPlayerIconButton.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
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
	 * Called when the Ch5LegacyMediaPlayerIconButton component is first connected to the DOM
	 */
	public connectedCallback() {
		this.logger.start('connectedCallback()', Ch5LegacyMediaPlayerIconButton.ELEMENT_NAME);
		// if (this._elButton.parentElement !== this) {
		this._elButton.classList.add('ch5-legacy-media-player--individual-icon-button');
		this.appendChild(this._elButton);
		// }
		this.attachEventListeners();
		this.initAttributes();
		this.logger.stop();
	}

	public disconnectedCallback() {
		this.logger.start('disconnectedCallback()');
		this.removeEventListeners();
		this.unsubscribeFromSignals();
		this.logger.stop();
	}

	//#endregion

	//#region Protected / Private Methods

	protected createInternalHtml() {
		this.logger.start('createInternalHtml()');
		this.clearComponentContent();
		this.classList.add('ch5-legacy-media-player--individual-icon-button-container');
		this._elButton = document.createElement('button');
		this.logger.stop();
	}

	protected initAttributes() {
		const thisRef: any = this;
		for (let i: number = 0; i < Ch5LegacyMediaPlayerIconButton.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5LegacyMediaPlayerIconButton.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				if (this.hasAttribute(Ch5LegacyMediaPlayerIconButton.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
					const key = Ch5LegacyMediaPlayerIconButton.COMPONENT_PROPERTIES[i].name;
					thisRef[key] = this.getAttribute(key);
				}
			}
		}
	}

	protected attachEventListeners() {

	}

	protected removeEventListeners() {

	}

	protected unsubscribeFromSignals() {
		this._ch5Properties.unsubscribe();
	}

	/**
	 * Clear the content of component in order to avoid duplication of elements
	 */
	private clearComponentContent() {
		const containers = this.getElementsByTagName("div");
		Array.from(containers).forEach((container) => {
			container.remove();
		});
	}


	private handleIconClass(value: string) {
		if (this._icon.parentNode && this._icon)
			this._icon.parentNode.removeChild(this._icon);
		if (value) {
			if (this.iconClass.split(" ")[0] === "mp-icon") {
				this._icon = document.createElement('i');
			}
			else {
				this._icon = document.createElement('div');
			}
			this._elButton.appendChild(this._icon);
			this._icon.classList.add(...value.split(' '));
		}

		this.updateCssClass();
	}

	private updateCssClass() {
		this.logger.start('UpdateCssClass');
		this.logger.stop();
	}

	protected getTargetElementForCssClassesAndStyle(): HTMLElement {
		return this._elButton;
	}

	public getCssClassDisabled() {
		return this.primaryCssClass + '--disabled';
	}

	//#endregion

}

Ch5LegacyMediaPlayerIconButton.registerCustomElement();