// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5Common } from "../ch5-common/ch5-common";
import isNil from 'lodash/isNil';
import { ICh5SliderLabelAttributes } from "./interfaces/i-ch5-slider-label-attributes";
import { isSafariMobile } from "../ch5-core/utility-functions/is-safari-mobile";
import { Ch5CommonSignal } from "../ch5-common/ch5-common-signal";
import { TCh5SliderType, TCh5SliderHorizontalAlignLabel, TCh5SliderVerticalAlignLabel, TCh5SliderOrientation } from "./interfaces";
import { Ch5Slider } from "./ch5-slider";
import _ from "lodash";

export class Ch5SliderLabelBase extends Ch5Common implements ICh5SliderLabelAttributes {

	//#region 1. Variables

	//#region 1.1 readonly variables

	/**
	 * The first value is in the array is the default value
	 */
	public static readonly TYPES: TCh5SliderType[] = ['default', 'primary', 'info', 'text', 'danger', 'warning', 'success', 'secondary'];

	/**
	 * The first value is in the array is the default value
	 */
	public static readonly HORIZONTAL_LABEL_ALIGNMENTS: TCh5SliderHorizontalAlignLabel[] = ['center', 'left', 'right'];

	/**
	 * The first value is in the array is the default value
	 */
	public static readonly VERTICAL_LABEL_ALIGNMENTS: TCh5SliderVerticalAlignLabel[] = ['middle', 'top', 'bottom'];

	/**
	 * The first value is in the array is the default value
	 */
	public static readonly ORIENTATIONS: TCh5SliderOrientation[] = ['horizontal', 'vertical'];

	public static readonly COMPONENT_DATA: any = {
		TYPES: {
			default: Ch5SliderLabelBase.TYPES[0],
			values: Ch5SliderLabelBase.TYPES,
			key: 'type',
			attribute: 'type',
			classListPrefix: 'ch5-slider-label--'
		},
		HORIZONTAL_LABEL_ALIGNMENTS: {
			default: Ch5SliderLabelBase.HORIZONTAL_LABEL_ALIGNMENTS[0],
			values: Ch5SliderLabelBase.HORIZONTAL_LABEL_ALIGNMENTS,
			key: 'halignlabel',
			attribute: 'hAlignLabel',
			classListPrefix: 'ch5-slider-label--horizontal-'
		},
		VERTICAL_LABEL_ALIGNMENTS: {
			default: Ch5SliderLabelBase.VERTICAL_LABEL_ALIGNMENTS[0],
			values: Ch5SliderLabelBase.VERTICAL_LABEL_ALIGNMENTS,
			key: 'valignlabel',
			attribute: 'vAlignLabel',
			classListPrefix: 'ch5-slider-label--vertical-'
		},
		ORIENTATIONS: {
			default: Ch5SliderLabelBase.ORIENTATIONS[0],
			values: Ch5SliderLabelBase.ORIENTATIONS,
			key: 'orientation',
			classListPrefix: 'ch5-slider-label--'
		}
	};

	public readonly primaryCssClass: string = 'ch5-slider-label-base';
	public readonly cssClassPrefix: string = 'ch5-slider-label-base'; // Can be removed if removed in ch5-common

	private readonly CSS_CLASS_LIST = {
		BUTTON_PRIMARY_CLASS: 'cb-btn'
	};

	private readonly iosCssClassPostfix: string = '--ios-vertical';

	//#endregion

	//#region 1.2 private / protected variables

	private _elContainer: HTMLElement = {} as HTMLElement;
	private _elSpan: HTMLElement = {} as HTMLElement;
	private _elIosDots: HTMLElement = {} as HTMLElement;

	private isLabelLoaded: boolean = false;
	private _label: string = '';
	private _ch5CommonSignal: Ch5CommonSignal;

  private _parentCh5Slider: Ch5Slider;
	/**
	 * Horizontal Alignment for Label
	 */
	private _hAlignLabel: TCh5SliderHorizontalAlignLabel = 'center';

	/**
	 * Vertical Alignment for Label
	 */
	private _vAlignLabel: TCh5SliderVerticalAlignLabel = 'middle';

	/**
	 * Lays out the elements of the ch5-slider-label in a horizontal or vertical manner.
	 * For vertical alignment it will apply a CSS class that will rotate the component -90 degrees ( 270 deg clockwise,
	 * 90 degrees counter clockwise )
	 */
	private _orientation: TCh5SliderOrientation = 'horizontal';

	/**
	 * Valid values: default, info, text, danger, warning, success, primary, secondary.
	 * Overrides the appearance of the button with alternative css defined in classes defined with ch5-slider-label--type
	 * where type is the value of the property. If no "type" is provided, type of 'default' is used.
	 */
	private _type: TCh5SliderType = 'default';

	//#endregion

	//#endregion

	//#region 2. Setters and Getters

	public set label(value: string) {
		this.logger.log('set label("' + value + '")');

		if (isNil(value)) {
			value = '';
		}

		const trValue: string = this._getTranslatedValue('label', value);
		if (trValue === this.label) {
			return;
		}
		this.setAttribute('label', trValue);
		this._label = trValue;
		this._elSpan.innerHTML = this._label;
	}
	public get label() {
		return this._label;
	}

	public set customClass(value: string) {
		this.setLabelDisplayAttribute('customClass', value, []);
	}
	public get customClass(): string {
		return this._customClass;
	}

	public set customStyle(value: string) {
		this.setLabelDisplayAttribute('customStyle', value, []);
	}
	public get customStyle(): string {
		return this._customStyle;
	}

	public set hAlignLabel(value: TCh5SliderHorizontalAlignLabel) {
		this.setLabelDisplayAttribute('hAlignLabel', value, Ch5SliderLabelBase.HORIZONTAL_LABEL_ALIGNMENTS);
	}
	public get hAlignLabel(): TCh5SliderHorizontalAlignLabel {
		return this._hAlignLabel;
	}

	private setLabelDisplayAttribute<T>(attribute: keyof Ch5SliderLabelBase, value: T, masterData: T[]) {
		this.logger.log('set ' + attribute + '("' + value + '")');
		if (!isNil(value) && this[attribute] !== value) {
			if (masterData.length === 0) {
				this.setAttribute(attribute, String(value));
				this.setLabelDisplay();
			} else {
				this.setAttribute(attribute, String(this.getValidInputValue<T>(masterData, value)));
				this.setLabelDisplay();
			}
		}
	}

	public set vAlignLabel(value: TCh5SliderVerticalAlignLabel) {
		this.setLabelDisplayAttribute('vAlignLabel', value, Ch5SliderLabelBase.VERTICAL_LABEL_ALIGNMENTS);
	}
	public get vAlignLabel(): TCh5SliderVerticalAlignLabel {
		return this._vAlignLabel;
	}

	public set orientation(value: TCh5SliderOrientation) {
		this.logger.log('set orientation("' + value + '")');
		if (this._orientation !== value) {
			this._orientation = this.getValidInputValue(Ch5SliderLabelBase.ORIENTATIONS, value);
			this.setAttribute('orientation', this._orientation);
		}
	}
	public get orientation(): TCh5SliderOrientation {
		return this._orientation;
	}

	public set type(value: TCh5SliderType) {
		this.logger.log('set type("' + value + '")');
		if (this._type !== value) {
			this.setAttribute('type', this.getValidInputValue(Ch5SliderLabelBase.TYPES, value));
			this.setLabelDisplay();
		}
	}
	public get type(): TCh5SliderType {
		return this._type;
	}

	//#region 2.1. Signals

	public set receiveStateLabel(inputValue: string) {
		this.receiveSignalAsString(this, "receiveStateLabel", inputValue);
	}
	public get receiveStateLabel(): string {
		// The internal property is changed if/when the element is removed from DOM
		// Returning the attribute instead of the internal property preserves functionality
		return this._attributeValueAsString('receivestatelabel');
	}

	// Rewriting this property from base class since it has to follow more features for button like buttonmode and state
	public set receiveStateCustomClass(inputValue: string) {
		this.receiveSignalAsString(this, "receiveStateCustomClass", inputValue);
	}
	/**
	 * The internal property is changed if/when the element is removed from dom
	 * Returning the attribute instead of the internal property preserves functionality
	 */
	public get receiveStateCustomClass(): string {
		return this._attributeValueAsString('receivestatecustomclass');
	}

	private receiveSignalAsString<T>(thisLabel: Ch5SliderLabelBase, attributeName: string, attributeValue: string) {
		this.logger.log('set ' + attributeName + '("' + attributeValue + '")');
		const attributeNameLowerCase: string = attributeName.toLowerCase();
		if (!thisLabel.hasAttribute(attributeNameLowerCase) || thisLabel.getAttribute(attributeNameLowerCase) !== attributeValue) {
			thisLabel.setAttribute(attributeNameLowerCase, attributeValue);
		}
		const signalResponse = thisLabel._ch5CommonSignal.setSignal(attributeName, attributeValue);
		if (!isNil(signalResponse)) {
			signalResponse.subscribe((newValue: string) => {
				thisLabel._ch5CommonSignal.getSignal(attributeName).currentValue = newValue;
				thisLabel._ch5CommonSignal.setVariable<T>(attributeName, newValue);
				thisLabel.setLabelDisplay();
			});
		}
	}

	// Rewriting this property from base class since it has to follow more features for button like buttonmode and state
	public set receiveStateCustomStyle(inputValue: string) {
		this.receiveSignalAsString(this, "receiveStateCustomStyle", inputValue);
	}
	public get receiveStateCustomStyle(): string {
		// The internal property is changed if/when the element is removed from dom
		// Returning the attribute instead of the internal property preserves functionality
		return this._attributeValueAsString('receivestatecustomstyle');
	}

	//#endregion

	//#endregion

	//#region 3. Lifecycle Hooks

	public constructor() {
		super();
		this.logger.start('constructor()', this.primaryCssClass);
		this._listOfAllPossibleComponentCssClasses = this.generateListOfAllPossibleComponentCssClasses();
		this.createInternalHtml();
		this._ch5CommonSignal = new Ch5CommonSignal(["receiveStateCustomStyle", "receiveStateCustomClass", "receiveStateLabel"]);
		this._parentCh5Slider = this.getParent();
		this.logger.stop();
	}

	/**
	 * Called when the ch5-slider-label component is first connected to the DOM
	 */
	public connectedCallback() {
		this.logger.start('connectedCallback()', this.primaryCssClass);

		if (!(this._parentCh5Slider instanceof Ch5Slider)) {
			throw new Error(`Invalid parent element for ch5-slider-label.`);
		}

		if (this._elContainer.parentElement !== this) {
			this.appendChild(this._elContainer);
		}

		this.initAttributes();
		this.updateCssClasses();
		this.initCommonMutationObserver(this);

		this.logger.stop();
	}

	public static get observedAttributes() {
		const inheritedObsAttrs = Ch5Common.observedAttributes;
		const newObsAttrs = [
			'label',
			'orientation',
			'halignlabel',
			'valignlabel',
			'type',

			'receivestatelabel'
		];

		return inheritedObsAttrs.concat(newObsAttrs);
	}

	protected initAttributes() {
		super.initAttributes();
		this.logger.start("initAttributes", this.primaryCssClass);

		if (this.hasAttribute('halignlabel')) {
			this.hAlignLabel = this.getAttribute('halignlabel') as TCh5SliderHorizontalAlignLabel;
		}
		if (this.hasAttribute('label')) {
			this.label = this.getAttribute('label') as string;
		}
		if (this.hasAttribute('orientation')) {
			this.orientation = this.getAttribute('orientation') as TCh5SliderOrientation;
		}
		if (this.hasAttribute('type')) {
			this.type = this.getAttribute('type') as TCh5SliderType;
		}
		if (this.hasAttribute('valignlabel')) {
			this.vAlignLabel = this.getAttribute('valignlabel') as TCh5SliderVerticalAlignLabel;
		}

		// signals
		if (this.hasAttribute('receivestatelabel')) {
			this.receiveStateLabel = this.getAttribute('receivestatelabel') as string;
		}
		this.updateInternalHtml();
		this.logger.stop();
	}

	protected updateForChangeInCustomCssClass() {
		const targetElement: HTMLElement = this.getTargetElementForCssClassesAndStyle();
		this.logger.start("updateForChangeInCustomCssClass()");
		this.logger.log("updateForChangeInCustomCssClass()", this._prevAddedCustomClasses);
		this.logger.log("from ch5button - updateForChangeInCustomCssClass()", this.customClass);

		this._prevAddedCustomClasses.forEach((className: string) => {
			if (className !== '') {
				targetElement.classList.remove(className);
			}
		});
		this._prevAddedCustomClasses = [];

		this.customClass.split(' ').forEach((className: string) => {
			if (className !== '') {
				this._prevAddedCustomClasses.push(className);
				targetElement.classList.add(className);
			}
		});
		this.logger.stop();
	}

	protected updateForChangeInStyleCss() {
		this.logger.start("updateForChangeInStyleCss()");
		const targetElement: HTMLElement = this.getTargetElementForCssClassesAndStyle();
		targetElement.style.cssText = this.customStyle;
		this.logger.stop();
	}

	/**
	 * Called when an HTML attribute is changed, added or removed
	 */
	public attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
		this.logger.start("attributeChangedCallback", this.primaryCssClass);
		if (oldValue === newValue) {
			this.logger.stop();
			return;
		}

		this.logger.log('ch5-slider-label attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + ')"');

		switch (attr) {
			case 'customclass':
				this.customClass = this.getAttributeValue<string>(this, 'customclass', newValue, '');
				break;

			case 'receivestatecustomclass':
				if (this.hasAttribute('receivestatecustomclass')) {
					this.receiveStateCustomClass = this.getAttribute('receivestatecustomclass') as string;
				} else {
					this.clearStringSignalSubscription(this._receiveStateCustomClass, this._subKeySigReceiveCustomClass);
					this._receiveStateCustomClass = '';
				}
				break;

			case 'customstyle':
				this.customStyle = this.getAttributeValue<string>(this, 'customstyle', newValue, '');
				break;

			case 'receivestatecustomstyle':
				if (this.hasAttribute('receivestatecustomstyle')) {
					this.receiveStateCustomStyle = this.getAttribute('receivestatecustomstyle') as string;
				} else {
					this.clearStringSignalSubscription(this._receiveStateCustomStyle, this._subKeySigReceiveCustomStyle);
					this._receiveStateCustomStyle = '';
				}
				break;

			case 'label':
				this.label = this.getAttributeValue<string>(this, 'label', newValue, '');
				break;

			case 'orientation':
				this.orientation = this.getAttributeValue<TCh5SliderOrientation>(this, 'orientation', newValue as TCh5SliderOrientation, Ch5SliderLabelBase.ORIENTATIONS[0]);
				this.updateCssClasses();
				break;

			case 'type':
				this.type = this.getAttributeValue<TCh5SliderType>(this, 'type', newValue as TCh5SliderType, Ch5SliderLabelBase.TYPES[0]);
				break;

			case 'halignlabel':
				this.hAlignLabel = this.getAttributeValue<TCh5SliderHorizontalAlignLabel>(this, 'halignlabel', newValue as TCh5SliderHorizontalAlignLabel, Ch5SliderLabelBase.HORIZONTAL_LABEL_ALIGNMENTS[0]);
				break;

			case 'valignlabel':
				this.vAlignLabel = this.getAttributeValue<TCh5SliderVerticalAlignLabel>(this, 'valignlabel', newValue as TCh5SliderVerticalAlignLabel, Ch5SliderLabelBase.VERTICAL_LABEL_ALIGNMENTS[0]);
				break;

			case 'receivestatelabel':
				this.receiveStateLabel = this.getAttributeValue<string>(this, 'receivestatelabel', newValue, '');
				break;

			default:
				super.attributeChangedCallback(attr, oldValue, newValue);
				break;
		}
		this.logger.stop();
	}

	/**
	 * Called when the ch5-slider-label component is disconnected from the DOM
	 */
	public disconnectedCallback() {
		this.logger.start('disconectedCallback()');
		this.unsubscribeFromSignals();

		// disconnect common mutation observer
		this.disconnectCommonMutationObserver();
		this.logger.stop();
	}

	//#endregion

	//#region 4. Other Methods

	public getParent(): Ch5Slider {
		const getTheMatchingParent = (node: Node): Ch5Slider => {
			if (!_.isNil(node) && node.nodeName.toString().toUpperCase() !== "CH5-SLIDER") {
				return getTheMatchingParent(node.parentNode as Node);
			}
			return node as Ch5Slider;
		}
		return getTheMatchingParent(this.parentElement as Node);
	}

	/**
	 * Called this method if you have to wrap the element
	 * @param el html element which you have to wrap
	 * @param wrapper wrapper html element
	 */
	private wrap(el: any, wrapper: HTMLElement) {
		el.parentNode.insertBefore(wrapper, el);
		wrapper.appendChild(el);
	}

	private generateListOfAllPossibleComponentCssClasses(): string[] {
		const cssClasses: string[] = [];
		cssClasses.push(this.primaryCssClass);

		// types
		Ch5SliderLabelBase.TYPES.forEach((type: TCh5SliderType) => {
			const newCssClass = this.primaryCssClass + '--' + type;
			cssClasses.push(newCssClass);
		});

		// horizontal align label
		Ch5SliderLabelBase.HORIZONTAL_LABEL_ALIGNMENTS.forEach((type: TCh5SliderHorizontalAlignLabel) => {
			const newCssClass = this.primaryCssClass + '--horizontal-' + type;
			cssClasses.push(newCssClass);
		});

		// vertical align label
		Ch5SliderLabelBase.VERTICAL_LABEL_ALIGNMENTS.forEach((type: TCh5SliderVerticalAlignLabel) => {
			const newCssClass = this.primaryCssClass + '--vertical-' + type;
			cssClasses.push(newCssClass);
		});

		// orientation
		Ch5SliderLabelBase.ORIENTATIONS.forEach((orientation: TCh5SliderOrientation) => {
			cssClasses.push(this.primaryCssClass + '--' + orientation);
		});

		return cssClasses;
	}

	public unsubscribeFromSignals() {
		super.unsubscribeFromSignals();
	}

	protected createInternalHtml() {
		this.logger.start('createInternalHtml()');
		this.clearComponentContent();
		this._elContainer = document.createElement('div');
		this._elSpan = document.createElement('span');
		this._elSpan.setAttribute('data-ch5-id', this.getCrId());
		this._elSpan.classList.add('cb-lbl');
		this._elContainer.classList.add(this.primaryCssClass);
		this._elSpan.classList.add(this.primaryCssClass + '--label');
		this._elContainer.appendChild(this._elSpan);
		this.logger.stop();
	}

	// adding ellipsis in iOS device with vertical button
	protected createIosEllipsis() {
		if (isSafariMobile()) {
			const btnNodes: any = this._elSpan.childNodes;
			btnNodes.forEach((node: any) => {
				if (node.className === (this.primaryCssClass + '--ios-label')) {
					node.remove();
				}
			});

			if (this.isLabelLoaded) {
				this.createEllipsisTpl();
			} else {
				let timer: any;
				clearTimeout(timer);
				timer = setTimeout(() => {
					this.createEllipsisTpl();
					this.isLabelLoaded = true;
				}, 2000);
			}
		}
	}

	// creating three dots for iOS
	private createEllipsisTpl() {
		if (this._elSpan.scrollHeight > this._elSpan.clientHeight) {
			this._elContainer.classList.add(this.primaryCssClass + this.iosCssClassPostfix);
			this._elIosDots = document.createElement('i');
			this._elIosDots.classList.add('dots');
			this._elIosDots.innerHTML = '...';
			this._elSpan.appendChild(this._elIosDots);
			const wrapper: HTMLElement = document.createElement('span');
			wrapper.classList.add(this.primaryCssClass + '--ios-label');
			if (!this._elSpan.closest('.ch5-slider-label--ios-label')) {
				this.wrap(this._elSpan, wrapper);
			}
		}
	}

	/**
	 * Clear the button content in order to avoid duplication of buttons
	 * @return {void}
	 */
	protected clearComponentContent() {
		const containers = this.getElementsByTagName("div");
		Array.from(containers).forEach((container) => {
			container.remove();
		});
	}

	protected getTargetElementForCssClassesAndStyle(): HTMLElement {
		return this._elContainer;
	}

	// DO NOT Remove this method
	public getCssClassDisabled(): string {
		return this.primaryCssClass + '--disabled';
	}

	//#endregion

	//#region 5. Button UI changes
	/**
	 * If type node is updated via html or js or signal, the change set attribue of type;
	 * if receivestate is true, then even if type attribute chagnes, just use receivestatevalue
	 * if receivestate is false, then
	 * if mode attribute is updated, always call this method, and update all attributes  
	 */
	public setLabelDisplay() {
		this.logger.start("setLabelDisplay");
		// Applicable on Mode change and Selected change
		// We need not worry about this. ch5-slider-label-label is immediate child, and no change in attribute
		// affects the data from immediate child.

		// Priority 1: ReceiveState Signals
		if (this.receiveStateCustomClass && this.receiveStateCustomClass !== '') {
			// extendedProperties.customClass = this._ch5CommonSignal.getVariable<string>("receiveStateCustomClass");
		}

		if (this.receiveStateCustomStyle && this.receiveStateCustomStyle !== '') {
			// extendedProperties.customStyle = this._ch5CommonSignal.getVariable<string>("receiveStateCustomStyle");
		}

		if (this.receiveStateLabel && this.receiveStateLabel !== '') {
			// extendedProperties.label = this._ch5CommonSignal.getVariable<string>("receiveStateLabel");
		}

		this.logger.stop();
	}

	/**
	 * Reorders ( if needed ) the position of the label and the icon inside the button
	 */
	protected updateInternalHtml() {
		this.logger.start("updateInternalHtml()");
		if (!(typeof this._elSpan.insertBefore === "undefined")) {
			if (this.orientation === 'vertical') {
				this.createIosEllipsis();
			}
		}
		this.logger.stop();
	}

	protected updateCssClasses(): void {
		this.logger.start('updateCssClasses()');
		// apply css classes for attrs inherited from common (e.g. customClass, customStyle )
		super.updateCssClasses();

		const setOfCssClassesToBeApplied = new Set<string>();

		// primary
		setOfCssClassesToBeApplied.add(this.primaryCssClass);

		// type
		setOfCssClassesToBeApplied.add(this.primaryCssClass + '--' + this.type);

		// orientation
		setOfCssClassesToBeApplied.add(this.primaryCssClass + '--' + this.orientation);

		const targetEl: HTMLElement = this.getTargetElementForCssClassesAndStyle();
		if (typeof targetEl.classList !== 'undefined') {
			this._listOfAllPossibleComponentCssClasses.forEach((cssClass: string) => {
				if (setOfCssClassesToBeApplied.has(cssClass)) {
					targetEl.classList.add(cssClass);
				} else {
					targetEl.classList.remove(cssClass);
				}
			});
		}

		const setOfCssClassesToBeAppliedForLabelAlignment = new Set<string>();

		// horizontal align
		setOfCssClassesToBeAppliedForLabelAlignment.add(this.primaryCssClass + '--horizontal-' + this.hAlignLabel);

		// vertical align
		setOfCssClassesToBeAppliedForLabelAlignment.add(this.primaryCssClass + '--vertical-' + this.vAlignLabel);

		this._listOfAllPossibleComponentCssClasses.forEach((cssClass: string) => {
			if (setOfCssClassesToBeAppliedForLabelAlignment.has(cssClass)) {
				this._elSpan.classList.add(cssClass);
			} else {
				this._elSpan.classList.remove(cssClass);
			}
		});

		this.logger.stop();
	}

	private getAttributeValue<T>(thisClass: Ch5SliderLabelBase, attributeName: string, value: T, defaultOutputValue: T): T {
		if (thisClass.hasAttribute(attributeName.toString().toLowerCase())) {
			return value as T;
		} else {
			return defaultOutputValue as T;
			// 	return JSON.parse("") as T; // To Pass string as T
		}
	}

	private getValidInputValue<T>(masterData: T[], value: T): T {
		if (masterData.indexOf(value) >= 0) {
			return value;
		} else {
			return masterData[0];
		}
	}

	//#endregion

}
