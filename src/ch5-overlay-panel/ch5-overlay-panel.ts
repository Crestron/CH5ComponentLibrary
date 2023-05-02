// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5Signal, Ch5SignalFactory } from "../ch5-core/index";
import { Ch5RoleAttributeMapping } from "../utility-models";
import { ICh5OverlayPanelAttributes, TCh5OverlayPanelOverflow, TCh5OverlayPanelPositionOffset, TCh5OverlayPanelStretch } from "./interfaces";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from '../ch5-common/ch5-signal-attribute-registry';
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import { Ch5Properties } from "../ch5-core/ch5-properties";

export class Ch5OverlayPanel extends Ch5Common implements ICh5OverlayPanelAttributes {

	public static readonly ELEMENT_NAME: string = 'ch5-overlay-panel';

	public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
		...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
		receivestatepositionto: { direction: "state", numericJoin: 1, contractName: true },
		receivestatepositionoffset: { direction: "state", numericJoin: 1, contractName: true },

		sendsignalonshow: { direction: "state", stringJoin: 1, contractName: true },
		sendsignalonhide: { direction: "state", stringJoin: 1, contractName: true },
		sendsignalonbeforeshow: { direction: "state", stringJoin: 1, contractName: true },
		sendsignalonaftershow: { direction: "state", stringJoin: 1, contractName: true },
		sendsignalonbeforehide: { direction: "state", stringJoin: 1, contractName: true },
		sendsignalonafterhide: { direction: "state", stringJoin: 1, contractName: true },
	};

	/**
	 * The first value is considered the default one
	 */
	public static POSITION_OFFSETS: TCh5OverlayPanelPositionOffset[] = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right', 'left-center', 'right-center'];
	public static STRETCHES: TCh5OverlayPanelStretch[] = ['both', 'width', 'height'];
	public static OVERFLOWS: TCh5OverlayPanelOverflow[] = ['scroll', 'show'];


	public static readonly COMPONENT_DATA: any = {
		POSITION_OFFSETS: {
			default: Ch5OverlayPanel.POSITION_OFFSETS[0],
			values: Ch5OverlayPanel.POSITION_OFFSETS,
			key: 'position_offset',
			classListPrefix: '--pos-'
		},
		STRETCH: {
			default: Ch5OverlayPanel.STRETCHES[0],
			values: Ch5OverlayPanel.STRETCHES,
			key: 'stretch',
			classListPrefix: '--stretch-'
		},
		OVERFLOWS: {
			default: Ch5OverlayPanel.OVERFLOWS[0],
			values: Ch5OverlayPanel.OVERFLOWS,
			key: 'overflow',
			classListPrefix: '--overflow-'
		},
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
			name: "positionTo",
			nameForSignal: "receiveStatePositionTo",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: Ch5OverlayPanel.POSITION_OFFSETS[0],
			enumeratedValues: Ch5OverlayPanel.POSITION_OFFSETS,
			name: "positionOffset",
			removeAttributeOnNull: true,
			nameForSignal: "receiveStatePositionOffset",
			type: "enum",
			valueOnAttributeEmpty: Ch5OverlayPanel.POSITION_OFFSETS[0],
			isObservableProperty: true
		},
		{
			default: "",
			isSignal: true,
			name: "sendEventOnBeforeShow",
			signalType: "string",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: "",
			isSignal: true,
			name: "sendEventOnHide",
			signalType: "string",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: "",
			isSignal: true,
			name: "sendEventOnBeforeShow",
			signalType: "string",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: "",
			isSignal: true,
			name: "sendEventOnAfterShow",
			signalType: "string",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: "",
			isSignal: true,
			name: "sendEventOnBeforeHide",
			signalType: "string",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: "",
			isSignal: true,
			name: "sendEventOnAfterHide",
			signalType: "string",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: "",
			isSignal: true,
			name: "receiveStatePositionTo",
			signalType: "string",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: "",
			isSignal: true,
			name: "receiveStatePositionOffset",
			signalType: "string",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		}
	];

	public primaryCssClass = 'ch5-overlay-panel';

	public _ch5Properties: Ch5Properties

	/**
	 * A div element that wraps the internal structure of the overlay
	 */
	protected _elContainer: HTMLElement = {} as HTMLElement;
	/**
	 * An element that wraps the contents of the overlay. The contents are the html elements that were initially enclosed
	 * between the overlay tags
	 */
	protected _elContents: HTMLElement = {} as HTMLElement;
	/**
	 * The close icon element. ( This si wrapped in the _elCloseIconBtn element
	 */
	protected _elCloseIcon: HTMLElement = {} as HTMLElement;
	/**
	 * The button that wraps the close icon
	 */
	protected _elCloseIconBtn: HTMLElement = {} as HTMLElement;

	protected _wasInstatiated: boolean = false;

	protected _isShown: boolean = false;

	protected _ready: Promise<any>;

	/**
	 * Events
	 *
	 * show
	 * hide
	 * beforeShow
	 * afterShow
	 * beforeHide
	 * afterHide
	 */

	protected _showEvent: Event;

	protected _hideEvent: Event;

	protected _beforeShowEvent: Event;

	protected _afterShowEvent: Event;

	protected _beforeHideEvent: Event;

	protected _afterHideEvent: Event;

	public static registerSignalAttributeTypes() {
		Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5OverlayPanel.ELEMENT_NAME, Ch5OverlayPanel.SIGNAL_ATTRIBUTE_TYPES);
	}

	public static registerCustomElement() {
		if (typeof window === "object"
			&& typeof window.customElements === "object"
			&& typeof window.customElements.define === "function") {
			window.customElements.define(Ch5OverlayPanel.ELEMENT_NAME, Ch5OverlayPanel);
		}
	}

	//#region Getters and Setters

	public set dismissable(value: boolean) {
		this._ch5Properties.set<boolean>("dismissable", value);
	}
	public get dismissable(): boolean {
		return this._ch5Properties.get<boolean>("dismissable");
	}

	public set closable(value: boolean) {
		this._ch5Properties.set<boolean>("closable", value, () => {
			this.updateForChangeInClosable();
		});
	}
	public get closable(): boolean {
		return this._ch5Properties.get<boolean>("closable");
	}

	public set closeIcon(value: string) {
		const prevValue = this.closeIcon === "" ? this.primaryCssClass + '-default-close-icon' : this.closeIcon;
		this._ch5Properties.set<string>("closeIcon", value, () => {
			this.handleCloseIcon(prevValue, value)
		})
	}
	public get closeIcon(): string {
		return this._ch5Properties.get<string>("closeIcon");
	}

	public set stretch(value: TCh5OverlayPanelStretch | null) {
		this._ch5Properties.set<TCh5OverlayPanelStretch | null>("stretch", value, () => {
			this.updateForChangeInStretch();
		});
	}
	public get stretch(): (TCh5OverlayPanelStretch | null) {
		return this._ch5Properties.get<TCh5OverlayPanelStretch | null>("stretch");
	}

	public set overflow(value: TCh5OverlayPanelOverflow) {
		this._ch5Properties.set<TCh5OverlayPanelOverflow>("overflow", value, () => {
			this.updateCssClasses();
		});
	}
	public get overflow(): TCh5OverlayPanelOverflow {
		return this._ch5Properties.get<TCh5OverlayPanelOverflow>("overflow");
	}

	public set positionTo(value: string) {
		this._ch5Properties.set<string>("positionTo", value, () => {
			this.updatePosition();
		});
	}
	public get positionTo(): string {
		return this._ch5Properties.get<string>("positionTo");
	}

	public set positionOffset(value: TCh5OverlayPanelPositionOffset) {
		this._ch5Properties.set<TCh5OverlayPanelPositionOffset>("positionOffset", value, () => {
			this.updatePosition();
		});
	}
	public get positionOffset(): TCh5OverlayPanelPositionOffset {
		return this._ch5Properties.get<TCh5OverlayPanelPositionOffset>("positionOffset");
	}

	public set receiveStatePositionTo(value: string) {
		this._ch5Properties.set("receiveStatePositionTo", value, null, (newValue: string) => {
			this._ch5Properties.setForSignalResponse<string>("positionTo", newValue, () => {
				this.updatePosition();
			});
		});
	}

	public get receiveStatePositionTo(): string {
		return this._ch5Properties.get<string>('receiveStatePositionTo');
	}

	public set receiveStatePositionOffset(value: string) {
		this._ch5Properties.set("receiveStatePositionOffset", value, null, (newValue: string) => {
			this._ch5Properties.setForSignalResponse<string>("positionOffset", newValue, () => {
				this.updatePosition();
			});
		});
	}

	public get receiveStatePositionOffset(): string {
		return this._ch5Properties.get<string>('receiveStatePositionOffset');
	}

	public set sendEventOnBeforeShow(value: string) {
		this._ch5Properties.set<string>("sendEventOnBeforeShow", value);
	}

	public get sendEventOnBeforeShow(): string {
		return this._ch5Properties.get<string>("sendEventOnBeforeShow");
	}

	public set sendEventOnAfterShow(value: string) {
		this._ch5Properties.set<string>("sendEventOnAfterShow", value);
	}

	public get sendEventOnAfterShow(): string {
		return this._ch5Properties.get<string>("sendEventOnAfterShow");
	}

	public set sendEventOnBeforeHide(value: string) {
		this._ch5Properties.set<string>("sendEventOnBeforeHide", value);
	}

	public get sendEventOnBeforeHide(): string {
		return this._ch5Properties.get<string>("sendEventOnBeforeHide");
	}

	public set sendEventOnAfterHide(value: string) {
		this._ch5Properties.set<string>("sendEventOnAfterHide", value);
	}

	public get sendEventOnAfterHide(): string {
		return this._ch5Properties.get<string>("sendEventOnAfterHide");
	}

	//#endregion


	public constructor() {
		super();
		this.info('Ch5OverlayPanel.constructor()');

		if (!this._wasInstatiated) {
			this.createInternalHtml();
			this._rebindEventCallbacks();
		}
		this._wasInstatiated = true;
		this._ch5Properties = new Ch5Properties(this, Ch5OverlayPanel.COMPONENT_PROPERTIES);


		this._showEvent = new CustomEvent('show', {
			bubbles: true,
			cancelable: false
		});

		this._hideEvent = new CustomEvent('hide', {
			bubbles: true,
			cancelable: false
		});

		this._beforeShowEvent = new CustomEvent('beforeShow', {
			bubbles: true,
			cancelable: false
		});

		this._afterShowEvent = new CustomEvent('afterShow', {
			bubbles: true,
			cancelable: false
		});

		this._beforeHideEvent = new CustomEvent('beforeHide', {
			bubbles: true,
			cancelable: false
		});

		this._afterHideEvent = new CustomEvent('afterHide', {
			bubbles: true,
			cancelable: false
		});

		this._ready = this._getReadyCheckPromise();
	}


	public connectedCallback() {
		this.info('called connectedCallback()');

		// WAI-ARIA Attributes
		if (!this.hasAttribute('role')) {
			this.setAttribute('role', Ch5RoleAttributeMapping.ch5OverlayPanel);
		}

		if (!this.hasAttribute('show')) {
			this.setAttributeAndProperty(this.COMMON_PROPERTIES.SHOW, false, true);
		}

		this._ready.then(() => {
			this._initialize();
			this.initCommonMutationObserver(this);
		}
		);
	}


	public disconnectedCallback() {
		this.info('called disconnectedCallback()');
		this.removeEventListeners();
		this.unsubscribeFromSignals();

		// disconnect common mutation observer
		this.disconnectCommonMutationObserver();
	}

	protected _initialize() {
		this.info('ch5-overlay-panel _initialize()');
		if (this._elContainer.parentElement !== this) {
			while (this.childNodes.length) {
				this._elContents.appendChild(this.childNodes[0]);
			}
			this.appendChild(this._elContainer);
		}

		this.cacheComponentChildrens();
		this.initAttributes();
		this.updateCssClasses();
		this.attachEventListeners();
	}

	protected generateListOfAllPossibleComponentCssClasses(): string[] {
		const cssClasses: string[] = [];
		cssClasses.push(this.primaryCssClass);

		// position offsets
		Ch5OverlayPanel.POSITION_OFFSETS.forEach((posOffset: TCh5OverlayPanelPositionOffset) => {
			const newCssClass = this.primaryCssClass + '--pos-' + posOffset;
			cssClasses.push(newCssClass);
		});

		// overflows
		Ch5OverlayPanel.OVERFLOWS.forEach((overflow: TCh5OverlayPanelOverflow) => {
			cssClasses.push(this.primaryCssClass + '--overflow-' + overflow);
		});

		// stretches
		Ch5OverlayPanel.STRETCHES.forEach((stretch: TCh5OverlayPanelStretch) => {
			if (stretch !== null) {
				cssClasses.push(this.primaryCssClass + '--stretch-' + stretch);
			}
		});

		return cssClasses;
	}


	public unsubscribeFromSignals() {
		super.unsubscribeFromSignals();
		this._ch5Properties.unsubscribe();
	}

	protected createInternalHtml() {
		this.info('ch5-overlay-panel create internal Html');

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

		this._elContents = document.createElement('div');
		this._elContents.classList.add(this.primaryCssClass + '-contents');

		this._elContainer.classList.add(this.primaryCssClass);
		this._elContainer.setAttribute('data-ch5-id', this.getCrId());

		// this._elContainer.appendChild(this._elCloseIconBtn);
		this._elContainer.appendChild(this._elContents);

	}

	protected updateCssClasses(): void {
		// apply css classes for attrs inherited from common (e.g. customClass, customStyle )
		super.updateCssClasses();

		this.info('called updateCssClasses()');

		const setOfCssClassesToBeApplied = new Set<string>();

		// primary
		setOfCssClassesToBeApplied.add(this.primaryCssClass);

		// overflow
		setOfCssClassesToBeApplied.add(this.primaryCssClass + '--overflow-' + this.overflow);

		const targetEl: HTMLElement = this.getTargetElementForCssClassesAndStyle();
		if (typeof targetEl.classList !== 'undefined') {
			this.generateListOfAllPossibleComponentCssClasses().forEach((cssClass: string) => {
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

	public static get observedAttributes() {
		const inheritedObsAttrs = Ch5Common.observedAttributes;
		const newObsAttrs: string[] = [];
		for (let i: number = 0; i < Ch5OverlayPanel.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5OverlayPanel.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				newObsAttrs.push(Ch5OverlayPanel.COMPONENT_PROPERTIES[i].name.toLowerCase());
			}
		}
		return inheritedObsAttrs.concat(newObsAttrs);
	}

	protected initAttributes() {
		super.initAttributes();

		const thisRef: any = this;
		for (let i: number = 0; i < Ch5OverlayPanel.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5OverlayPanel.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				if (this.hasAttribute(Ch5OverlayPanel.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
					const key = Ch5OverlayPanel.COMPONENT_PROPERTIES[i].name;
					thisRef[key] = this.getAttribute(key);
				}
			}
		}
	}

	protected attachEventListeners() {
		super.attachEventListeners();

		if (this._elCloseIconBtn) {
			this._elCloseIconBtn.addEventListener('click', this._clickedOnClose);
			window.addEventListener('keydown', this._handleKeyPress);
		}
		this.addEventListener('click', this._clickAndTouchEvent);
		this.addEventListener('touch', this._clickAndTouchEvent);

		this.addEventListener('show', this._onShow);
		this.addEventListener('hide', this._onHide);
		this.addEventListener('beforeShow', this._onBeforeShow);
		this.addEventListener('afterShow', this._onAfterShow);
		this.addEventListener('beforeHide', this._onBeforeHide);
		this.addEventListener('afterHide', this._onAfterHide);

	}

	protected removeEventListeners() {
		super.removeEventListeners();

		this._elCloseIconBtn.removeEventListener('click', this._clickedOnClose);
		window.removeEventListener('keydown', this._handleKeyPress);

		this.removeEventListener('show', this._onShow);
		this.removeEventListener('hide', this._onHide);
		this.removeEventListener('beforeShow', this._onBeforeShow);
		this.removeEventListener('afterShow', this._onAfterShow);
		this.removeEventListener('beforeHide', this._onBeforeHide);
		this.removeEventListener('afterHide', this._onAfterHide);

	}

	protected _rebindEventCallbacks() {
		this._onShow = this._onShow.bind(this);
		this._onHide = this._onHide.bind(this);
		this._onBeforeShow = this._onBeforeShow.bind(this);
		this._onAfterShow = this._onAfterShow.bind(this);
		this._onBeforeHide = this._onBeforeHide.bind(this);
		this._onAfterHide = this._onAfterHide.bind(this);
		this._clickedOnClose = this._clickedOnClose.bind(this);
		this._handleKeyPress = this._handleKeyPress.bind(this);
		this._dismissElement = this._dismissElement.bind(this);
		this._clickAndTouchEvent = this._clickAndTouchEvent.bind(this);
	}

	protected getTargetElementForCssClassesAndStyle(): HTMLElement {
		return this._elContainer;
	}

	protected _handleKeyPress(event: KeyboardEvent) {
		if (this.getAttribute('show') !== 'false' && event.key === 'Escape') {
			this.info('_handleKeyPress()');
			this.setAttributeAndProperty(this.COMMON_PROPERTIES.SHOW, false, true);
		}
	}

	protected _clickedOnClose(inEvent: Event) {
		this.info('_clickedOnClose()');
		this.setAttributeAndProperty(this.COMMON_PROPERTIES.SHOW, false, true);
	}

	protected _getReadyCheckPromise(): Promise<any> {
		return Promise.all([
			customElements.whenDefined('ch5-button'),
			customElements.whenDefined('ch5-form'),
			customElements.whenDefined('ch5-image'),
			customElements.whenDefined('ch5-list'),
			customElements.whenDefined('ch5-modal-dialog'),
			customElements.whenDefined('ch5-overlay-panel'),
			customElements.whenDefined('ch5-select'),
			customElements.whenDefined('ch5-slider'),
			customElements.whenDefined('ch5-spinner'),
			customElements.whenDefined('ch5-textinput'),
			customElements.whenDefined('ch5-toggle'),
			customElements.whenDefined('ch5-triggerview'),
			customElements.whenDefined('ch5-triggerview-child'),
		]);
	}
	/**
	 * Called when an HTML attribute is changed, added or removed
	 */
	public attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
		if (oldValue === newValue) {
			return;
		}

		this.logger.start("attributeChangedCallback", this.primaryCssClass);
		if (oldValue !== newValue) {
			this.logger.log('ch5-overlay-panel-prasaanth attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
			const attributeChangedProperty = Ch5OverlayPanel.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
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

	protected updateForChangeInStretch() {
		const parentEl = this.parentElement as HTMLElement;
		const targetEl = this.getTargetElementForCssClassesAndStyle();
		if (!parentEl) {
			this.info('updateForChangeInStretch() - parent element not found');
			return;
		}
		switch (this.stretch) {
			case 'width':
				targetEl.style.width = parentEl.offsetWidth + 'px';
				targetEl.style.height = "";
				break;
			case 'height':
				targetEl.style.height = parentEl.offsetHeight + 'px';
				targetEl.style.width = "";
				break;
			case 'both':
				targetEl.style.width = parentEl.offsetWidth + 'px';
				targetEl.style.height = parentEl.offsetHeight + 'px';
				break;
		}
	}

	protected updatePosition() {
		let refElementId = this.positionTo || '';
		if (refElementId === '') {
			this.info('updateForChangeInPositionTo() - incorrect reference id ');
			return;
		}
		if (refElementId.charAt(0) !== '#') {
			refElementId = '#' + refElementId;
		}

		const referenceElement = document.querySelector(refElementId) as HTMLElement;
		if (referenceElement && this.parentElement !== referenceElement.parentElement) {
			this._insertAfter(this, referenceElement);
		}

		const elementToReposition = this.getTargetElementForCssClassesAndStyle();
		if (!referenceElement) {
			this.info('updateForChangeInPositionTo() - reference element not found for id ' + refElementId);
			return;
		}

		switch (this.positionOffset) {
			// case '': // ts-lint:disable-line:no-switch-case-fall-through
			case 'top-left':
				elementToReposition.style.top = (referenceElement.offsetTop - elementToReposition.offsetHeight) + 'px';
				elementToReposition.style.left = referenceElement.offsetLeft + 'px';
				break;
			case 'top-center':
				elementToReposition.style.top = (referenceElement.offsetTop - elementToReposition.offsetHeight) + 'px';
				elementToReposition.style.left = (referenceElement.offsetLeft
					+ Math.floor(referenceElement.offsetWidth / 2)
					- Math.floor(elementToReposition.offsetWidth / 2)
				) + 'px';
				break;
			case 'top-right':
				elementToReposition.style.top = (referenceElement.offsetTop - elementToReposition.offsetHeight) + 'px';
				elementToReposition.style.left = (referenceElement.offsetLeft
					+ referenceElement.offsetWidth
					- elementToReposition.offsetWidth) + 'px';
				break;
			case 'bottom-left':
				elementToReposition.style.top = (referenceElement.offsetTop + referenceElement.offsetHeight) + 'px';
				elementToReposition.style.left = referenceElement.offsetLeft + 'px';
				break;
			case 'bottom-center':
				elementToReposition.style.top = (referenceElement.offsetTop + referenceElement.offsetHeight) + 'px';
				elementToReposition.style.left = (referenceElement.offsetLeft
					+ Math.floor(referenceElement.offsetWidth / 2)
					- Math.floor(elementToReposition.offsetWidth / 2)
				) + 'px';
				break;
			case 'bottom-right':
				elementToReposition.style.top = (referenceElement.offsetTop + referenceElement.offsetHeight) + 'px';
				elementToReposition.style.left = (referenceElement.offsetLeft
					+ referenceElement.offsetWidth
					- elementToReposition.offsetWidth) + 'px';
				break;
			case 'left-center':
				elementToReposition.style.top = (referenceElement.offsetTop
					- Math.floor(elementToReposition.offsetHeight / 2)
					+ Math.floor(referenceElement.offsetHeight / 2)
				) + 'px';
				elementToReposition.style.left = (referenceElement.offsetLeft - elementToReposition.offsetWidth) + 'px';
				break;
			case 'right-center':
				elementToReposition.style.top = (referenceElement.offsetTop
					- Math.floor(elementToReposition.offsetHeight / 2)
					+ Math.floor(referenceElement.offsetHeight / 2)
				) + 'px';
				elementToReposition.style.left = (referenceElement.offsetLeft + referenceElement.offsetWidth) + 'px';
				break;
		}
	}

	private handleCloseIcon(prevValue: string, value: string) {
		if (typeof this._elCloseIcon.classList === "undefined") {
			return;
		}
		if (prevValue !== value) {
			if ('' !== prevValue) {
				prevValue.split(' ').forEach((className: string) => {
					className = className.trim();
					if ('' !== className) {
						this._elCloseIcon.classList.remove(className); // remove previous class
					}
				});
			}
			if ('' !== value) {
				value.split(' ').forEach((className: string) => {
					className = className.trim();
					if ('' !== className) {
						this._elCloseIcon.classList.add(className); // adds the new icon class if present
					}
				});
			}
		}
	}

	protected _dismissElement(inEvent: Event) {
		this.info('_dismissElement()');

		if (false === this.dismissable) {
			this.info('_dismissElement() return ( dismissable is false)');
			return;
		}
		if (false === this._isShown) {
			this.info('_dismissElement() return ( _isShown is false)');
			return;
		}

		this.info('_dismissElement() inEvent', inEvent);
		this.setAttributeAndProperty(this.COMMON_PROPERTIES.SHOW, false, true);
	}

	protected _clickAndTouchEvent(event: Event) {
		event.stopPropagation();
	}

	protected updateForChangeInClosable() {
		if (true === this.closable) {
			this._elContainer.insertBefore(this._elCloseIconBtn, this._elContents);
		} else {
			this._elCloseIconBtn.remove();
		}
	}

	/**
	 * Runs when the show state was changed to true, before the change was processed.
	 */
	protected beforeHandlingShow(): void {
		this.info('beforeHandlingShow()');
		this.dispatchEvent(this._beforeShowEvent);
		this.dispatchEvent(this._showEvent);
		this._sendPulse(this.sendEventOnBeforeShow);
		return;
	}

	/**
	 * Runs when the show state was changed to true, after the change was processed.
	 */
	protected afterHandlingShow(): void {
		this.info('afterHandlingShow()');
		this.dispatchEvent(this._afterShowEvent);
		this._sendPulse(this.sendEventOnAfterShow);
		this.updatePosition();
		this._isShown = true;

		// Using EventLoop to attach event listener
		// to document only after all event pipeline was called ( mousedown -> mouseup -> click)
		// Attaching it when mousedown is triggered and that event being attached to document
		// this will be triggered as well.
		setTimeout(() => {
			document.addEventListener("click", this._dismissElement);
		}, 250);
	}

	/**
	 * Runs when the show state was changed to false, before the change is being handled
	 */
	protected beforeHandlingHide(): void {
		this.info('beforeHandlingHide()');
		this.dispatchEvent(this._beforeHideEvent);
		this._sendPulse(this.sendEventOnBeforeHide);

		document.removeEventListener("click", this._dismissElement);
	}

	/**
	 * Runs when the show state was changed to false, after the change was processed
	 */
	protected afterHandlingHide(): void {
		this.info('afterHandlingHide()');
		this.dispatchEvent(this._hideEvent);
		this.dispatchEvent(this._afterHideEvent);
		this._sendPulse(this.sendEventOnAfterHide);
		this._isShown = false;
		return;
	}

	//
	// Events
	//

	protected _onShow(inEvent: Event): void {
		this.info('_onShow()');
	}

	protected _onHide(inEvent: Event): void {
		this.info('_onHide()');
		this._onAfterHide(inEvent);
	}

	protected _onBeforeShow(inEvent: Event): void {
		this.info('_onBeforeShow()');
		// this._sendPulse(this.sendEventOnBeforeShow);
	}

	protected _onAfterShow(inEvent: Event): void {
		this.info('_onAfterShow()');
		// this._sendPulse(this.sendEventOnAfterShow);
	}

	protected _onBeforeHide(inEvent: Event): void {
		this.info('_onBeforeHide()');
		// this._sendPulse(this.sendEventOnBeforeHide);
	}

	protected _onAfterHide(inEvent: Event): void {
		this.info('_onAfterHide()');
		// this._sendPulse(this.sendEventOnAfterHide);
	}

	protected _sendPulse(sigName: string) {
		let sigToSend: Ch5Signal<boolean> | null = null;
		if ('' !== sigName
			&& 'undefined' !== typeof sigName
			&& null !== sigName) {

			sigToSend = Ch5SignalFactory.getInstance().getBooleanSignal(sigName);

			if (null !== sigToSend) {
				sigToSend.publish(true);
				sigToSend.publish(false);
			}
		}
	}

	private _insertAfter(el: Element, referenceNode: Element) {
		if (null !== referenceNode && null !== referenceNode.parentNode) {
			referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
		}
	}
}

Ch5OverlayPanel.registerCustomElement();
Ch5OverlayPanel.registerSignalAttributeTypes();