// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.


import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { Ch5TemplateStructure } from "./ch5-template-structure";
import { ICh5TemplateAttributes } from "./interfaces/i-ch5-template-attributes";
import { publishEvent } from "../ch5-core";
import { ch5TemplateSubject } from "./refresh-ch5-template";
import { Subscription } from "rxjs";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { removeTransition, setTransition } from '../ch5-core/utility-functions/animate';
import { TCh5TransitionType } from "./interfaces/t-ch5-template";

export class Ch5Template extends Ch5Common implements ICh5TemplateAttributes {

	public static readonly TRANSITIONTYPE: TCh5TransitionType[] = [
		'bounce', 'flash', 'pulse', 'rubberBand', 'shake', 'swing', 'tada', 'wobble', 'jello', 'heartBeat',
		'bounceIn', 'bounceInDown', 'bounceInLeft', 'bounceInRight', 'bounceInUp', 'bounceOut', 'bounceOutDown',
		'bounceOutLeft', 'bounceOutRight', 'bounceOutUp', 'fadeIn', 'fadeInDown', 'fadeInDownBig', 'fadeInLeft',
		'fadeInLeftBig', 'fadeInRight', 'fadeInRightBig', 'fadeInUp', 'fadeInUpBig', 'fadeInUpBigFast', 'fadeInDownBigFast',
		'fadeInSlow', 'fadeInFast', 'fadeOut', 'fadeOutDown', 'fadeOutDownBig', 'fadeOutLeft', 'fadeOutLeftBig',
		'fadeOutRight', 'fadeOutRightBig', 'fadeOutUp', 'fadeOutUpBig', 'flip', 'flipInX', 'flipInY', 'flipOutX',
		'flipOutY', 'lightSpeedInRight', 'lightSpeedOut', 'rotateIn', 'rotateInDownLeft', 'rotateInDownRight',
		'rotateInUpLeft', 'rotateInUpRight', 'rotateOut', 'rotateOutDownLeft', 'rotateOutDownRight', 'rotateOutUpLeft',
		'rotateOutUpRight', 'hinge', 'jackInTheBox', 'rollIn', 'rollOut', 'zoomIn', 'zoomInDown', 'zoomInLeft',
		'zoomInRight', 'zoomInUp', 'zoomOut', 'zoomOutDown', 'zoomOutLeft', 'zoomOutRight', 'zoomOutUp', 'slideInDown',
		'slideInLeft', 'slideInRight', 'slideInUp', 'slideOutDown', 'slideOutLeft', 'slideOutRight', 'slideOutUp'
	];;
	public static CH5_TEMPLATE_STYLE_CLASS: string = 'ch5-template';
	public static readonly ELEMENT_NAME = 'ch5-template';
	private _ch5Properties: Ch5Properties;
	public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
		...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
		contractname: { contractName: true },
		booleanjoinoffset: { booleanJoin: 1 },
		numericjoinoffset: { numericJoin: 1 },
		stringjoinoffset: { stringJoin: 1 }
	};

	public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [
		{
			default: null,
			enumeratedValues: Ch5Template.TRANSITIONTYPE,
			name: "transitionIn",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: null,
			isObservableProperty: true,
			isNullable: true
		},
		{
			default: null,
			enumeratedValues: Ch5Template.TRANSITIONTYPE,
			name: "transitionOut",
			removeAttributeOnNull: true,
			type: "enum",
			valueOnAttributeEmpty: null,
			isObservableProperty: true,
			isNullable: true
		},
		{
			default: "1s",
			name: "transitionDuration",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true,
		},
		{
			default: "0s",
			name: "transitionDelay",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true,
		},
	];


	// COMPONENT ATTRIBUTES

	/**
	 * The id of the template to be instantiated
	 * @type {string}
	 * @private
	 * HTML attribute name: templateId
	 */
	private _templateId: string = '';

	/**
	 * A list of replacement strings to modify the template to particular instance.
	 * In format of "original:replacement;"  original it the value to be replaced, replacement is the replacement value.
	 * Pairs of original:replacement can be separated by semi-colon;
	 * @type {string}
	 * @private
	 * HTML attribute name: context
	 */
	private _context: string = '';

	/**
	 * The value of the contract attribute
	 */
	private _contractName: string = '';

	/**
	 * the value of the boolean join offset attribute
	 */
	private _booleanJoinOffset: string = '';

	/**
	 * the value of the numeric join offset attribute
	 */
	private _numericJoinOffset: string = '';

	/**
	 * the value of the string join offset attribute
	 */
	private _stringJoinOffset: string = '';

	/**
	 * @type {Ch5TemplateStructure}
	 */
	private _templateHelper: Ch5TemplateStructure = {} as Ch5TemplateStructure;

	/**
	 * The subscription id of listener for refresh 
	 */
	private _refreshSubId: Subscription | null = null;

	public static registerSignalAttributeTypes() {
		Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5Template.ELEMENT_NAME, Ch5Template.SIGNAL_ATTRIBUTE_TYPES);
	}

	public static registerSignalAttributeDefaults() {
		Ch5SignalAttributeRegistry.instance.addElementDefaultAttributeEntries(Ch5Template.ELEMENT_NAME, {
			contractName: { attributes: ["contractname"], defaultValue: "" },
			booleanJoin: { attributes: ["booleanjoinoffset"], defaultValue: "0" },
			numericJoin: { attributes: ["numericjoinoffset"], defaultValue: "0" },
			stringJoin: { attributes: ["stringjoinoffset"], defaultValue: "0" }
		});
	}

	public static registerCustomElement() {
		if (typeof window === "object"
			&& typeof window.customElements === "object"
			&& typeof window.customElements.define === "function"
			&& window.customElements.get(Ch5Template.ELEMENT_NAME) === undefined) {
			window.customElements.define(Ch5Template.ELEMENT_NAME, Ch5Template);
		}
	}

	public static get observedAttributes() {
		const commonObservedAttributes = Ch5Common.observedAttributes;
		const contextObservedAttributes = [
			'templateid',
			'context',
			'contractname',
			'booleanjoinoffset',
			'numericjoinoffset',
			'stringjoinoffset'
		];

		for (let i: number = 0; i < Ch5Template.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5Template.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				contextObservedAttributes.push(Ch5Template.COMPONENT_PROPERTIES[i].name.toLowerCase());
			}
		}
		return contextObservedAttributes.concat(commonObservedAttributes);
	}

	public set templateId(value: string) {
		if (this._templateId !== value) {
			this._templateId = value;
			this.setAttribute('templateid', value.toString());
		}
	}

	public get templateId() {
		return this._templateId;
	}

	public set context(value: string) {
		if (this._context !== value) {
			this._context = value;
			this.setAttribute('context', value.toString());
		}
	}

	public get context() {
		return this._context;
	}


	public set contractName(value: string) {
		if (this._contractName !== value) {
			this._contractName = value;
			this.setAttribute('contractname', value);
		}
	}

	public get contractName() {
		return this._contractName;
	}

	public set booleanJoinOffset(value: string) {
		if (this._booleanJoinOffset !== value) {
			this._booleanJoinOffset = value;
			this.setAttribute('booleanjoinoffset', value);
		}
	}

	public get booleanJoinOffset() {
		return this._booleanJoinOffset;
	}

	public set numericJoinOffset(value: string) {
		if (this._numericJoinOffset !== value) {
			this._numericJoinOffset = value;
			this.setAttribute('numericjoinoffset', value);
		}
	}

	public get numericJoinOffset() {
		return this._numericJoinOffset;
	}


	public set stringJoinOffset(value: string) {
		if (this._stringJoinOffset !== value) {
			this._stringJoinOffset = value;
			this.setAttribute('stringjoinoffset', value);
		}
	}

	public get stringJoinOffset() {
		return this._stringJoinOffset;
	}

	public set transitionIn(value: TCh5TransitionType | null) {
		this._ch5Properties.set<TCh5TransitionType | null>("transitionIn", value);
	}
	public get transitionIn(): TCh5TransitionType {
		return this._ch5Properties.get<TCh5TransitionType>("transitionIn");
	}

	public set transitionOut(value: TCh5TransitionType | null) {
		this._ch5Properties.set<TCh5TransitionType | null>("transitionOut", value);
	}
	public get transitionOut(): TCh5TransitionType {
		return this._ch5Properties.get<TCh5TransitionType>("transitionOut");
	}

	public set transitionDuration(value: string) {
		this._ch5Properties.set<string>("transitionDuration", value);
	}
	public get transitionDuration(): string {
		return this._ch5Properties.get<string>("transitionDuration");
	}

	public set transitionDelay(value: string) {
		this._ch5Properties.set<string>("transitionDelay", value);
	}
	public get transitionDelay(): string {
		return this._ch5Properties.get<string>("transitionDelay");
	}

	/**
		 * CONSTRUCTOR
		 */
	public constructor() {
		super();
		this._ch5Properties = new Ch5Properties(this, Ch5Template.COMPONENT_PROPERTIES);
	}

	public connectedCallback() {
		this.info('Ch5Template.connectedCallback()');
		Promise.all([
			customElements.whenDefined('ch5-template'),
		]).then(() => {
			this.initializations();
			this.info('Ch5Template --- Callback loaded');

			if (this._templateHelper && this._templateHelper.instanceId) {
				publishEvent('object', `ch5-template:${this._templateId}`, { loaded: true, id: this._templateHelper.instanceId, elementIds: this._templateHelper.elementIds });
			}
		});


		this.listenForCh5TemplateRefreshRequests();
	}

	/**
	 * function to setup a subscription for a change 
	 * This functionality is primarily to support CCIDE update the template definition after a template 
	 * instance has been put onto the CCIDE canvas. 
	 * The implementation is 'good enough' for design time to show updated widget, but in a runtime environment,
	 * it will leak references over time. 
	 */
	private listenForCh5TemplateRefreshRequests() {
		this.info('Ch5Template.listenForCh5TemplateRefreshRequests()');

		this._refreshSubId = ch5TemplateSubject.subscribe((ch5TemplateId: string) => {
			this.info(`Ch5Template.listenForCh5TemplateRefreshRequests() new request for ${ch5TemplateId}`);

			if (!this.shouldRefresh(ch5TemplateId)) {
				return;
			}

			this.initializations(true);
		});
	}

	private shouldRefresh(id: string) {
		this.info(`Ch5Template.shouldRefresh() got called for id ${id}`);
		return this.getAttribute('templateId') === id;
	}

	/**
	 *  Called to initialize all attributes
	 */
	protected initAttributes(): void {
		super.initAttributes();
		this.info('Ch5Template.initAttributes()');
		const thisRef: any = this;
		for (let i: number = 0; i < Ch5Template.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5Template.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				if (this.hasAttribute(Ch5Template.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
					const key = Ch5Template.COMPONENT_PROPERTIES[i].name;
					thisRef[key] = this.getAttribute(key);
				}
			}
		}

		if (this.hasAttribute('templateid')) {
			this.templateId = this.getAttribute('templateid') as string;
		}

		if (this.hasAttribute('context')) {
			this.context = this.getAttribute('context') as string;
		}
	}

	private initializations(force?: boolean): void {

		this.info(`Ch5Template.initializations(${force === true})`);

		if (force === true || !this._templateHelper || !this._templateHelper.instanceId) {
			this.classList.add(Ch5Template.CH5_TEMPLATE_STYLE_CLASS);
			this.initAttributes();
			this._templateHelper = new Ch5TemplateStructure(this);
			this._templateHelper.generateTemplate(this.templateId, this.context);
			this.updateAnimateClass();
			this.info('Ch5Template --- Initialization Finished');
		}

	}

	/**
	 * Called when an HTML attribute is changed, added or removed
	 */
	public attributeChangedCallback(attr: string, oldValue: string, newValue: string): void {
		if (oldValue === newValue) {
			return;
		}
		const attributeChangedProperty = Ch5Template.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
		if (attributeChangedProperty) {
			const thisRef: any = this;
			const key = attributeChangedProperty.name;
			thisRef[key] = newValue;
		}

		this.info(`Ch5Template.attributeChangedCallback("${attr}", "${oldValue}", "${newValue}")`);

		switch (attr) {
			case 'templateId':
				this.templateId = this.getAttribute('templateId') as string;
				break;
			case 'context':
				this.context = this.getAttribute('context') as string;
				break;
			case 'contractname':
				this.contractName = this.getAttribute('contractname') as string;
				break;
			case 'booleanjoinoffset':
				this.booleanJoinOffset = this.getAttribute('booleanjoinoffset') as string;
				break;
			case 'numericjoinoffset':
				this.numericJoinOffset = this.getAttribute('numericjoinoffset') as string;
				break;
			case 'stringjoinoffset':
				this.stringJoinOffset = this.getAttribute('stringjoinoffset') as string;
				break;
			default:
				super.attributeChangedCallback(attr, oldValue, newValue);
				break;
		}
	}

	/**
	 * Called when disconnected from the document tree.
	 * 
	 */
	public disconnectedCallback() {
		this.info('Ch5Template.disconnectedCallback()');
		// tell the world that no longer on DOM
		if (this._templateHelper && this._templateHelper.instanceId) {
			// keep this in sync with ch5-template-structure
			publishEvent('object', `ch5-template:${this.templateId}`, { loaded: false, id: this._templateHelper.instanceId });
		}

		if (this._refreshSubId !== null) {
			this._refreshSubId.unsubscribe();
			this._refreshSubId = null;
		}

	}

	beforeHandlingShow() {
		if (this.children && this.children[0]) {
			this.setDurationAndDelay();
			if (this.hasAttribute('transitionout')) {
				removeTransition(this.children[0], this.transitionOut);
			}
			if (this.hasAttribute('transitionin')) {
				setTransition(this.children[0], this.transitionIn);
			}
		}
	};

	beforeHandlingHide() {

		if (this.children && this.children[0]) {
			this.setDurationAndDelay();

			if (this.hasAttribute('transitionin')) {
				this.classList.remove('inline-element');
				removeTransition(this.children[0], this.transitionIn);
			}
			if (this.hasAttribute('transitionout')) {
				this.classList.add('inline-element');
				setTransition(this.children[0], this.transitionOut);
			}
		}
	};

	private updateAnimateClass() {
		this.setDurationAndDelay();
		if (this.show && this.hasAttribute('transitionin') && this.children && this.children[0]) {
			setTransition(this.children[0], this.transitionIn);
		}
	}

	private setDurationAndDelay() {
		this.style.setProperty('--animate-duration', this.transitionDuration ? this.transitionDuration : "1s");
		this.style.setProperty('--animate-delay', this.transitionDelay ? this.transitionDelay : "0s");
	}
}

Ch5Template.registerCustomElement();
Ch5Template.registerSignalAttributeTypes();
Ch5Template.registerSignalAttributeDefaults();
