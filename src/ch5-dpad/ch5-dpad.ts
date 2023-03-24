import _ from "lodash";
import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5RoleAttributeMapping } from "../utility-models";
import { ICh5DpadAttributes } from "./interfaces/i-ch5-dpad-attributes";
import { TCh5DpadShape, TCh5DpadStretch, TCh5DpadType, TCh5DpadSize } from "./interfaces/t-ch5-dpad";
import { TCh5CreateReceiveStateSigParams } from "../ch5-common/interfaces";
import { CH5DpadUtils } from "./ch5-dpad-utils";
import { ComponentHelper } from "../ch5-common/utils/component-helper";
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { Ch5DpadButton } from "./ch5-dpad-button";
import { subscribeInViewPortChange, unSubscribeInViewPortChange } from "../ch5-core";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";
import { Ch5Properties } from "../ch5-core/ch5-properties";

export class Ch5Dpad extends Ch5Common implements ICh5DpadAttributes {

	//#region 1. Variables

	//#region 1.1 readonly variables
	public static readonly ELEMENT_NAME = 'ch5-dpad';

	/**
	 * The first value is considered the default one
	 */
	public static readonly TYPES: TCh5DpadType[] = ['default', 'primary', 'info', 'text', 'danger', 'warning', 'success', 'secondary'];

	public static readonly SHAPES: TCh5DpadShape[] = ['plus', 'circle'];

	public static readonly STRETCHES: TCh5DpadStretch[] = ['both', 'width', 'height'];

	public static readonly SIZES: TCh5DpadSize[] = ['regular', 'x-small', 'small', 'large', 'x-large'];

	public static readonly CSS_CLASS_PREFIX_STRETCH: string = "--stretch-";
	public static readonly CSS_CLASS_PREFIX_TYPE: string = "--type-";
	public static readonly CSS_CLASS_PREFIX_SHAPE: string = "--shape-";
	public static readonly CSS_CLASS_PREFIX_SIZE: string = "--size-";

	public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [
		{
			default: "",
			name: "contractName",
			removeAttributeOnNull: true,
			type: "string",
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		},
		{
			default: Ch5Dpad.TYPES[0],
			enumeratedValues: Ch5Dpad.TYPES,
			name: "type",
			removeAttributeOnNull: true,
			type: "enum",
			valueOnAttributeEmpty: Ch5Dpad.TYPES[0],
			isObservableProperty: true
		},
		{
			default: Ch5Dpad.SHAPES[0],
			enumeratedValues: Ch5Dpad.SHAPES,
			name: "shape",
			removeAttributeOnNull: true,
			type: "enum",
			valueOnAttributeEmpty: Ch5Dpad.SHAPES[0],
			isObservableProperty: true
		},
		{
			default: Ch5Dpad.SIZES[0],
			enumeratedValues: Ch5Dpad.SIZES,
			name: "size",
			removeAttributeOnNull: true,
			type: "enum",
			valueOnAttributeEmpty: Ch5Dpad.SIZES[0],
			isObservableProperty: true
		},
		{
			default: null,
			enumeratedValues: Ch5Dpad.STRETCHES,
			name: "stretch",
			removeAttributeOnNull: true,
			type: "enum",
			valueOnAttributeEmpty: null,
			isObservableProperty: true,
			isNullable: true,
		},
		{
			default: true,
			name: "useContractForEnable",
			removeAttributeOnNull: true,
			type: "boolean",
			valueOnAttributeEmpty: false,
			isObservableProperty: true
		},
		{
			default: true,
			name: "useContractForShow",
			removeAttributeOnNull: true,
			type: "boolean",
			valueOnAttributeEmpty: false,
			isObservableProperty: true
		},
		{
			default: false,
			name: "useContractForCustomClass",
			removeAttributeOnNull: true,
			type: "boolean",
			valueOnAttributeEmpty: false,
			isObservableProperty: true
		},
		{
			default: false,
			name: "useContractForCustomStyle",
			removeAttributeOnNull: true,
			type: "boolean",
			valueOnAttributeEmpty: false,
			isObservableProperty: true
		},
		{
			default: "",
			isSignal: true,
			name: "sendEventOnClickStart",
			signalType: "number",
			removeAttributeOnNull: true,
			type: "string",
			isNullable: true,
			valueOnAttributeEmpty: "",
			isObservableProperty: true
		}
	];

	/**
	 * COMPONENT_DATA is required for sass-schema generator file to build sufficient data
	 */
	public static readonly COMPONENT_DATA: any = {
		TYPES: {
			default: Ch5Dpad.TYPES[0],
			values: Ch5Dpad.TYPES,
			key: 'type',
			attribute: 'type',
			classListPrefix: Ch5Dpad.CSS_CLASS_PREFIX_TYPE
		},
		STRETCHES: {
			default: null,
			values: Ch5Dpad.STRETCHES,
			key: 'stretch',
			attribute: 'stretch',
			classListPrefix: Ch5Dpad.CSS_CLASS_PREFIX_STRETCH
		},
		SHAPES: {
			default: Ch5Dpad.SHAPES[0],
			values: Ch5Dpad.SHAPES,
			key: 'shape',
			attribute: 'shape',
			classListPrefix: Ch5Dpad.CSS_CLASS_PREFIX_SHAPE
		},
		SIZES: {
			default: Ch5Dpad.SIZES[0],
			values: Ch5Dpad.SIZES,
			key: 'size',
			attribute: 'size',
			classListPrefix: Ch5Dpad.CSS_CLASS_PREFIX_SIZE
		},
	};

	public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
		...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
		sendeventonclickstart: { direction: "event", booleanJoin: 1, contractName: true },
		contractname: { contractName: true },
		booleanjoinoffset: { booleanJoin: 1 },
		numericjoinoffset: { numericJoin: 1 },
		stringjoinoffset: { stringJoin: 1 }
	};

	public readonly primaryCssClass = 'ch5-dpad';

	//#endregion

	//#region 1.2 private / protected variables
	private _ch5Properties: Ch5Properties;

	// state specific vars
	private isResizeInProgress: boolean = false;
	private readonly RESIZE_DEBOUNCE: number = 500;

	// elements specific vars
	private container: HTMLElement = {} as HTMLElement;
	private containerClass: string = 'dpad-container';

	//#endregion

	//#region Static Methods

	public static registerSignalAttributeTypes() {
		Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5Dpad.ELEMENT_NAME, Ch5Dpad.SIGNAL_ATTRIBUTE_TYPES);
	}

	public static registerCustomElement() {
		if (typeof window === "object"
			&& typeof window.customElements === "object"
			&& typeof window.customElements.define === "function"
			&& window.customElements.get(Ch5Dpad.ELEMENT_NAME) === undefined) {
			window.customElements.define(Ch5Dpad.ELEMENT_NAME, Ch5Dpad);
		}
	}

	//#endregion

	//#endregion

	//#region 2. Setters and Getters

	public set contractName(value: string) {
		this._ch5Properties.set<string>("contractName", value, () => {
			this.updateContractNameBasedHandlers();
		});
	}
	public get contractName(): string {
		return this._ch5Properties.get<string>("contractName")?.trim();
	}

	public set type(value: TCh5DpadType) {
		this._ch5Properties.set<TCh5DpadType>("type", value, () => {
			this.updateCssClasses();
		});
	}
	public get type(): TCh5DpadType {
		return this._ch5Properties.get<TCh5DpadType>("type");
	}

	public set shape(value: TCh5DpadShape) {
		this._ch5Properties.set<TCh5DpadShape>("shape", value, () => {
			this.checkAndRestructureDomOfDpad();
		});
	}
	public get shape(): TCh5DpadShape {
		return this._ch5Properties.get<TCh5DpadShape>("shape");
	}

	public set stretch(value: TCh5DpadStretch | null) {
		this._ch5Properties.set<TCh5DpadStretch | null>("stretch", value, () => {
			this.stretchHandler();
		});
	}
	public get stretch(): TCh5DpadStretch | null {
		return this._ch5Properties.get<TCh5DpadStretch | null>("stretch");
	}

	public set size(value: TCh5DpadSize) {
		this._ch5Properties.set<TCh5DpadSize>("size", value, () => {
			this.checkAndRestructureDomOfDpad();
		});
	}
	public get size() {
		return this._ch5Properties.get<TCh5DpadSize>("size");
	}

	public set sendEventOnClickStart(value: string) {
		this._ch5Properties.set<string>("sendEventOnClickStart", value, () => {
			this.updateEventClickHandlers(parseInt(value, 10));
		});
	}
	public get sendEventOnClickStart(): string {
		return this._ch5Properties.get<string>("sendEventOnClickStart");
	}

	public set useContractForEnable(value: boolean) {
		this._ch5Properties.set<string>("useContractForEnable", value, () => {
			this.handleUseContractForEnable(value);
		});
	}
	public get useContractForEnable(): boolean {
		return this._ch5Properties.get<boolean>("useContractForEnable");
	}

	public set useContractForShow(value: boolean) {
		this._ch5Properties.set<boolean>("useContractForShow", value, () => {
			this.handleUseContractForShow(value);
		});
	}
	public get useContractForShow(): boolean {
		return this._ch5Properties.get<boolean>("useContractForShow");
	}

	public set useContractForCustomStyle(value: boolean) {
		this._ch5Properties.set<boolean>("useContractForCustomStyle", value, () => {
			this.handleUseContractForCustomStyle(value);
		});
	}
	public get useContractForCustomStyle(): boolean {
		return this._ch5Properties.get<boolean>("useContractForCustomStyle");
	}

	public set useContractForCustomClass(value: boolean) {
		this._ch5Properties.set<boolean>("useContractForCustomClass", value, () => {
			this.handleUseContractForCustomClass(value);
		});
	}
	public get useContractForCustomClass(): boolean {
		return this._ch5Properties.get<boolean>("useContractForCustomClass");
	}

	//#endregion

	//#region 3. Lifecycle Hooks

	public constructor() {
		super();
		this.logger.start('constructor()', Ch5Dpad.ELEMENT_NAME);
		ComponentHelper.clearComponentContent(this);
		this._ch5Properties = new Ch5Properties(this, Ch5Dpad.COMPONENT_PROPERTIES);
		this.initCssClasses();
		this.logger.stop();
	}

	/**
	 * 	Called every time the element is inserted into the DOM.
	 *  Useful for running setup code, such as fetching resources or rendering.
	 */
	public connectedCallback() {
		this.logger.start('connectedCallback() - start', Ch5Dpad.ELEMENT_NAME);
		subscribeInViewPortChange(this, () => {
			if (this.elementIsInViewPort) {
				if (!_.isNil(this.stretch) && this.parentElement) {
					const { offsetHeight: parentHeight, offsetWidth: parentWidth } = this.parentElement;
					const setValue = parentWidth <= parentHeight ? parentWidth : parentHeight;
					this.container.style.height = setValue + 'px';
					this.container.style.width = setValue + 'px';
				}
			}
		});
		customElements.whenDefined('ch5-dpad').then(() => {
			// create element
			if (!this._wasInstatiated) {
				this.createHtmlElements();
			}
			this._wasInstatiated = true;

			this.attachEventListeners();
			this.initAttributes();

			// required post initial setup
			this.stretchHandler();

			this.contractDefaultHelper();
		});

		this.logger.stop();
	}

	/**
	 * Called every time the element is removed from the DOM.
	 * Useful for running clean up code.
	 */
	public disconnectedCallback() {
		this.removeEvents();
		this.unsubscribeFromSignals();
		unSubscribeInViewPortChange(this);

		if (!!this.container && !!this.container.style) {
			this.container.style.removeProperty('height');
			this.container.style.removeProperty('width');
		}
		this.disconnectCommonMutationObserver();
	}

	private removeEvents() {
		// throw new Error("Method not implemented or element is not structured correctly.");
		super.removeEventListeners();
		window.removeEventListener('resize', this.onWindowResizeHandler);
	}

	/**
	 * Unsubscribe signals
	 */
	public unsubscribeFromSignals() {
		super.unsubscribeFromSignals();
	}

	static get observedAttributes() {
		const inheritedObsAttrs = Ch5Common.observedAttributes;
		const newObsAttrs: string[] = [];
		for (let i: number = 0; i < Ch5Dpad.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5Dpad.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				newObsAttrs.push(Ch5Dpad.COMPONENT_PROPERTIES[i].name.toLowerCase());
			}
		}
		return inheritedObsAttrs.concat(newObsAttrs);
	}

	public attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
		this.logger.start("attributeChangedCallback", this.primaryCssClass);
		if (oldValue !== newValue) {
			this.logger.log('ch5-dpad attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');
			const attributeChangedProperty = Ch5Dpad.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => { return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true });
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
	 * Function to create all the elements required under the parent DPAD tag
	 */
	protected createHtmlElements(): void {
		this.logger.start('createHtmlElements', Ch5Dpad.ELEMENT_NAME);

		this.classList.add(this.primaryCssClass);

		const childItemsContainer = this.children as HTMLCollection;

		if (childItemsContainer.length === 0 || childItemsContainer[0].children.length === 0) {
			if (!_.cloneDeep(childItemsContainer[0]?.children)) {
				this.createAndAppendAllButtonsUnderDpad();
			} else {
				this.createAndAppendAllExistingButtonsUnderDpad(childItemsContainer);
			}
		} else {
			const isValidStructureInChildDiv = this.checkIfOrderOfTagsAreInTheRightOrder(childItemsContainer[0].children);
			if (!isValidStructureInChildDiv) {
				this.createAndAppendAllExistingButtonsUnderDpad(childItemsContainer);
			}
		}

		this.logger.stop();
	}

	protected updateHtmlElements(): void {
		this.logger.start('updateHtmlElements', Ch5Dpad.ELEMENT_NAME);

		const childItemsContainer = this.children as HTMLCollection;
		if (childItemsContainer.length === 0 || childItemsContainer[0].children.length === 0) {
			if (!_.cloneDeep(childItemsContainer[0]?.children)) {
				this.createAndAppendAllButtonsUnderDpad();
			} else {
				this.createAndAppendAllExistingButtonsUnderDpad(childItemsContainer[0].children);
			}
		} else {
			const isValidStructureInChildDiv = this.checkIfOrderOfTagsAreInTheRightOrder(childItemsContainer[0].children);
			if (!isValidStructureInChildDiv) {
				this.createAndAppendAllExistingButtonsUnderDpad(childItemsContainer[0].children);
			}
		}

		this.logger.stop();
	}

	/**
	 * Create the container div which holds all the 5 buttons within dpad
	 */
	private createEmptyContainerDiv() {
		if (_.isNil(this.container) || _.isNil(this.container.classList) || this.container.classList.length === 0) {
			this.container = document.createElement('div');
			this.container.classList.add(this.containerClass);
		}
		if (this.container.parentElement !== this) {
			this.appendChild(this.container);
		}
		while (this.container.firstChild) {
			this.container.removeChild(this.container.firstChild);
		}
	}

	/**
	 * Add all 5 buttons in the expected order if not added in the DOM
	 */
	private createAndAppendAllButtonsUnderDpad() {
		const centerBtn = new Ch5DpadButton();
		centerBtn.setAttribute('key', 'center');
		const upBtn = new Ch5DpadButton();
		upBtn.setAttribute('key', 'up');
		const rightBtn = new Ch5DpadButton();
		rightBtn.setAttribute('key', 'right');
		const downBtn = new Ch5DpadButton();
		downBtn.setAttribute('key', 'down');
		const leftBtn = new Ch5DpadButton();
		leftBtn.setAttribute('key', 'left');

		this.createEmptyContainerDiv();

		// order of appending is --- center, up, left/right, right/left, down
		this.container.appendChild(centerBtn);
		this.container.appendChild(upBtn);

		if (this.shape === Ch5Dpad.SHAPES[0]) {
			// if the selected shape is 'plus'
			this.container.appendChild(leftBtn);
			this.container.appendChild(rightBtn);
		}
		else if (this.shape === Ch5Dpad.SHAPES[1]) {
			// if the selected shape is 'circle'
			this.container.appendChild(rightBtn);
			this.container.appendChild(leftBtn);
		} else {
			// if the selected shape is an invalid value
			throw new Error("Seems to be an invalid shape. Must be 'plus' or 'circle' as values.");
		}

		this.container.appendChild(downBtn);
	}

	private createAndAppendAllExistingButtonsUnderDpad(buttonsList: HTMLCollection) {
		if (!buttonsList.length) {
			return;
		}
		let centerBtn: any = null;
		let upBtn: any = null;
		let rightBtn: any = null;
		let downBtn: any = null;
		let leftBtn: any = null;
		Array.from(buttonsList).forEach(item => {
			switch (item.getAttribute('key')) {
				case 'center':
					centerBtn = item;
					break;
				case 'up':
					upBtn = item;
					break;
				case 'right':
					rightBtn = item;
					break;
				case 'down':
					downBtn = item;
					break;
				case 'left':
					leftBtn = item;
					break;
				default: throw new Error("Seems to be an invalid dpad Button value ");
			}
		});

		// if user forget one or more buttons the default ones will be added
		if (!centerBtn) {
			centerBtn = new Ch5DpadButton();
			centerBtn.setAttribute('key', 'center');
		}
		if (!upBtn) {
			upBtn = new Ch5DpadButton();
			upBtn.setAttribute('key', 'up');
		}
		if (!rightBtn) {
			rightBtn = new Ch5DpadButton();
			rightBtn.setAttribute('key', 'right');
		}
		if (!downBtn) {
			downBtn = new Ch5DpadButton();
			downBtn.setAttribute('key', 'down');
		}
		if (!leftBtn) {
			leftBtn = new Ch5DpadButton();
			leftBtn.setAttribute('key', 'left');
		}

		this.createEmptyContainerDiv();

		// order of appending is --- center, up, left/right, right/left, down
		this.container.appendChild(centerBtn);
		this.container.appendChild(upBtn);

		if (this.shape === Ch5Dpad.SHAPES[0]) {
			// if the selected shape is 'plus'
			this.container.appendChild(leftBtn);
			this.container.appendChild(rightBtn);
		}
		else if (this.shape === Ch5Dpad.SHAPES[1]) {
			// if the selected shape is 'circle'
			this.container.appendChild(rightBtn);
			this.container.appendChild(leftBtn);
		} else {
			// if the selected shape is an invalid value
			throw new Error("Seems to be an invalid shape. Must be 'plus' or 'circle' as values.");
		}

		this.container.appendChild(downBtn);
	}

	/**
	 * Function to check if the tags are sequenced in the right/expected order
	 * @param childItems 
	 * @returns true if the order is correct [order of appending is --- center, up, left/right, right/left, down]
	 */
	private checkIfOrderOfTagsAreInTheRightOrder(childItems: HTMLCollection) {
		let ret = false;
		if (childItems.length === 5) {
			const firstTag = this.shape === Ch5Dpad.SHAPES[0] ? 'left' : 'right'; // if 'plus'
			const secondTag = this.shape === Ch5Dpad.SHAPES[0] ? 'right' : 'left'; // if 'circle'

			ret = ((childItems[0].getAttribute('key') === 'center') &&
				(childItems[1].getAttribute('key') === 'up') &&
				(childItems[2].getAttribute('key') === firstTag) &&
				(childItems[3].getAttribute('key') === secondTag) &&
				(childItems[4].getAttribute('key') === 'down'));
		} else {
			// removing child tags and emptying DPAD if the tag count is neither 0 or 5
			if (childItems.length > 0) {
				for (const item of Array.from(childItems)) {
					item.remove();
				}
			}
		}
		return ret;
	}

	/**
	 *  Called to initialize all attributes
	 */
	protected initAttributes(): void {
		this.logger.start("initAttributes", Ch5Dpad.ELEMENT_NAME);
		super.initAttributes();
		this.setAttribute('data-ch5-id', this.getCrId());
		ComponentHelper.setAttributeToElement(this, 'role', Ch5RoleAttributeMapping.ch5Dpad);

		const thisRef: any = this;
		for (let i: number = 0; i < Ch5Dpad.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5Dpad.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				if (this.hasAttribute(Ch5Dpad.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
					const key = Ch5Dpad.COMPONENT_PROPERTIES[i].name;
					thisRef[key] = this.getAttribute(key);
				}
			}
		}
		this.logger.stop();
	}

	/**
	 * Called to bind proper listeners
	 */
	protected attachEventListeners() {
		super.attachEventListeners();
		window.addEventListener('resize', this.onWindowResizeHandler.bind(this));
	}

	protected updateCssClasses(): void {
		// apply css classes for attrs inherited from common (e.g. customClass, customStyle)
		super.updateCssClasses();

		for (const typeVal of Ch5Dpad.TYPES) {
			this.classList.remove(Ch5Dpad.ELEMENT_NAME + Ch5Dpad.CSS_CLASS_PREFIX_TYPE + typeVal);
		}
		this.classList.add(Ch5Dpad.ELEMENT_NAME + Ch5Dpad.CSS_CLASS_PREFIX_TYPE + this.type);

		for (const typeVal of Ch5Dpad.SHAPES) {
			this.classList.remove(Ch5Dpad.ELEMENT_NAME + Ch5Dpad.CSS_CLASS_PREFIX_SHAPE + typeVal);
		}
		this.classList.add(Ch5Dpad.ELEMENT_NAME + Ch5Dpad.CSS_CLASS_PREFIX_SHAPE + this.shape);

		for (const typeVal of Ch5Dpad.SIZES) {
			this.classList.remove(Ch5Dpad.ELEMENT_NAME + Ch5Dpad.CSS_CLASS_PREFIX_SIZE + typeVal);
		}
		this.classList.add(Ch5Dpad.ELEMENT_NAME + Ch5Dpad.CSS_CLASS_PREFIX_SIZE + this.size);

		for (const typeVal of Ch5Dpad.STRETCHES) {
			this.classList.remove(Ch5Dpad.ELEMENT_NAME + Ch5Dpad.CSS_CLASS_PREFIX_STRETCH + typeVal);
		}
		if (!!this.stretch && this.stretch.length > 0) { // checking for length since it does not have a default value
			this.classList.add(Ch5Dpad.ELEMENT_NAME + Ch5Dpad.CSS_CLASS_PREFIX_STRETCH + this.stretch);
			if (!!this.size && this.size.length > 0) {
				this.classList.remove(Ch5Dpad.ELEMENT_NAME + Ch5Dpad.CSS_CLASS_PREFIX_SIZE + this.size);
			}
		}
	}

	protected initCssClasses(): void {
		this.classList.add(Ch5Dpad.ELEMENT_NAME + Ch5Dpad.CSS_CLASS_PREFIX_TYPE + this.type);
		this.classList.add(Ch5Dpad.ELEMENT_NAME + Ch5Dpad.CSS_CLASS_PREFIX_SHAPE + this.shape);
		this.classList.add(Ch5Dpad.ELEMENT_NAME + Ch5Dpad.CSS_CLASS_PREFIX_SIZE + this.size);
		if (!!this.stretch && this.stretch.length > 0) { // checking for length since it does not have a default value
			this.classList.add(Ch5Dpad.ELEMENT_NAME + Ch5Dpad.CSS_CLASS_PREFIX_STRETCH + this.stretch);
			if (!!this.size && this.size.length > 0) {
				this.classList.remove(Ch5Dpad.ELEMENT_NAME + Ch5Dpad.CSS_CLASS_PREFIX_SIZE + this.size);
			}
		}
	}

	//#endregion

	//#region 4. Other Methods

	/**
	 * Restructure initial DOM before rendering commences
	 */
	private checkAndRestructureDomOfDpad() {
		this.logger.start('checkAndRestructureDomOfDpad()', Ch5Dpad.ELEMENT_NAME);
		this.updateHtmlElements();
		this.updateCssClasses();
		this.logger.stop();
	}

	private handleUseContractForEnable(value: boolean) {
		const isUseContractForEnable = this.toBoolean(value);
		const contractName = this.contractName;

		if (contractName.length > 0 && (this.useContractForEnable !== isUseContractForEnable)) {
			this.contractDefaultHelper();
			const sigVal = contractName + "Enable";
			const params: TCh5CreateReceiveStateSigParams = {
				caller: this,
				attrKey: 'useContractForEnable',
				value: sigVal,
				callbackOnSignalReceived: (newValue: string | boolean) => {
					newValue = (!isUseContractForEnable).toString();
					ComponentHelper.setAttributeToElement(this, 'disabled', newValue);
				}
			};
			this.setValueForReceiveStateBoolean(params);
		}
	}

	private handleUseContractForShow(value: boolean) {
		const isUseContractForShow = this.toBoolean(value);
		const contractName = this.contractName;

		if (contractName.length > 0 && (this.useContractForShow !== isUseContractForShow)) {
			this.contractDefaultHelper();
			const sigVal = contractName + "Show";
			const params: TCh5CreateReceiveStateSigParams = {
				caller: this,
				attrKey: 'useContractForShow',
				value: sigVal,
				callbackOnSignalReceived: (newValue: string | boolean) => {
					newValue = (!newValue).toString();
					ComponentHelper.setAttributeToElement(this, 'show', newValue);
				}
			};
			this.setValueForReceiveStateBoolean(params);
		}
	}

	private handleUseContractForCustomStyle(value: boolean) {
		const isUseContractForCustomStyle = this.toBoolean(value);
		const contractName = this.contractName;

		if (contractName.length > 0 && (this.useContractForCustomStyle !== isUseContractForCustomStyle)) {
			this.contractDefaultHelper();
			const sigVal = contractName + "CustomStyle";
			const params: TCh5CreateReceiveStateSigParams = {
				caller: this,
				attrKey: 'useContractForCustomStyle',
				value: sigVal,
				callbackOnSignalReceived: (newValue: string | boolean) => {
					newValue = newValue as string;
					this.customStyle = newValue;
				}
			};
			this.setValueForReceiveStateString(params);
		}
	}

	private handleUseContractForCustomClass(value: boolean) {
		const isUseContractForCustomClass = this.toBoolean(value);
		const contractName = this.contractName;

		if (contractName.length > 0 && (this.useContractForCustomClass !== isUseContractForCustomClass)) {
			this.contractDefaultHelper();
			const sigVal = contractName + "CustomClass";
			const params: TCh5CreateReceiveStateSigParams = {
				caller: this,
				attrKey: 'useContractForCustomClass',
				value: sigVal,
				callbackOnSignalReceived: (newValue: string | boolean) => {
					newValue = newValue as string;
					this.customClass = newValue;
				}
			};
			this.setValueForReceiveStateString(params);
		}
	}

	private contractDefaultHelper() {
		const contractName = this.contractName;
		if (!_.isNil(contractName) && contractName !== "") {
			if (this.getAttribute("useContractForCustomStyle") === "true") {
				this.setAttribute("receiveStateCustomStyle", contractName + '.CustomStyle');
			} else {
				this.removeAttribute("receiveStateCustomStyle");
			}

			if (this.getAttribute("useContractForCustomClass") === "true") {
				this.setAttribute("receiveStateCustomClass", contractName + '.CustomClass');
			} else {
				this.removeAttribute("receiveStateCustomClass");
			}

			if (this.getAttribute("useContractForEnable") === "true") {
				this.setAttribute("receiveStateEnable", contractName + '.Enable');
			} else {
				this.removeAttribute("receiveStateEnable");
			}

			if (this.getAttribute("useContractForShow") === "true") {
				this.setAttribute("receiveStateShow", contractName + '.Show');
			} else {
				this.removeAttribute("receiveStateShow");
			}
		}
	}

	/**
	 * Add the send event on click attribute to child elements if valid scenario
	 * contractName.length === 0 and eventKeyStart is a valid number
	 * @param eventKeyStart sendEventOnClickStart event's initial value
	 */
	private updateEventClickHandlers(eventKeyStart: number) {
		const contractName = this.contractName;
		const buttonList = this.getElementsByTagName("ch5-dpad-button");
		let centerBtn;
		let upBtn;
		let rightBtn;
		let downBtn;
		let leftBtn;
		if (buttonList.length > 0) {
			// tslint:disable-next-line:prefer-for-of
			for (let index = 0; index < buttonList.length; index++) {
				const elementKey = buttonList[index].getAttribute('key');
				if (elementKey) {
					switch (elementKey) {
						case 'center':
							centerBtn = buttonList[index];
							break;
						case 'up':
							upBtn = buttonList[index];
							break;
						case 'left':
							leftBtn = buttonList[index];
							break;
						case 'right':
							rightBtn = buttonList[index];
							break;
						case 'down':
							downBtn = buttonList[index];
							break;
						default:
							centerBtn = buttonList[index];
							break;
					}
				}
			}
		}

		if (contractName.length === 0 && !isNaN(eventKeyStart)) {
			if (!_.isNil(centerBtn)) {
				const contractVal = eventKeyStart + CH5DpadUtils.sendEventOnClickSigCountToAdd.center;
				centerBtn.setAttribute('sendEventOnClick'.toLowerCase(), contractVal.toString());
			}
			if (!_.isNil(upBtn)) {
				const contractVal = eventKeyStart + CH5DpadUtils.sendEventOnClickSigCountToAdd.up;
				upBtn.setAttribute('sendEventOnClick'.toLowerCase(), contractVal.toString());
			}
			if (!_.isNil(rightBtn)) {
				const contractVal = eventKeyStart + CH5DpadUtils.sendEventOnClickSigCountToAdd.right;
				rightBtn.setAttribute('sendEventOnClick'.toLowerCase(), contractVal.toString());
			}
			if (!_.isNil(downBtn)) {
				const contractVal = eventKeyStart + CH5DpadUtils.sendEventOnClickSigCountToAdd.down;
				downBtn.setAttribute('sendEventOnClick'.toLowerCase(), contractVal.toString());
			}
			if (!_.isNil(leftBtn)) {
				const contractVal = eventKeyStart + CH5DpadUtils.sendEventOnClickSigCountToAdd.left;
				leftBtn.setAttribute('sendEventOnClick'.toLowerCase(), contractVal.toString());
			}
		}
	}
	private updateContractNameBasedHandlers() {
		const contractName = this.contractName;
		const buttonList = this.getElementsByTagName("ch5-dpad-button");
		let centerBtn;
		let upBtn;
		let rightBtn;
		let downBtn;
		let leftBtn;
		if (buttonList.length > 0) {
			// tslint:disable-next-line:prefer-for-of
			for (let index = 0; index < buttonList.length; index++) {
				const elementKey = buttonList[index].getAttribute('key');
				if (elementKey) {
					switch (elementKey) {
						case 'center':
							centerBtn = buttonList[index];
							break;
						case 'up':
							upBtn = buttonList[index];
							break;
						case 'left':
							leftBtn = buttonList[index];
							break;
						case 'right':
							rightBtn = buttonList[index];
							break;
						case 'down':
							downBtn = buttonList[index];
							break;
						default:
							centerBtn = buttonList[index];
							break;
					}
				}
			}
		}
		if (contractName.length > 0) {
			if (!_.isNil(centerBtn)) {
				const contractVal = contractName + "." + CH5DpadUtils.contractSuffix.center;
				centerBtn.setAttribute('sendEventOnClick'.toLowerCase(), contractVal.toString());
			}

			if (!_.isNil(upBtn)) {
				const contractVal = contractName + "." + CH5DpadUtils.contractSuffix.up;
				upBtn.setAttribute('sendEventOnClick'.toLowerCase(), contractVal.toString());
			}

			if (!_.isNil(rightBtn)) {
				const contractVal = contractName + "." + CH5DpadUtils.contractSuffix.right;
				rightBtn.setAttribute('sendEventOnClick'.toLowerCase(), contractVal.toString());
			}

			if (!_.isNil(downBtn)) {
				const contractVal = contractName + "." + CH5DpadUtils.contractSuffix.down;
				downBtn.setAttribute('sendEventOnClick'.toLowerCase(), contractVal.toString());
			}

			if (!_.isNil(leftBtn)) {
				const contractVal = contractName + "." + CH5DpadUtils.contractSuffix.left;
				leftBtn.setAttribute('sendEventOnClick'.toLowerCase(), contractVal.toString());
			}
		}
	}

	private stretchHandler() {
		this.logger.start(Ch5Dpad.ELEMENT_NAME + ' > stretchHandler');
		this.updateCssClasses();
		const dpadHeight = this.offsetHeight;
		const dpadWidth = this.offsetWidth;
		let dimensionVal = Math.min(dpadHeight, dpadWidth);
		if (!!this.stretch && this.stretch.length === 0) {
			dimensionVal = 0;
		}
		if (!!this.container && !!this.container.style) {
			if (dimensionVal === 0) {
				this.container.style.removeProperty('height');
				this.container.style.removeProperty('width');
			}
			const parentElement = this.parentElement;
			if (!!this.stretch && this.stretch.trim().length > 0 && !!parentElement) {
				dimensionVal = Math.min(parentElement.offsetHeight, parentElement.offsetWidth);
				this.container.style.height = dimensionVal + 'px';
				this.container.style.width = dimensionVal + 'px';
			}
		}
		this.logger.stop();
	}

	/**
	 * Handle the resize event for dpad to be redrawn if required
	 */
	private onWindowResizeHandler() {
		// since stretch has no default value, should fire stretchHandler only if required
		if (!!this.stretch && this.stretch.length > 0 && !this.isResizeInProgress) {
			this.isResizeInProgress = true;
			setTimeout(() => {
				this.stretchHandler();
				this.isResizeInProgress = false; // reset debounce once completed
			}, this.RESIZE_DEBOUNCE);
		}
	}

	//#endregion

}

Ch5Dpad.registerCustomElement();
Ch5Dpad.registerSignalAttributeTypes();
