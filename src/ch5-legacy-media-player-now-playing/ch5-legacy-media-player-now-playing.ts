import { Ch5Common } from "../ch5-common/ch5-common";
// import { Ch5SignalFactory } from "../ch5-core/index";
import { Ch5RoleAttributeMapping } from "../utility-models/ch5-role-attribute-mapping";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";

import { ICh5LegacyMediaPlayerNowPlayingAttributes } from './interfaces/i-ch5-legacy-media-player-now-playing-attributes';
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";

export class Ch5LegacyMediaPlayerNowPlaying extends Ch5Common implements ICh5LegacyMediaPlayerNowPlayingAttributes {

	//#region Variables


	public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
		...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
		receivestateselectedprofile: { direction: "state", stringJoin: 1, contractName: true },

	};

	public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [

		{
			default: "",
			isSignal: true,
			name: "receiveStateSelectedProfile",
			signalType: "string",
			removeAttributeOnNull: true,
			type: "string",

			valueOnAttributeEmpty: "",
			isObservableProperty: true,
		},
		{
			default: "",
			isSignal: true,
			name: "menuIconSendEventOnClick",
			signalType: "boolean",
			removeAttributeOnNull: true,
			type: "string",
			isNullable: true,
			valueOnAttributeEmpty: "",
			isObservableProperty: true,
		},
	];

	public static readonly ELEMENT_NAME = 'ch5-legacy-media-player-now-playing';

	public primaryCssClass = 'ch5-legacy-media-player-now-playing';

	private _ch5Properties: Ch5Properties;
	private _elContainer: HTMLElement = {} as HTMLElement;

	//#endregion

	//#region Getters and Setters


	public set receiveStateSelectedProfile(value: string) {
		this._ch5Properties.set("receiveStateSelectedProfile", value, null, (newValue: string) => {
			this.handleReceiveStateSelectedProfile();
			console.log(newValue);
		});
	}
	public get receiveStateSelectedProfile(): string {
		return this._ch5Properties.get<string>('receiveStateSelectedProfile');
	}

	public set menuIconSendEventOnClick(value: string) {
		this._ch5Properties.set("menuIconSendEventOnClick", value, null, (newValue: boolean) => {
			this.handleMenuIconSendEventOnClick();
			console.log(newValue);
		});
	}
	public get menuIconSendEventOnClick(): string {
		return this._ch5Properties.get<string>('menuIconSendEventOnClick');
	}


	//#endregion

	//#region Static Methods

	public static registerSignalAttributeTypes() {
		Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5LegacyMediaPlayerNowPlaying.ELEMENT_NAME, Ch5LegacyMediaPlayerNowPlaying.SIGNAL_ATTRIBUTE_TYPES);
	}

	public static registerCustomElement() {
		if (typeof window === "object"
			&& typeof window.customElements === "object"
			&& typeof window.customElements.define === "function"
			&& window.customElements.get(Ch5LegacyMediaPlayerNowPlaying.ELEMENT_NAME) === undefined) {
			window.customElements.define(Ch5LegacyMediaPlayerNowPlaying.ELEMENT_NAME, Ch5LegacyMediaPlayerNowPlaying);
		}
	}

	//#endregion

	//#region Component Lifecycle

	public constructor() {
		super();
		this.logger.start('constructor()', Ch5LegacyMediaPlayerNowPlaying.ELEMENT_NAME);
		this.ignoreAttributes = ["appendclasswheninviewport", "customclass", "customstyle", "noshowtype", "receivestatecustomclass", "receivestatecustomstyle", "receivestateenable", "receivestateshow", "receivestateshowpulse", "receivestatehidepulse", "sendeventonshow",];
		if (!this._wasInstatiated) {
			this.createInternalHtml();
		}
		this._wasInstatiated = true;
		this._ch5Properties = new Ch5Properties(this, Ch5LegacyMediaPlayerNowPlaying.COMPONENT_PROPERTIES);
		this.updateCssClass();
	}

	public static get observedAttributes(): string[] {
		const inheritedObsAttrs = Ch5Common.observedAttributes;
		const newObsAttrs: string[] = [];
		for (let i: number = 0; i < Ch5LegacyMediaPlayerNowPlaying.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5LegacyMediaPlayerNowPlaying.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				newObsAttrs.push(Ch5LegacyMediaPlayerNowPlaying.COMPONENT_PROPERTIES[i].name.toLowerCase());
			}
		}
		return inheritedObsAttrs.concat(newObsAttrs);
	}

	public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
		this.logger.start("attributeChangedCallback", this.primaryCssClass);
		if (oldValue !== newValue) {
			this.logger.log('ch5-legacy-media-player-now-playing attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
			const attributeChangedProperty = Ch5LegacyMediaPlayerNowPlaying.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
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
	 * Called when the Ch5LegacyMediaPlayerNowPlaying component is first connected to the DOM
	 */
	public connectedCallback() {
		this.logger.start('connectedCallback()', Ch5LegacyMediaPlayerNowPlaying.ELEMENT_NAME);
		// WAI-ARIA Attributes
		if (!this.hasAttribute('role')) {
			this.setAttribute('role', Ch5RoleAttributeMapping.ch5LegacyMediaPlayerNowPlaying);
		}
		if (this._elContainer.parentElement !== this) {
			this._elContainer.classList.add('ch5-legacy-media-player-now-playing');
			this.appendChild(this._elContainer);
		}
		this.attachEventListeners();
		this.initAttributes();
		this.initCommonMutationObserver(this);

		customElements.whenDefined('ch5-legacy-media-player-now-playing').then(() => {
			this.componentLoadedEvent(Ch5LegacyMediaPlayerNowPlaying.ELEMENT_NAME, this.id);
		});
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
		this._elContainer = document.createElement('div');

		this.logger.stop();
	}

	protected initAttributes() {
		super.initAttributes();

		const thisRef: any = this;
		for (let i: number = 0; i < Ch5LegacyMediaPlayerNowPlaying.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5LegacyMediaPlayerNowPlaying.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				if (this.hasAttribute(Ch5LegacyMediaPlayerNowPlaying.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
					const key = Ch5LegacyMediaPlayerNowPlaying.COMPONENT_PROPERTIES[i].name;
					thisRef[key] = this.getAttribute(key);
				}
			}
		}
	}

	protected attachEventListeners() {
		super.attachEventListeners();

	}

	protected removeEventListeners() {
		super.removeEventListeners();

	}

	protected unsubscribeFromSignals() {
		super.unsubscribeFromSignals();
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


	private handleReceiveStateSelectedProfile() {
		// Enter your Code here
	}
	private handleMenuIconSendEventOnClick() {
		// Enter your Code here
	}

	private updateCssClass() {
		this.logger.start('UpdateCssClass');
		super.updateCssClasses();

		this.logger.stop();
	}

	protected getTargetElementForCssClassesAndStyle(): HTMLElement {
		return this._elContainer;
	}

	public getCssClassDisabled() {
		return this.primaryCssClass + '--disabled';
	}

	//#endregion

}

Ch5LegacyMediaPlayerNowPlaying.registerCustomElement();
Ch5LegacyMediaPlayerNowPlaying.registerSignalAttributeTypes();
