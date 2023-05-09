import { Ch5OverlayPanel, } from "../ch5-overlay-panel/index";
import { Ch5RoleAttributeMapping } from "../utility-models";
import { Ch5Button } from "../ch5-button/ch5-button";
import { ICh5ModalDialogAttributes } from "./interfaces/i-ch5-modal-dialog-attributes";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from '../ch5-common/ch5-signal-attribute-registry';
import { Ch5Common } from '../ch5-common/ch5-common';
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import { TCh5OverlayPanelStretch } from "../ch5-overlay-panel/interfaces"

export class Ch5ModalDialog extends Ch5OverlayPanel implements ICh5ModalDialogAttributes {

	public static readonly COMPONENT_DATA: any = {
		STRETCH: {
			default: Ch5OverlayPanel.STRETCHES[0],
			values: Ch5OverlayPanel.STRETCHES,
			key: 'stretch',
			attribute: 'stretch',
			classListPrefix: '--stretch-'
		},
		OVERFLOWS: {
			default: Ch5OverlayPanel.OVERFLOWS[0],
			values: Ch5OverlayPanel.OVERFLOWS,
			key: 'overflow',
			attribute: 'overflow',
			classListPrefix: '--overflow-'
		}
	};

	public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
		...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
		sendsignalonbeforeshow: { direction: "event", booleanJoin: 1, contractName: true },
		sendsignalonaftershow: { direction: "event", booleanJoin: 1, contractName: true },
		sendsignalonbeforehide: { direction: "event", booleanJoin: 1, contractName: true },
		sendsignalonafterhide: { direction: "event", booleanJoin: 1, contractName: true },
		sendsignalonok: { direction: "event", booleanJoin: 1, contractName: true },
		sendsignaloncancel: { direction: "event", booleanJoin: 1, contractName: true },
	};

	public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [
		{
			default: true,
			name: "dismissable",
			removeAttributeOnNull: true,
			type: "boolean",
			valueOnAttributeEmpty: true,
			isObservableProperty: true
		},
		{
			default: false,
			name: "closable",
			removeAttributeOnNull: true,
			type: "boolean",
			valueOnAttributeEmpty: true,
			isObservableProperty: true
		},
		{
			default: "",
			name: "closeIcon",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: false,
			name: "mask",
			removeAttributeOnNull: true,
			type: "boolean",
			valueOnAttributeEmpty: true,
			isObservableProperty: true
		},
		{
			default: "",
			name: "maskStyle",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: null,
			enumeratedValues: Ch5OverlayPanel.STRETCHES,
			name: "stretch",
			removeAttributeOnNull: true,
			type: "enum",
			valueOnAttributeEmpty: null,
			isObservableProperty: true,
			isNullable: true
		},
		{
			default: Ch5OverlayPanel.OVERFLOWS[0],
			enumeratedValues: Ch5OverlayPanel.OVERFLOWS,
			name: "overflow",
			removeAttributeOnNull: true,
			type: "enum",
			valueOnAttributeEmpty: Ch5OverlayPanel.OVERFLOWS[0],
			isObservableProperty: true
		},
		{
			default: "",
			name: "width",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: "",
			name: "height",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: "",
			name: "title",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: false,
			name: "hideOkButton",
			nameForSignal: "receiveStateHideOkButton",
			removeAttributeOnNull: true,
			type: "boolean",
			valueOnAttributeEmpty: true,
			isObservableProperty: true
		},
		{
			default: "Ok",
			name: "okButtonLabel",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "Ok",
			isObservableProperty: true
		},
		{
			default: "",
			name: "okButtonIcon",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: "",
			name: "okButtonStyle",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: false,
			name: "hideCancelButton",
			nameForSignal: "receiveStateHideCancelButton",
			removeAttributeOnNull: true,
			type: "boolean",
			valueOnAttributeEmpty: true,
			isObservableProperty: true
		},
		{
			default: "Cancel",
			name: "cancelButtonLabel",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "Cancel",
			isObservableProperty: true
		},
		{
			default: "",
			name: "cancelButtonIcon",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: "",
			name: "cancelButtonStyle",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: "",
			name: "prompt",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: "",
			name: "promptIcon",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: "",
			isSignal: true,
			name: "sendEventOnBeforeShow",
			signalType: "boolean",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: "",
			isSignal: true,
			name: "sendEventOnAfterShow",
			signalType: "boolean",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: "",
			isSignal: true,
			name: "sendEventOnBeforeHide",
			signalType: "boolean",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: "",
			isSignal: true,
			name: "sendEventOnAfterHide",
			signalType: "boolean",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: "",
			isSignal: true,
			name: "sendEventOnShow",
			signalType: "boolean",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: "",
			isSignal: true,
			name: "sendEventOnOk",
			signalType: "boolean",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: "",
			isSignal: true,
			name: "sendEventOnCancel",
			signalType: "boolean",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		}
	];

	public static readonly ELEMENT_NAME: string = 'ch5-modal-dialog';
	public primaryCssClass = 'ch5-modal-dialog';

	public _ch5Properties: Ch5Properties;
	/**
	 * A div element that is external to this component. Its role is to provide mask that stretches over the entire
	 * viewport. The overlay will be displayed over this mask. The mask will capture click/touch events made outside
	 * the overlay.
	 */
	protected _elMask: HTMLElement = {} as HTMLElement;

	/**
	 * The HTML element that contains the text specified in the title attribute
	 */
	protected _elHeader: HTMLElement = {} as HTMLElement;

	/**
	 * The div element that contains the prompt section
	 */
	protected _elPrompt: HTMLElement = {} as HTMLElement;

	protected _elPromptIcon: HTMLElement = {} as HTMLElement;

	protected _elPromptText: HTMLElement = {} as HTMLElement;

	/**
	 * The div element that contains the buttons
	 */
	protected _elFooter: HTMLElement = {} as HTMLElement;

	protected _elBtnOk: Ch5Button = {} as Ch5Button;

	protected _elBtnCancel: Ch5Button = {} as Ch5Button;


	// protected _btnOkDefaultLabelText = 'Ok';

	// protected _btnCancelDefaultLabelText = 'Cancel';


	private _okEvent: Event;

	private _cancelEvent: Event;

	//#region Getters and Setters

	public set width(value: string) {
		this._ch5Properties.set<string>("width", this._parseSizeAttr(value), () => {
			this.handleWidth();
		});
	}
	public get width(): string {
		return this._ch5Properties.get<string>("width");
	}

	public set height(value: string) {
		this._ch5Properties.set<string>("height", this._parseSizeAttr(value), () => {
			this.handleHeight();
		});
	}
	public get height(): string {
		return this._ch5Properties.get<string>("height");
	}

	public set stretch(value: TCh5OverlayPanelStretch | null) {
		const prevValue = this.stretch;
		this._ch5Properties.set<TCh5OverlayPanelStretch | null>("stretch", value, () => {
			if (prevValue !== null) {
				this.updateChangeInStretch(prevValue);
			}
		});
	}
	public get stretch(): (TCh5OverlayPanelStretch | null) {
		return this._ch5Properties.get<TCh5OverlayPanelStretch | null>("stretch");
	}

	public set closable(value: boolean) {
		this._ch5Properties.set<boolean>("closable", value, () => {
			this.adjustInternalHtmlStructure();
		});
	}
	public get closable(): boolean {
		return this._ch5Properties.get<boolean>("closable");
	}

	public set title(value: string) {
		this._ch5Properties.set<string>("title", value, () => {
			this.handleTitle(value);
		});
	}
	public get title(): string {
		return this._ch5Properties.get<string>("title");
	}

	public set mask(value: boolean) {
		this._ch5Properties.set<boolean>("mask", value, () => {
			this.handleMask();
		});
	}
	public get mask(): boolean {
		return this._ch5Properties.get<boolean>("mask");
	}

	public set maskStyle(value: string) {
		this._ch5Properties.set<string>("maskStyle", value, () => {
			this.handleMaskStyle();
		});
	}
	public get maskStyle() {
		return this._ch5Properties.get<string>("maskStyle");
	}

	public set hideOkButton(value: boolean) {
		this._ch5Properties.set<boolean>("hideOkButton", value, () => {
			this.adjustInternalHtmlStructure();
		});
	}
	public get hideOkButton(): boolean {
		return this._ch5Properties.get<boolean>("hideOkButton");
	}

	public set okButtonLabel(value: string) {
		this._ch5Properties.set<string>("okButtonLabel", value, () => {
			this.handleOkButtonLabel();
		});
	}
	public get okButtonLabel(): string {
		return this._ch5Properties.get<string>("okButtonLabel");
	}

	public set okButtonIcon(value: string) {
		this._ch5Properties.set<string>("okButtonIcon", value, () => {
			this.handleOkButtonIcon();
		});
	}
	public get okButtonIcon(): string {
		return this._ch5Properties.get<string>("okButtonIcon");
	}

	public set okButtonStyle(value: string) {
		this._ch5Properties.set<string>("okButtonStyle", value, () => {
			this.handleOkButtonStyle();
		});
	}
	public get okButtonStyle(): string {
		return this._ch5Properties.get<string>("okButtonStyle");
	}

	public set hideCancelButton(value: boolean) {
		this._ch5Properties.set<boolean>("hideCancelButton", value, () => {
			this.adjustInternalHtmlStructure();
		});
	}
	public get hideCancelButton(): boolean {
		return this._ch5Properties.get<boolean>("hideCancelButton");
	}

	public set cancelButtonLabel(value: string) {
		this._ch5Properties.set<string>("cancelButtonLabel", value, () => {
			this.handleCancelButtonLabel();
		});
	}
	public get cancelButtonLabel(): string {
		return this._ch5Properties.get<string>("cancelButtonLabel");
	}

	public set cancelButtonIcon(value: string) {
		this._ch5Properties.set<string>("cancelButtonIcon", value, () => {
			this.handleCancelButtonIcon();
		});
	}
	public get cancelButtonIcon(): string {
		return this._ch5Properties.get<string>("cancelButtonIcon");
	}

	public set cancelButtonStyle(value: string) {
		this._ch5Properties.set<string>("cancelButtonStyle", value, () => {
			this.handleCancelButtonStyle();
		});
	}
	public get cancelButtonStyle(): string {
		return this._ch5Properties.get<string>("cancelButtonStyle");
	}

	public set prompt(value: string) {
		this._ch5Properties.set<string>("prompt", value, () => {
			this.handlePrompt(value);
		});
	}
	public get prompt(): string {
		return this._ch5Properties.get<string>("prompt");
	}

	public set promptIcon(value: string) {
		this._ch5Properties.set<string>("promptIcon", value, () => {
			this.handlePromptIcon(value);
		});
	}
	public get promptIcon(): string {
		return this._ch5Properties.get<string>("promptIcon");
	}

	public set sendEventOnOk(value: string) {
		this._ch5Properties.set("sendEventOnOk", value, () => {
			this._elBtnOk.setAttribute('sendEventOnClick', value);
		});
	}
	public get sendEventOnOk(): string {
		return this._ch5Properties.get<string>('sendEventOnOk');
	}

	public set sendEventOnCancel(value: string) {
		this._ch5Properties.set("sendEventOnCancel", value, () => {
			this._elBtnCancel.setAttribute('sendEventOnClick', value);
		});
	}
	public get sendEventOnCancel(): string {
		return this._ch5Properties.get<string>('sendEventOnCancel');
	}

	//#endregion

	private _crModalWasInstatiated: boolean = false;

	public constructor() {
		super();
		this.info('Ch5ModalDialog.constructor()');
		this._listOfAllPossibleComponentCssClasses = this.generateListOfAllPossibleComponentCssClasses();

		if (!this._crModalWasInstatiated) {
			this._rebindEventCallbacks();
			this.createInternalHtml();
		}
		this._crModalWasInstatiated = true;
		this._ch5Properties = new Ch5Properties(this, Ch5ModalDialog.COMPONENT_PROPERTIES);
		this.updateCssClasses();

		this._okEvent = new CustomEvent('ok', {
			bubbles: true,
			cancelable: false
		});

		this._cancelEvent = new CustomEvent('cancel', {
			bubbles: true,
			cancelable: false
		});

		// this.cancelButtonLabel = this._btnCancelDefaultLabelText;
		// this.okButtonLabel = this._btnOkDefaultLabelText;
	}

	public static registerSignalAttributeTypes() {
		Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5ModalDialog.ELEMENT_NAME, Ch5ModalDialog.SIGNAL_ATTRIBUTE_TYPES);
	}

	public static registerCustomElement() {
		if (typeof window === "object"
			&& typeof window.customElements === "object"
			&& typeof window.customElements.define === "function") {
			window.customElements.define(Ch5ModalDialog.ELEMENT_NAME, Ch5ModalDialog);
		}
	}

	protected attachEventListeners() {
		super.attachEventListeners();
		if (!this._elBtnCancel) {
			return;
		}
		if (!this._elBtnOk) {
			return;
		}
		this._elBtnOk.addEventListener('click', this._onOkClick);
		this._elBtnCancel.addEventListener('click', this._onCancelClick);
	}

	protected removeEventListeners() {
		super.removeEventListeners();
		this._elBtnOk.removeEventListener('click', this._onOkClick);
		this._elBtnCancel.removeEventListener('click', this._onCancelClick);
	}

	protected _rebindEventCallbacks() {
		super._rebindEventCallbacks();

		this._onOkClick = this._onOkClick.bind(this);
		this._onCancelClick = this._onCancelClick.bind(this);

		this._clickedOnMask = this._clickedOnMask.bind(this);
	}

	protected _onOkClick(inEvent: Event) {
		this.info('_onOkClick()');
		this.dispatchEvent(this._okEvent);
		// TODO: The show attribute works but the biggest challenge comes with receiveStateShow
		// This must be globally corrected in the next version for ok, cancel and close icon
		// Creating a hard show to false
		this.setShowBasedOnAttributes();
	}

	protected _onCancelClick(inEvent: Event) {
		this.info('_onCancelClick()');
		this.dispatchEvent(this._cancelEvent);
		this.setShowBasedOnAttributes();
	}

	protected _parseSizeAttr(value: string) {
		let retVal: string = value.trim().toLowerCase();

		if (retVal.indexOf('px') === -1) {
			retVal += 'px';
		}

		return retVal;
	}

	protected _clickedOnMask(inEvent: Event) {
		this.info('_clickedOnMask()');
		if (true === this.mask && true === this.dismissable) {
			this.setShowBasedOnAttributes();
		}
		inEvent.stopPropagation();
		return false;
	}

	protected _checkAndAttachMaskIfNeeded() {
		if (true === this.mask
			&& this._elMask.parentElement !== this
			&& this._elContainer.parentElement === this) {
			this.insertBefore(this._elMask, this._elContainer);
		}
	}

	protected getTargetElementForCssClassesAndStyle(): HTMLElement {
		return this._elContainer;
	}

	public connectedCallback() {
		// super.connectedCallback();
		this.info('ch5-modal connectedCallback()');
		// WAI-ARIA Attributes
		if (!this.hasAttribute('role')) {
			this.setAttribute('role', Ch5RoleAttributeMapping.ch5ModalDialog);
		}

		if (!this.hasAttribute('show')) {
			this.setShowBasedOnAttributes();
		}
		this._ready.then(() => {
			this._initialize();
			this.initCommonMutationObserver(this);
		});
		this.attachEventListeners();
	}

	public disconnectedCallback() {
		this.info('ch5-modal disconnectedCallback()');
		super.disconnectedCallback();

		// disconnect common mutation observer
		this.disconnectCommonMutationObserver();
		this.removeEventListeners();
	}

	private setShowBasedOnAttributes() {
		this.setAttributeAndProperty(this.COMMON_PROPERTIES.SHOW, false, true);
	}

	public static get observedAttributes() {
		const inheritedObsAttrs = Ch5Common.observedAttributes;
		const newObsAttrs: string[] = [];
		for (let i: number = 0; i < Ch5ModalDialog.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5ModalDialog.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				newObsAttrs.push(Ch5ModalDialog.COMPONENT_PROPERTIES[i].name.toLowerCase());
			}
		}
		return inheritedObsAttrs.concat(newObsAttrs);
	}

	protected _initialize() {
		this.info('ch5-modal _initialize()');

		const existingModal = this.querySelector(`.${this.primaryCssClass}`);

		if (!existingModal) {
			while (this.childNodes.length) {
				this._elContents.appendChild(this.childNodes[0]);
			}
			this.appendChild(this._elContainer);
			this.adjustInternalHtmlStructure();

			this.cacheComponentChildrens();
		}

		this.initAttributes();
		this._checkAndAttachMaskIfNeeded();
		this.updateCssClasses();
	}

	protected initAttributes() {
		super.initAttributes();

		const thisRef: any = this;
		for (let i: number = 0; i < Ch5ModalDialog.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5ModalDialog.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				if (this.hasAttribute(Ch5ModalDialog.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
					const key = Ch5ModalDialog.COMPONENT_PROPERTIES[i].name;
					thisRef[key] = this.getAttribute(key);
				}
			}
		}
	}

	protected generateListOfAllPossibleComponentCssClasses(): string[] {
		return super.generateListOfAllPossibleComponentCssClasses();
	}

	protected updateCssClasses(): void {
		// apply css classes for attrs inherited from common (e.g. customClass, customStyle )
		super.updateCssClasses();
		this.info('called updateCssClasses()');

		const setOfCssClassesToBeApplied = new Set<string>();

		setOfCssClassesToBeApplied.add(this.primaryCssClass);
		setOfCssClassesToBeApplied.add(this.primaryCssClass + '--overflow-' + this.overflow);
		setOfCssClassesToBeApplied.add(this.primaryCssClass + '--stretch-' + this.stretch);

		const targetEl: HTMLElement = this.getTargetElementForCssClassesAndStyle();
		if (typeof targetEl.classList !== 'undefined') {
			this._listOfAllPossibleComponentCssClasses.forEach((cssClass: string) => {
				if (setOfCssClassesToBeApplied.has(cssClass)) {
					targetEl.classList.add(cssClass);
					this.info('add CSS class', cssClass);
				} else {
					targetEl.classList.remove(cssClass);
					this.info('remove CSS class', cssClass);
				}
			});
		}
	}

	/**
	 * Called when an HTML attribute is changed, added or removed
	 */
	public attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
		this.logger.start("attributeChangedCallback", this.primaryCssClass);
		if (oldValue !== newValue) {
			this.logger.log('ch5-modal-dialog-prasaanth attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
			const attributeChangedProperty = Ch5ModalDialog.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
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

	private handleMask() {
		if (this.mask === true) {
			this._elMask.classList.add(this.primaryCssClass + '-mask-default-style');
		} else {
			this._elMask.classList.remove(this.primaryCssClass + '-mask-default-style');
		}
		this._checkAndAttachMaskIfNeeded();
	}

	private handleMaskStyle() {
		this._elMask.style.cssText = this.maskStyle;
	}

	private handleWidth() {
		const targetEl = this.getTargetElementForCssClassesAndStyle();
		if (targetEl) {
			targetEl.style.width = this._parseSizeAttr(this.width);
		}
	}

	private handleHeight() {
		const targetEl = this.getTargetElementForCssClassesAndStyle();
		if (targetEl) {
			targetEl.style.height = this._parseSizeAttr(this.height);
		}
	}

	private handleTitle(value: string) {
		if (this._elHeader instanceof HTMLElement) {
			this._elHeader.textContent = value;
		}
	}

	private updateChangeInStretch(prevValue: string) {
		const targetEl: HTMLElement = this.getTargetElementForCssClassesAndStyle();
		targetEl.classList.remove(this.primaryCssClass + '--stretch-' + prevValue);
		targetEl.classList.add(this.primaryCssClass + '--stretch-' + this.stretch);
	}

	private handleOkButtonLabel() {
		const trValue = this._getTranslatedValue('okButtonLabel', this.okButtonLabel);
		this._elBtnOk.setAttribute('label', trValue);
	}

	private handleOkButtonIcon() {
		this._elBtnOk.setAttribute('iconClass', this.okButtonIcon);
	}

	private handleOkButtonStyle() {
		this._elBtnOk.setAttribute('customStyle', this.okButtonStyle);
	}

	private handleCancelButtonLabel() {
		const trValue = this._getTranslatedValue('cancelButtonLabel', this.cancelButtonLabel);
		if (this._elBtnCancel instanceof HTMLElement) {
			this._elBtnCancel.setAttribute('label', trValue);
		}
	}

	private handleCancelButtonIcon() {
		this._elBtnCancel.setAttribute('iconClass', this.cancelButtonIcon);
	}

	private handleCancelButtonStyle() {
		this._elBtnCancel.setAttribute('customStyle', this.cancelButtonStyle);
	}

	private handlePrompt(value: string) {
		if (this._elPromptText instanceof HTMLElement) {
			this._elPromptText.textContent = value;
		}
	}

	private handlePromptIcon(value: string) {
		if (this._elPromptIcon instanceof HTMLElement) {
			this._elPromptIcon.setAttribute('src', value);
		}
	}

	protected createInternalHtml() {
		const existingModal = this.querySelector(`.${this.primaryCssClass}`);
		if (!existingModal) {
			this.info('ch5-modal-dialog create internal Html');
			this._elContainer = document.createElement('div');

			this._elCloseIconBtn = document.createElement('button');
			this._elCloseIconBtn.setAttribute('type', 'button');
			this._elCloseIconBtn.classList.add(this.primaryCssClass + '-close-icon-btn');
			this._elCloseIconBtn.setAttribute('aria-label', 'Close');

			this._elCloseIcon = document.createElement('span');
			this._elCloseIcon.setAttribute('aria-hidden', 'true');
			this._elCloseIcon.classList.add(this.primaryCssClass + '-close-icon');
			this._elCloseIcon.classList.add(this.primaryCssClass + '-default-close-icon');

			this._elCloseIconBtn.appendChild(this._elCloseIcon);

			this._elHeader = document.createElement('div');
			this._elHeader.classList.add(this.primaryCssClass + '-header');

			this._elPrompt = document.createElement('div');
			this._elPrompt.classList.add(this.primaryCssClass + '-prompt');
			this._elPromptIcon = document.createElement('img');
			this._elPromptIcon.classList.add(this.primaryCssClass + '-prompt-icon');
			this._elPromptText = document.createElement('span');
			this._elPromptText.classList.add(this.primaryCssClass + '-prompt-text');

			this._elFooter = document.createElement('div');
			this._elFooter.classList.add(this.primaryCssClass + '-footer');

			this._elBtnOk = new Ch5Button();
			this._elBtnOk.setAttribute('type', 'success');
			this._elBtnOk.setAttribute('label', this.okButtonLabel);
			this._elBtnOk.classList.add(this.primaryCssClass + '-btn-ok');

			this._elBtnCancel = new Ch5Button();
			this._elBtnCancel.setAttribute('type', 'warning');
			this._elBtnCancel.setAttribute('label', this.cancelButtonLabel);
			this._elBtnCancel.classList.add(this.primaryCssClass + '-btn-cancel');

			this._elContents = document.createElement('div');
			this._elContents.classList.add(this.primaryCssClass + '-contents');

			this._elContainer.classList.add(this.primaryCssClass);
			this._elContainer.setAttribute('data-ch5-id', this.getCrId());

			this._elMask = document.createElement('div');
			this._elMask.classList.add(this.primaryCssClass + '-mask');
			this._elMask.classList.add(this.primaryCssClass + '-mask-default-style');
			this._elMask.setAttribute('cr-id', this.getCrId() + '-mask');
		} else {
			this._elCloseIconBtn = this.querySelector(`.${this.primaryCssClass}-close-icon-btn`) as HTMLElement;
			this._elCloseIcon = this.querySelector(`.${this.primaryCssClass}-close-icon`) as HTMLElement;
			this._elHeader = this.querySelector(`.${this.primaryCssClass}-header`) as HTMLElement;
			this._elPrompt = this.querySelector(`.${this.primaryCssClass}-prompt`) as HTMLElement;
			this._elPromptIcon = this.querySelector(`.${this.primaryCssClass}-prompt-icon`) as HTMLElement;
			this._elPromptText = this.querySelector(`.${this.primaryCssClass}-prompt-text`) as HTMLElement;
			this._elFooter = this.querySelector(`.${this.primaryCssClass}-footer`) as HTMLElement;
			this._elBtnOk = this.querySelector(`.${this.primaryCssClass}-btn-ok`) as Ch5Button;
			this._elBtnCancel = this.querySelector(`.${this.primaryCssClass}-btn-cancel`) as Ch5Button;
			this._elContents = this.querySelector(`.${this.primaryCssClass}-contents`) as HTMLElement;
			this._elContainer = existingModal as HTMLElement;
			this._elMask = this.querySelector(`.${this.primaryCssClass}-mask`) as HTMLElement;
		}
	}

	protected adjustInternalHtmlStructure() {
		const docFrag = document.createDocumentFragment();

		if (this.closable) {
			docFrag.appendChild(this._elCloseIconBtn);
		} else {
			this._elCloseIconBtn.remove();
		}

		if (this.title !== '') {
			this._elHeader.textContent = this.title;
			docFrag.appendChild(this._elHeader);
		} else if (this._elHeader) {
			this._elHeader.remove();
		}

		if (this.prompt !== '' || this.promptIcon !== '') {
			if (this.promptIcon !== '') {
				this._elPromptIcon.setAttribute('src', this.promptIcon);
				this._elPrompt.appendChild(this._elPromptIcon);
			} else if (this._elPromptIcon) {
				this._elPromptIcon.remove();
			}

			if (this.prompt !== '' && this._elPromptText instanceof Node) {
				this._elPromptText.textContent = this.prompt;
				this._elPrompt.appendChild(this._elPromptText);
				if (this._elPromptIcon instanceof Node) {
					this._elPrompt.insertBefore(this._elPromptIcon, this._elPromptText);
				}
			} else if (this._elPromptText instanceof Node) {
				this._elPromptText.remove();
			}

			docFrag.appendChild(this._elPrompt);
		} else if (this._elPrompt) {
			this._elPrompt.remove();
		}

		docFrag.appendChild(this._elContents);

		if (!this.hideOkButton || !this.hideCancelButton) {
			docFrag.appendChild(this._elFooter);
			if (!this.hideOkButton) {
				this._elFooter.appendChild(this._elBtnOk);
			} else if (this._elBtnOk) {
				this._elBtnOk.remove();
			}

			if (!this.hideCancelButton) {
				this._elFooter.appendChild(this._elBtnCancel);
			} else if (this._elBtnCancel) {
				this._elBtnCancel.remove();
			}
		} else if (this._elFooter) {
			this._elFooter.remove();
		}

		this._elContainer.appendChild(docFrag);
	}
}


Ch5ModalDialog.registerCustomElement();
Ch5ModalDialog.registerSignalAttributeTypes();