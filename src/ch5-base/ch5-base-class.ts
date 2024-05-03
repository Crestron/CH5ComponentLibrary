// Copyright (C) 2024 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5Signal, Ch5SignalFactory, Ch5Uid, publishEvent, subscribeInViewPortChange } from '../ch5-core';
import { Ch5Config } from '../ch5-common/ch5-config';
import { Ch5MutationObserver } from '../ch5-common/ch5-mutation-observer';
import isEmpty from 'lodash/isEmpty';
import { Ch5BaseLog } from './ch5-base-log';
import { ICh5CommonAttributes, TCh5ShowType } from '../ch5-common/interfaces';
import { Ch5SignalElementAttributeRegistryEntries } from '../ch5-common/ch5-signal-attribute-registry';
import { ICh5PropertySettings } from '../ch5-core/ch5-property';
import { Ch5Properties } from '../ch5-core/ch5-properties';
import * as util from '../ch5-common/utils';

export interface ICh5CommonProperties {
	appendClassWhenInViewPort: ICh5PropertySettings,
	customClass: ICh5PropertySettings,
	customStyle: ICh5PropertySettings,
	debug: ICh5PropertySettings,
	dir: ICh5PropertySettings,
	disabled: ICh5PropertySettings,
	id: ICh5PropertySettings,
	noshowType: ICh5PropertySettings,
	receiveStateCustomClass: ICh5PropertySettings,
	receiveStateCustomStyle: ICh5PropertySettings,
	receiveStateEnable: ICh5PropertySettings,
	receiveStateShow: ICh5PropertySettings,
	receiveStateShowPulse: ICh5PropertySettings,
	receiveStateHidePulse: ICh5PropertySettings,
	sendEventOnShow: ICh5PropertySettings,
	show: ICh5PropertySettings,
	trace: ICh5PropertySettings
}

export abstract class Ch5BaseClass extends HTMLElement implements ICh5CommonAttributes {

	//#region Variables

	public static readonly DIRECTION: string[] = ['ltr', 'rtl'];
	public static readonly NO_SHOW_TYPES: TCh5ShowType[] = ['display', 'visibility', 'remove'];

	public static ELEMENT_NAME = "Ch5BaseClass";
	protected COMPONENT_NAME = "Ch5BaseClass";
	public primaryCssClass: string = 'ch5-base-class';

	public childrenOfCurrentNode: [HTMLElement] | null = null;
	protected _isInstantiated: boolean = false;

	protected _nextSiblingIndexInParentChildNodes: number = 0;

	protected _onrelease: {} = {};

	protected _onpress: {} = {};

	// Ch5 internal unique ID
	protected _crId: string = '';


	private readonly CSS_CLASS_FOR_HIDE_VISIBILITY = 'ch5-hide-vis'; // CSS class name for noshowtype = visibility
	private readonly CSS_CLASS_FOR_HIDE_DISPLAY = 'ch5-hide-dis'; // CSS class name for noshowtype = none
	/**
	 * Cached parent element. Used in the case when noshowType is set to remove and the component has to be reattached to the DOM
	 */
	protected _cachedParentEl: Node | null = null;

	/**
	 * Cached sibling element. The one that immediately follows the current element. Used in the case when noshowType
	 * is set to remove and the component has to be reattached to the DOM
	 */
	protected _cachedNextSibling: Node | null = null;

	protected _isDetachedFromDom: boolean = false;
	/**
	 * When noshowType is 'remove' and the element was removed from the DOM this gets set to true
	 * If this is true then the component will not unsubscribe from signals on removal from DOM (as a consequence of a show signal change)
	 */
	protected _keepListeningOnSignalsAfterRemoval = false;

	/**
	 * boolean value - element is present or not in viewport
	 */
	public elementIsInViewPort: boolean = true;

	/**
	 * Whenever the target meets a threshold specified for the IntersectionObserver,
	 * the callback is invoked. The callback receives a list of IntersectionObserverEntry objects
	 */
	public elementIntersectionEntry: IntersectionObserverEntry = {} as IntersectionObserverEntry;

	/**
	 * boolean value - element is visible or not
	 */
	public elementIsVisible: boolean = true;

	public logger: Ch5BaseLog;

	private _commonMutationObserver: Ch5MutationObserver = {} as Ch5MutationObserver;
	private _subscribeAppendClassWhenInViewPort: boolean = false;

	protected _ch5Properties: Ch5Properties;
	public componentProperties: ICh5PropertySettings[] = [];
	public static COMPONENT_PROPERTIES: ICh5PropertySettings[] = [];
	public static readonly BASE_COMPONENT_PROPERTIES: ICh5PropertySettings[] = [
		{
			default: "",
			name: "appendClassWhenInViewPort",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: "",
			name: "id",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: "",
			name: "customClass",
			nameForSignal: "receiveStateCustomClass",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: "",
			name: "customStyle",
			nameForSignal: "receiveStateCustomStyle",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: true,
			name: "disabled",
			nameForSignal: "receiveStateEnable",
			removeAttributeOnNull: true,
			type: "boolean",
			valueOnAttributeEmpty: true,
			isObservableProperty: true
		},
		{
			default: Ch5BaseClass.DIRECTION[0],
			name: "dir",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: Ch5BaseClass.DIRECTION[0],
			isObservableProperty: true
		},
		{
			default: true,
			name: "show",
			nameForSignal: "receiveStateShow",
			removeAttributeOnNull: true,
			type: "boolean",
			valueOnAttributeEmpty: true,
			isObservableProperty: true
		},
		{
			default: false,
			name: "debug",
			removeAttributeOnNull: true,
			type: "boolean",
			valueOnAttributeEmpty: true,
			isObservableProperty: true
		},
		{
			default: false,
			name: "trace",
			removeAttributeOnNull: true,
			type: "boolean",
			valueOnAttributeEmpty: true,
			isObservableProperty: true
		},
		{
			default: Ch5BaseClass.NO_SHOW_TYPES[0],
			enumeratedValues: Ch5BaseClass.NO_SHOW_TYPES,
			name: "noshowType",
			removeAttributeOnNull: true,
			type: "enum",
			valueOnAttributeEmpty: Ch5BaseClass.NO_SHOW_TYPES[0],
			isObservableProperty: true
		},
		{
			default: "",
			isSignal: true,
			name: "receiveStateCustomClass",
			signalType: "string",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: "",
			isSignal: true,
			name: "receiveStateCustomStyle",
			signalType: "string",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: "",
			isSignal: true,
			name: "receiveStateEnable",
			signalType: "boolean",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: "",
			isSignal: true,
			name: "receiveStateShow",
			signalType: "boolean",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: "",
			isSignal: true,
			name: "receiveStateShowPulse",
			signalType: "boolean",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: "",
			isSignal: true,
			name: "receiveStateHidePulse",
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
		}
	];

	public static readonly COMMON_PROPERTIES: ICh5CommonProperties = {
		appendClassWhenInViewPort: this.getCommonProperty("appendClassWhenInViewPort"),
		customClass: this.getCommonProperty("customClass"),
		customStyle: this.getCommonProperty("customStyle"),
		debug: this.getCommonProperty("debug"),
		dir: this.getCommonProperty("dir"),
		disabled: this.getCommonProperty("disabled"),
		id: this.getCommonProperty("id"),
		noshowType: this.getCommonProperty("noshowType"),
		receiveStateCustomClass: this.getCommonProperty("receiveStateCustomClass"),
		receiveStateCustomStyle: this.getCommonProperty("receiveStateCustomStyle"),
		receiveStateEnable: this.getCommonProperty("receiveStateEnable"),
		receiveStateShow: this.getCommonProperty("receiveStateShow"),
		receiveStateShowPulse: this.getCommonProperty("receiveStateShowPulse"),
		receiveStateHidePulse: this.getCommonProperty("receiveStateHidePulse"),
		sendEventOnShow: this.getCommonProperty("sendEventOnShow"),
		show: this.getCommonProperty("show"),
		trace: this.getCommonProperty("trace")
	};

	//#endregion

	//#region Setters and Getters

	public set appendClassWhenInViewPort(value: string) {
		this._ch5Properties.set<string>("appendClassWhenInViewPort", value, () => {
			if (!this._subscribeAppendClassWhenInViewPort) {
				this._subscribeAppendClassWhenInViewPort = true;
				subscribeInViewPortChange(this, (isInViewPort: boolean) => {
					this.updateElementVisibility(isInViewPort);
					this.updateInViewPortClass();
				});
			}
		});
	}
	public get appendClassWhenInViewPort(): string {
		return this._ch5Properties.get<string>("appendClassWhenInViewPort");
	}

	public set customClass(value: string) {
		this._ch5Properties.set<string>("customClass", value, () => {
			this.updateForChangeInCustomCssClass(this._ch5Properties.getPrevious<string>("customClass").split(" "));
		});
	}
	public get customClass(): string {
		return this._ch5Properties.get<string>("customClass");
	}

	public set customStyle(value: string) {
		this._ch5Properties.set<string>("customStyle", value, () => {
			this.updateForChangeInCustomStyle();
		});
	}
	public get customStyle(): string {
		return this._ch5Properties.get<string>("customStyle");
	}

	public set debug(value: boolean) {
		this._ch5Properties.set<boolean>("debug", value, () => {
			this.logger.isDebugEnabled = this.debug;
		});
	}
	public get debug(): boolean {
		return this._ch5Properties.get<boolean>("debug");
	}

	public set dir(value: string) {
		this._ch5Properties.set<string>("dir", value);
	}
	public get dir(): string {
		return this._ch5Properties.get<string>("dir");
	}

	public set disabled(value: boolean) {
		this._ch5Properties.set<boolean>("disabled", value, () => {
			this.updateForChangeInDisabledStatus();
		});
	}
	public get disabled(): boolean {
		return this._ch5Properties.get<boolean>("disabled");
	}

	public set id(value: string) {
		this._ch5Properties.set<string>("id", value);
	}
	public get id(): string {
		return this._ch5Properties.get<string>("id");
	}

	public set noshowType(value: TCh5ShowType) {
		this._ch5Properties.set<TCh5ShowType>("noshowType", value, () => {
			this.updateForChangeInShowStatus();
		});
	}
	public get noshowType(): TCh5ShowType {
		return this._ch5Properties.get<TCh5ShowType>("noshowType");
	}

	public set receiveStateCustomClass(value: string) {
		this._ch5Properties.set("receiveStateCustomClass", value, null, (newValue: string) => {
			this._ch5Properties.setForSignalResponse<string>("customClass", newValue, () => {
				this.updateForChangeInCustomCssClass(this._ch5Properties.getPrevious<string>("customClass").split(" "));
			});
		});
	}

	public get receiveStateCustomClass(): string {
		return this._ch5Properties.get<string>("receiveStateCustomClass");
	}

	public set receiveStateCustomStyle(value: string) {
		this._ch5Properties.set("receiveStateCustomStyle", value, null, (newValue: string) => {
			this._ch5Properties.setForSignalResponse<string>("customStyle", newValue, () => {
				this.updateForChangeInCustomStyle();
			});
		});
	}
	public get receiveStateCustomStyle(): string {
		return this._ch5Properties.get<string>("receiveStateCustomStyle");
	}

	public set show(value: boolean) {
		this._ch5Properties.set<boolean>("show", value, () => {
			this.updateForChangeInShowStatus();
		});
	}
	public get show(): boolean {
		return this._ch5Properties.get<boolean>("show");
	}

	public set receiveStateEnable(value: string) {
		this._ch5Properties.set("receiveStateEnable", value, null, (newValue: boolean) => {
			this._ch5Properties.setForSignalResponse<boolean>("disabled", newValue, () => {
				this.updateForChangeInDisabledStatus();
			});
		});
	}
	public get receiveStateEnable(): string {
		return this._ch5Properties.get<string>("receiveStateEnable");
	}

	public set receiveStateHidePulse(value: string) {
		this._ch5Properties.set("receiveStateHidePulse", value, null, (newValue: boolean) => {
			this._ch5Properties.setForSignalResponse<boolean>("show", newValue, () => {
				// this._subKeySigReceiveHidePulse = recSig.subscribe((newVal: boolean) => {
				// 	this.logger.log(' subs callback for signalReceiveHidePulse: ', this._subKeySigReceiveHidePulse, ' Signal has value ', newVal);
				// 	if (null !== recSig) {
				// 		if (false === recSig.prevValue && true === newVal) {
				// 			this.setAttribute('show', 'false');
				// 		}
				// 	} else {
				// 		this.logger.log(' subs callback for signalReceiveHidePulse: ', this._subKeySigReceiveHidePulse, ' recSig is null');
				// 	}
				// });
				const targetElement: HTMLElement = this;
				this.handleHide(targetElement);
			});
		});
	}

	public get receiveStateHidePulse(): string {
		return this._ch5Properties.get<string>("receiveStateHidePulse");
	}

	public set receiveStateShowPulse(value: string) {
		this._ch5Properties.set("receiveStateShowPulse", value, null, (newValue: boolean) => {
			this._ch5Properties.setForSignalResponse<boolean>("show", newValue, () => {
				// const _newVal = (newVal as never as { repeatdigital: boolean }).repeatdigital !== undefined ? (newVal as never as { repeatdigital: boolean }).repeatdigital : newVal;
				// if ((recSig.prevValue as never as { repeatdigital: boolean }).repeatdigital !== undefined) {
				// 	if (false === (recSig.prevValue as never as { repeatdigital: boolean }).repeatdigital && true === _newVal) {
				// 		this.setAttribute('show', 'true');
				// 	}
				// 	return;
				// }
				// if (false === recSig.prevValue && true === _newVal) {
				// 	this.setAttribute('show', 'true');
				// }
				const targetElement: HTMLElement = this;
				this.handleShow(targetElement);
			});
		});
	}
	public get receiveStateShowPulse(): string {
		return this._ch5Properties.get<string>("receiveStateShowPulse");
	}

	public set receiveStateShow(value: string) {
		this._ch5Properties.set("receiveStateShow", value, null, (newValue: boolean) => {
			this._ch5Properties.setForSignalResponse<boolean>("show", newValue, () => {
				this.updateForChangeInShowStatus();
			});
		});
	}

	public get receiveStateShow(): string {
		return this._ch5Properties.get<string>("receiveStateShow");
	}

	public set sendEventOnShow(value: string) {
		this._ch5Properties.set("sendEventOnShow", value, () => {
			this.sendShowSignal(Boolean(value));
		});
	}
	public get sendEventOnShow(): string {
		return this._ch5Properties.get<string>("sendEventOnShow");
	}

	// TODO - why do we need this
	public set onrelease(callback: {}) {
		this._onrelease = callback;
	}

	public get onrelease(): {} {
		return this._onrelease;
	}

	public set onpress(callback: {}) {
		this.logger.log("set onpress");
		this._onpress = callback;
	}

	public get onpress(): {} {
		this.logger.log("get onpress");
		return this._onpress;
	}

	public set trace(value: boolean) {
		this._ch5Properties.set<boolean>("trace", value, () => {
			this.logger.isTraceEnabled = this.trace;
		});
	}
	public get trace(): boolean {
		return this._ch5Properties.get<boolean>("trace");
	}

	protected get util() {
		return util;
	}
	//#endregion

	//#region Lifecycle Hooks

	public constructor(componentInputProperties: ICh5PropertySettings[]) {
		super();
		this._crId = Ch5Uid.getUid();
		const debugAttribute = this.hasAttribute("debug") ? this.util.toBoolean(this.getAttribute("debug"), true) : false;
		const traceAttribute = this.hasAttribute("trace") ? this.util.toBoolean(this.getAttribute("trace"), true) : false;
		this.logger = new Ch5BaseLog(this.COMPONENT_NAME, debugAttribute, traceAttribute, this._crId);
		this.componentProperties = componentInputProperties;
		// Ch5BaseClass.COMPONENT_PROPERTIES = componentInputProperties;
		Ch5BaseClass.selectedComponentProperties = componentInputProperties;
		this._ch5Properties = new Ch5Properties(this, this.componentProperties);
	}

	//#endregion

	//#region Property Specific Methods


	//#endregion

	//#region Other Methods

	/**
	 * In Angular the content of the template element is not passed in
	 * a document-fragment. This can break functionalities of ch5-spinner / ch5-list when
	 * used inside ch5-template or any other component that should copy this component.
	 *
	 * @return {void}
	 */
	public resolveTemplateChildren(template: HTMLTemplateElement): void {
		if (!template) {
			return;
		}

		if (this.util.isNotNil(template.content) && template.content.childElementCount === 0 && template.children.length > 0) {
			Array.from(template.children).forEach((child) => {
				template.content.appendChild(child);
			});
		}
	}

	// DO NOT remove
	protected static get selectedComponentProperties(): ICh5PropertySettings[] {
		return this.COMPONENT_PROPERTIES;
	}
	protected static set selectedComponentProperties(value: ICh5PropertySettings[]) {
		this.COMPONENT_PROPERTIES = value;
	}

	public static get observedAttributes(): string[] {
		const inheritedObsAttrs: ICh5PropertySettings[] = this.selectedComponentProperties;
		const newObsAttrs: string[] = [];
		for (let i: number = 0; i < inheritedObsAttrs.length; i++) {
			if (inheritedObsAttrs[i].isObservableProperty === true) {
				newObsAttrs.push(inheritedObsAttrs[i].name.toLowerCase());
			}
		}
		return newObsAttrs;
	}

	/**
	 * Returns the internal ch5 unique identifier assigned to the component
	 */
	public getCrId(): string {
		return this._crId;
	}

	private static getCommonProperty(name: string) {
		// The parse and stringify are to be checked if required or not
		return JSON.parse(JSON.stringify(Ch5BaseClass.BASE_COMPONENT_PROPERTIES.find((data: ICh5PropertySettings) => data.name === name)));
	}

	// public attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
	// 	if (oldValue === newValue || this.ignoreAttributes.includes(attr.toLowerCase())) {
	// 		return;
	// 	}
	// 	this.logger.log('ch5-common attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + ')"');

	// 	switch (attr) {
	// 		case 'show':
	// 			this.show = newValue as unknown as boolean;
	// 			break;
	// 		case 'receivestateshow':
	// 			if (this.hasAttribute('receivestateshow')) {
	// 				this.receiveStateShow = this.getAttribute('receivestateshow') as string;
	// 			} else {
	// 				this.clearBooleanSignalSubscription(this._receiveStateShow, this._subKeySigReceiveShow);
	// 				this._sigNameSendOnShow = '';
	// 			}
	// 			break;
	// 		case 'receivestateshowpulse':
	// 			if (this.hasAttribute('receivestateshowpulse')) {
	// 				this.receiveStateShowPulse = this.getAttribute('receivestateshowpulse') as string;
	// 			} else {
	// 				this.clearBooleanSignalSubscription(this._receiveStateShowPulse, this._subKeySigReceiveShowPulse);
	// 				this._receiveStateShowPulse = '';
	// 			}
	// 			break;
	// 		case 'receivestatehidepulse':
	// 			if (this.hasAttribute('receivestatehidepulse')) {
	// 				this.receiveStateHidePulse = this.getAttribute('receivestatehidepulse') as string;
	// 			} else {
	// 				this.clearBooleanSignalSubscription(this._receiveStateHidePulse, this._subKeySigReceiveHidePulse);
	// 				this._receiveStateHidePulse = '';
	// 			}
	// 			break;
	// 		case 'receivestateenable':
	// 			if (this.hasAttribute('receivestateenable')) {
	// 				this.receiveStateEnable = this.getAttribute('receivestateenable') as string;
	// 			} else {
	// 				this.clearBooleanSignalSubscription(this._receiveStateEnable, this._subKeySigReceiveEnable);
	// 				this._receiveStateEnable = '';
	// 			}
	// 			break;
	// 		case 'sendeventonshow':
	// 			if (this.hasAttribute('sendeventonshow')) {
	// 				this.sigNameSendOnShow = this.getAttribute('sendeventonshow') as string;
	// 			} else {
	// 				this._sigSendOnShow = null;
	// 				this._sigNameSendOnShow = '';
	// 			}
	// 			break;
	// 	}
	// }
	public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
		this.logger.log('attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
		if (oldValue !== newValue) {
			const attributeChangedProperty = this.componentProperties.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
			if (attributeChangedProperty) {
				const thisRef: any = this;
				const key = attributeChangedProperty.name;
				thisRef[key] = newValue;
			}
		}
		this.logger.stop();
	}


	/**
	 * Called when the Ch5QrCode component is first connected to the DOM
	 */
	public connectedCallback() {
		// this.logger.start('connectedCallback()');
		// // WAI-ARIA Attributes
		// if (!this.hasAttribute('role')) {
		// 	this.setAttribute('role', Ch5RoleAttributeMapping.ch5QrCode);
		// }
		// // if (this._elContainer.parentElement !== this) {
		// // 	this._elContainer.classList.add('ch5-qrcode');
		// // 	this.appendChild(this._elContainer);
		// // }
		// this.initAttributes();
		// this.initCommonMutationObserver(this);

		// // customElements.whenDefined(Ch5Base.ELEMENT_NAME).then(() => {
		// // 	this.componentLoadedEvent(Ch5Base.ELEMENT_NAME, this.id);
		// // });
		// this.logger.stop();
	}

	public disconnectedCallback() {
		this.logger.start('disconnectedCallback()');
		this.unsubscribeFromSignals();
		this.logger.stop();
	}
	/**
	 * Storing the component defined template used on repainting to be able to
	 * restore the template initially defined again.
	 * This method should be called before any action is did on component template.
	 *
	 * @return {void}
	 */
	protected cacheComponentChildrens(): void {
		// Note:
		// * changed element:Element to element:any to fix typedoc issue with element.isConnected.
		// ( changing to element:Node did not work even though Node is the object that has the isConnected property
		// https://developer.mozilla.org/en-US/docs/Web/API/Node/isConnected )
		this.childrenOfCurrentNode = Array.from(this.children).filter((element: any) => {
			return element.isConnected;
		}) as [HTMLElement];
	}

	/**
	 * Repaint the component by detach the component from the DOM and
	 * attaching it again.
	 *
	 * @private
	 * @memberof Ch5TextInput
	 * @return {void}
	 */
	protected repaint(): void {
		try {
			const parentNode: HTMLElement = this.parentNode as HTMLElement;

			this._isInstantiated = false;

			if (this.hasChildNodes() === true) {
				for (let i = this.childNodes.length; i--;) {

					let validToRemove = true;

					if (this.childrenOfCurrentNode && this.childrenOfCurrentNode.length > 0) {
						Array.from(this.childrenOfCurrentNode as [HTMLElement]).filter((element: HTMLElement) => {
							if (element !== null && Object.is(element, this.childNodes[i])) {
								validToRemove = false;
							}
						});
					}

					if (validToRemove === true) {
						this.removeChild(this.childNodes[i]);
					}
				}

				const _shortLifeElement = document.createElement('div');
				if (parentNode !== null) {
					parentNode.insertBefore(_shortLifeElement, this.nextSibling);
					this.remove();
					(_shortLifeElement.parentNode as HTMLElement).insertBefore(this, _shortLifeElement.nextSibling);
					_shortLifeElement.remove();
				}
			}
		} catch (e) {
			console.log('Error encountered during repaint ' + ' crId: ' + this.getCrId() + ' error ', e)
		}
	}

	/**
	 * Placeholder. Should be extended in child classes
	 */
	protected updateCssClasses() {
		this.logger.log("from common - updateCssClasses()");
		// placeholder;
	}

	protected updateForChangeInCustomCssClass(_prevAddedCustomClasses: string[]) {
		const targetElement: HTMLElement = this.getTargetElementForCssClassesAndStyle();
		this.logger.start("updateForChangeInCustomCssClass()");
		this.logger.log("updateForChangeInCustomCssClass(): _prevAddedCustomClasses - ", _prevAddedCustomClasses);
		this.logger.log("from common - updateForChangeInCustomCssClass()", this.customClass);

		_prevAddedCustomClasses.forEach((className: string) => {
			if ('' !== className) {
				targetElement.classList.remove(className);
			}
		});
		_prevAddedCustomClasses = [];

		this.customClass.split(' ').forEach((className: string) => {
			if ('' !== className) {
				_prevAddedCustomClasses.push(className);
				targetElement.classList.add(className);
			}
		});
		this.logger.stop();
	}

	protected updateForChangeInCustomStyle() {
		const targetElement: HTMLElement = this.getTargetElementForCssClassesAndStyle();
		targetElement.style.cssText = this.customStyle;
	}

	protected updateForChangeInShowStatus() {
		const targetElement: HTMLElement = this;

		// this.logger.log("from common - updateForChangeInShowStatus()");
		// if (this.hasAttribute('noshowtype')) {
		// 	this.noshowType = this.getAttribute('noshowtype') as TCh5ShowType;
		// } else {
		// 	this.noshowType = 'display';
		// }

		if (this.show === false) {
			this.handleHide(targetElement);
		} else {
			this.handleShow(targetElement);
		}
	}

	protected handleHide(targetElement: HTMLElement) {
		this.beforeHandlingHide();
		this.logger.log('handleHide');
		this.sendShowSignal(false);

		targetElement.classList.remove(this.CSS_CLASS_FOR_HIDE_DISPLAY);
		targetElement.classList.remove(this.CSS_CLASS_FOR_HIDE_VISIBILITY);

		switch (this.noshowType) {
			case 'visibility':
				targetElement.classList.add(this.CSS_CLASS_FOR_HIDE_VISIBILITY);
				break;
			case 'display':
				targetElement.classList.add(this.CSS_CLASS_FOR_HIDE_DISPLAY);
				break;
			case 'remove':
				if (this.parentElement?.tagName.toLowerCase() === "ch5-modal-dialog" || this.parentElement?.tagName.toLowerCase() === "ch5-overlay-panel") {
					setTimeout(() => {
						// This is done for modal since the content is not inside template. The structure of modal and overlay must change for better code: CH5C-4002
						if (null !== this.parentElement && undefined !== this.parentElement) {
							this._cachedParentEl = this.parentElement;
							this.logger.log(' removes element from DOM due to change in show signal, cached parent element');
							if (null !== this.nextElementSibling && undefined !== this.nextElementSibling) {
								this._nextSiblingIndexInParentChildNodes = (Array.from(this.parentElement.childNodes)).findIndex(item => item === this.nextElementSibling)
								this._cachedNextSibling = this.nextElementSibling;
								this.logger.log(' cached sibling element');
							}
							this._keepListeningOnSignalsAfterRemoval = true;
							this._isDetachedFromDom = true;
							this.parentElement.removeChild(this);
						}
					});
				} else {
					if (null !== this.parentElement && undefined !== this.parentElement) {
						this._cachedParentEl = this.parentElement;
						this.logger.log(' removes element from DOM due to change in show signal, cached parent element');
						if (null !== this.nextElementSibling && undefined !== this.nextElementSibling) {
							this._nextSiblingIndexInParentChildNodes = (Array.from(this.parentElement.childNodes)).findIndex(item => item === this.nextElementSibling)
							this._cachedNextSibling = this.nextElementSibling;
							this.logger.log(' cached sibling element');
						}
						this._keepListeningOnSignalsAfterRemoval = true;
						this._isDetachedFromDom = true;
						this.parentElement.removeChild(this);
					}
				}
				break;
		}
		this.afterHandlingHide();
	}

	protected handleShow(targetElement: HTMLElement) {
		this.beforeHandlingShow();
		this.logger.log('handleShow');
		targetElement.classList.remove(this.CSS_CLASS_FOR_HIDE_DISPLAY);
		targetElement.classList.remove(this.CSS_CLASS_FOR_HIDE_VISIBILITY);

		if (null !== this._cachedParentEl && typeof this._cachedParentEl !== 'undefined') {
			const cp = this._cachedParentEl;
			this._cachedParentEl = null;

			if (null !== this._cachedNextSibling
				&& typeof this._cachedNextSibling !== 'undefined'
				&& cp === this._cachedNextSibling.parentElement) {
				const cs = this._cachedNextSibling;
				this._cachedNextSibling = null;
				cp.insertBefore(this, cs);
				this.logger.log(' inserted element before cached sibling due to change in show signal')
				this._keepListeningOnSignalsAfterRemoval = false;

			} else {
				if (this._nextSiblingIndexInParentChildNodes) {
					const cs = cp.childNodes[this._nextSiblingIndexInParentChildNodes];
					cp.insertBefore(this, cs);
				} else {
					cp.appendChild(this);
				}
				this.logger.log(' appended element to parent due to change in show signal')
				this._keepListeningOnSignalsAfterRemoval = false;
			}
			this._isDetachedFromDom = false;
		}

		this.sendShowSignal(true);
		this.afterHandlingShow();
	}

	/**
	 * Placeholder method. If needed can be overridden in child classes
	 */
	protected beforeHandlingShow() {
		// this.logger.log('common - beforeHandlingShow()');
		return;
	}

	/**
	 * Placeholder method. If needed can be overridden in child classes
	 */
	protected afterHandlingShow() {
		// this.logger.log('common - afterHandlingShow()');
		return;
	}

	/**
	 * Placeholder method. If needed can be overridden in child classes
	 */
	protected beforeHandlingHide() {
		// this.logger.log('common - beforeHandlingHide()');
		return;
	}

	/**
	 * Placeholder method. If needed can be overridden in child classes
	 */
	protected afterHandlingHide() {
		// this.logger.log('common - afterHandlingHide()');
		return;
	}

	protected updateForChangeInDisabledStatus() {
		this.logger.log("updateForChangeInDisabledStatus()");
		const targetElement: HTMLElement = this.getTargetElementForCssClassesAndStyle();
		targetElement.classList.remove(this.getCssClassDisabled());
		if (this.disabled === true) {
			targetElement.classList.add(this.getCssClassDisabled());
		}
	}

	protected getTargetElementForCssClassesAndStyle(): HTMLElement {
		return this as HTMLElement;
	}

	/**
	 * Initializes the values of the common attributes, taking into account the attribute values declared in the HTML
	 */
	protected initAttributes() {
		this.applyPreConfiguredAttributes();

		const thisRef: any = this;
		for (let i: number = 0; i < this.componentProperties.length; i++) {
			// this.dir = this.getAttribute('dir') || Ch5BaseClass.DIRECTION[0];
			if (this.componentProperties[i].isObservableProperty === true) {
				if (this.hasAttribute(this.componentProperties[i].name.toLowerCase())) {
					const key = this.componentProperties[i].name;
					thisRef[key] = this.getAttribute(key);
				}
			}
		}
	}

	/**
	 * Helper method. For internal use.
	 */
	protected clearStringSignalSubscription(sigName: string | null | undefined, subscriptionKey: string) {
		let oldSig: Ch5Signal<string> | null = null;
		if (sigName) {
			const subSigName: string = Ch5Signal.getSubscriptionSignalName(sigName);
			oldSig = Ch5SignalFactory.getInstance().getStringSignal(subSigName);
		}
		if (null !== oldSig && '' !== subscriptionKey) {
			oldSig.unsubscribe(subscriptionKey);
		}
	}

	/**
	 * Helper method. For internal use.
	 */
	protected clearBooleanSignalSubscription(sigName: string | null | undefined, subscriptionKey: string) {
		let oldSig: Ch5Signal<boolean> | null = null;
		if (sigName) {
			const subSigName: string = Ch5Signal.getSubscriptionSignalName(sigName);
			oldSig = Ch5SignalFactory.getInstance().getBooleanSignal(subSigName);
		}
		if (null !== oldSig && '' !== subscriptionKey) {
			oldSig.unsubscribe(subscriptionKey);
		}
	}

	protected sendShowSignal(value: boolean) {
		if ('' !== this.sendEventOnShow) {
			const sig = Ch5SignalFactory.getInstance().getBooleanSignal(this.sendEventOnShow);
			if (null !== sig) {
				sig.publish(value);
			}
		}
	}

	protected attributeChangeHandler(attr: string, oldValue: string, newValue: string): string {
		let attributeValue = '';
		if (this.hasAttribute(attr)) {
			if (oldValue !== newValue) {
				attributeValue = newValue;
			} else {
				attributeValue = oldValue;
			}
		}
		return attributeValue;
	}

	/**
	 * applies pre-configured attributes to the current element if those attributes are not already present
	 */
	protected applyPreConfiguredAttributes(): void {
		const preConfiguredAttributes = Ch5Config.getAttributesForElement(this);
		for (const attrName in preConfiguredAttributes) {
			if (preConfiguredAttributes.hasOwnProperty(attrName)) {
				if (!this.hasAttribute(attrName)) {
					this.setAttribute(attrName, preConfiguredAttributes[attrName]);
				}
			}
		}
	}

	protected _attributeValueAsString(attrName: string) {
		let attributeValue = '';
		attrName = attrName.toLowerCase();
		if (this.hasAttribute(attrName)) {
			attributeValue = '' + this.getAttribute(attrName); // convert to string
		}
		return attributeValue;
	}

	/**
	 * Clean the component content
	 * To avoid items duplication when a component is cloned
	 */
	protected contentCleanUp() {
		if (this.children.length) {
			const children = Array.from(this.children);
			children.forEach(item => item.nodeName !== 'TEMPLATE' && item.remove());
		}
	}

	/**
	 * Override this method to replace the default value 'ch5-disabled' with a more appropriate one (e.g. ch5-button--disabled)
	 */
	public getCssClassDisabled() {
		return 'ch5-disabled';
	}

	protected unsubscribeFromSignals() {
		if (this._keepListeningOnSignalsAfterRemoval === false) {
			// this.clearBooleanSignalSubscription(this._receiveStateEnable, this._subKeySigReceiveEnable);
			// this._receiveStateEnable = '';
			// this.clearBooleanSignalSubscription(this._receiveStateShow, this._subKeySigReceiveShow);
			// this._receiveStateShow = '';
			// this.clearBooleanSignalSubscription(this._receiveStateShowPulse, this._subKeySigReceiveShowPulse);
			// this._receiveStateShowPulse = '';
			// this.clearBooleanSignalSubscription(this._receiveStateHidePulse, this._subKeySigReceiveHidePulse);
			// this._receiveStateHidePulse = '';
			// this.clearStringSignalSubscription(this._receiveStateCustomStyle, this._subKeySigReceiveCustomStyle);
			// this._receiveStateCustomStyle = '';
			// this.clearStringSignalSubscription(this._receiveStateCustomClass, this._subKeySigReceiveCustomClass);
			// this._receiveStateCustomClass = '';
		}
	}

	protected componentLoadedEvent(elementName: string, idValue: string) {
		publishEvent('object', elementName, { loaded: true, id: idValue });
		// publishEvent('object', `ch5-list:${this.id}`, { loaded: true, id: this.id });
	}

	protected updateInViewPortClass() {
		const targetElement: HTMLElement = this.getTargetElementForCssClassesAndStyle();
		if (this.elementIsInViewPort) {
			targetElement.classList.add(this.appendClassWhenInViewPort);
		} else {
			targetElement.classList.remove(this.appendClassWhenInViewPort);
		}
	}

	// TODO - not sure why we need this 
	public updateElementVisibility(visible: boolean) {
		this.elementIsVisible = visible;
	}

	/**
	 * Initialize common mutation observer used in each component for checking component visibility
	 *
	 * @param element
	 */
	public initCommonMutationObserver(element: Ch5BaseClass) {
		this._commonMutationObserver = new Ch5MutationObserver(this);
		this._commonMutationObserver.isConnected = true;

		let target = element as HTMLElement;
		while (Ch5MutationObserver.checkElementValidity(target)) {
			this._commonMutationObserver.observe(target);
			target = target.parentNode as HTMLElement;
		}
	}

	public disconnectCommonMutationObserver() {
		if (this.util.isNotNil(this._commonMutationObserver) && !isEmpty(this._commonMutationObserver)) {
			this._commonMutationObserver.disconnectObserver();
		}
	}

	protected convertAnalogValueBasedOnSignalResponse(input: number) {
		const MAX_ANALOG = 65535;
		const HALF_MAX_ANALOG = 32767;
		const MIN_ANALOG = -65535;
		const HALF_MIN_ANALOG = -32768;

		let outputValue: number = input;

		if (outputValue > HALF_MAX_ANALOG) {
			outputValue = outputValue > MAX_ANALOG ? MAX_ANALOG : outputValue;
			outputValue -= MAX_ANALOG + 1;
		} else if (outputValue < HALF_MIN_ANALOG) {
			// Assumption is that Control system cannot send a negative value
			// So even if we receive negative value, just consider it negative
			outputValue = outputValue > MIN_ANALOG ? outputValue : MIN_ANALOG;
			outputValue += MAX_ANALOG + 1;
		}
		return outputValue;
	}

	//#endregion

	//#region Public Methods

	/*
	 * This method is used to dynamically create signal entries.
	 * Items to address for existing components: sendsignalonshow in overlay, booleanjoinincrement, numericjoinincrement, stringjoinincrement,
	 * subpagereceivestatescrollto, registerSignalAttributeDefaults, contractname, booleanjoinoffset, numericjoinoffset, stringjoinoffset
	 */
	public static getSignalElementAttributeRegistryEntries(customComponentProperties: ICh5PropertySettings[]): Ch5SignalElementAttributeRegistryEntries {
		const signalAttributeTypes: Ch5SignalElementAttributeRegistryEntries = {};
		for (let i = 0; i < customComponentProperties.length; i++) {
			if (customComponentProperties[i].isSignal === true) {
				const inputObject: any = {};

				if (customComponentProperties[i].name.toLowerCase().startsWith("receivestate")) {
					inputObject.direction = "state";
				} else if (customComponentProperties[i].name.toLowerCase().startsWith("sendevent")) {
					inputObject.direction = "event";
				}
				inputObject.contractName = true;
				if (customComponentProperties[i].signalType === "string") {
					inputObject.stringJoin = 1;
				} else if (customComponentProperties[i].signalType === "boolean") {
					inputObject.booleanJoin = 1;
				} else if (customComponentProperties[i].signalType === "number") {
					inputObject.numericJoin = 1;
				}
				signalAttributeTypes[customComponentProperties[i].name.toLowerCase()] = inputObject;
			}
		}
		return signalAttributeTypes;
	}

	//#endregion

}

/**
 * Gestureable has been removed from Ch5BaseClass (available in Ch5Common)
 * // Translation library is moved to Ch5-translation-class - translatecallback is used in spinner
 * Original name was updateForChangeInStyleCss (changed to updateForChangeInCustomStyle) and is used in ch5button, so this method has to be checked when upgrading ch5button
 * _listOfAllPossibleComponentCssClasses - really can be avoided
 * //TODO List
// Test
// dir
// SIGNAL_ATTRIBUTE_TYPES
// Add index for componentlibrary and baseclass
 */