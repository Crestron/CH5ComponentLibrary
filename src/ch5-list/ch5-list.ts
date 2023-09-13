// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import isNil from 'lodash/isNil';
import { Ch5Common } from '../ch5-common/ch5-common';
import { noop } from '../ch5-common/utils/noop';
import { TCh5ListElementOrientation } from "./interfaces";
import { Ch5Config } from '..';
import { clamp } from '../ch5-triggerview/utils';
import { Ch5ListTemplate } from './ch5-list-template';
import { Ch5ListEventManager } from './ch5-list-event-manager';
import { Ch5ListSignalManager, SignalSubscriptionCallback } from './ch5-list-signal-manager';
import { Ch5ListAnimation } from './ch5-list-animation';
import { Ch5ListBufferedItems, ICh5ListBufferedItems } from './ch5-list-buffered-items';
import { Ch5AnimationFactory } from './animation/ch5-animation-factory';
import { ICh5ListAttributes } from "./interfaces";
import { Ch5ListSizeResolver } from './ch5-list-size-resolver';
import { subscribeInViewPortChange, unSubscribeInViewPortChange } from '../ch5-core';
import { Ch5RoleAttributeMapping } from '../utility-models';
import { Ch5SignalAttributeRegistry, Ch5SignalElementAttributeRegistryEntries } from "../ch5-common/ch5-signal-attribute-registry";
import { Ch5Properties } from "../ch5-core/ch5-properties";
import { ICh5PropertySettings } from "../ch5-core/ch5-property";

/**
 * An object containing information about a item.
 * @typedef {object} ICh5ListChildInfo
 * @property {HTMLElement} element The DOM element
 * @property {number} layoutIndex The real index in the layout.
 * @property {number} translateX The current x position within the list (in px).
 * @property {number} translateY The current y position within the list (in px).
 */
export interface ICh5ListItemInfo {
	element: HTMLElement;
	layoutIndex: number;
	translateX: number;
	translateY: number;
}

export enum Ch5ListItemAxis { X, Y }

export type Ch5ListSignature = { [key: string]: any; };
export const duration = 300;
export const easeMode = 'ease-out';

/**
 * Html Attributes
 *
 * - size
 * - maxWidth
 * - minWidth
 * - maxHeight
 * - minHeight
 * - orientation
 * - bufferAmount
 * - itemHeight
 * - itemWidth
 * - indexId
 * - pagedSwipe
 * - disabled
 * - endless
 * - scrollbar
 * - scrollToTime
 * - receiveStateSize
 * - receiveStateScrollTo
 * - receiveStateTemplateVars
 *
 *
 * CSS classes for ch5-list
 *
 * | Name                              | Description                                                          |
 * |:--------------------------------- |:-------------------------------------------------------------------- |
 * | ch5-list                         | primary class                                                        |
 * | ch5-list--disabled               | applied when is disabled                                             |
 */
export class Ch5List extends Ch5Common implements ICh5ListAttributes {

	// private static DEBUG: boolean = false;
	public static readonly ELEMENT_NAME = 'ch5-list';

	// valid values accessible to Apps and "design time"
	/**
	 * The first value is considered the default one
	 */
	public static ORIENTATION: TCh5ListElementOrientation[] = ['vertical', 'horizontal'];

	public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
		...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
		receivestatesize: { direction: "state", numericJoin: 1, contractName: true },
		receivestatescrollto: { direction: "state", numericJoin: 1, contractName: true },
		receivestatetemplatevars: { direction: "state", stringJoin: 1, contractName: true },
		contractname: { contractName: true },
		booleanjoinoffset: { booleanJoin: 1 },
		numericjoinoffset: { numericJoin: 1 },
		stringjoinoffset: { stringJoin: 1 }
	};

	public static readonly COMPONENT_DATA: any = {
		SCALE: {
			default: Ch5List.ORIENTATION[0],
			values: Ch5List.ORIENTATION,
			key: 'scale',
			classListPrefix: '--'
		},
	};
	public static readonly COMPONENT_PROPERTIES: ICh5PropertySettings[] = [
		{
			default: false,
			name: "scrollbar",
			removeAttributeOnNull: true,
			type: "boolean",
			valueOnAttributeEmpty: true,
			isObservableProperty: true,
		},
		{
			default: false,
			name: "endless",
			removeAttributeOnNull: true,
			type: "boolean",
			valueOnAttributeEmpty: true,
			isObservableProperty: true,
		},
	];
	/**
	 * Default css class name
	 */

	public static ENABLED_CLASS_NAME = 'ch5-list';

	public static ITEMCLASS = 'list-item';
	private _ch5Properties: Ch5Properties;

	public primaryCssClass = 'ch5-list';

	public _bufferedItems: ICh5ListBufferedItems = {
		bufferActive: false,
		bufferingComplete: false,
		bufferForwardStartIndex: 0,
		forwardBufferedItems: [],
		bufferBackwardsStartIndex: 0,
		backwardsBufferedItems: []
	};

	public _appendPosition: number = 0;

	/**
	 * The width of private divList (in px). Derived from CSS.
	 * @type {number}
	 * @private
	 */
	public _divListWidth = 0;

	/**
	 * The height of private divList (in px). Derived from CSS.
	 * @type {number}
	 * @private
	 */
	public _divListHeight = 0;

	/**
	 * The width of a single list item (in px). Border included
	 */
	public itemOffsetWidth: number = 0;

	/**
	 * The width of a single list item (in px). Border included
	 */
	public itemOffsetHeight: number = 0;

	public viewportClientHeight: number = 0;
	public viewportClientWidth: number = 0;

	public templateHelper: Ch5ListTemplate;
	public eventManager: Ch5ListEventManager;
	public animationHelper: Ch5ListAnimation;
	public signalManager: Ch5ListSignalManager;
	public bufferdItemsHelper: Ch5ListBufferedItems;
	public divList: HTMLDivElement = document.createElement('div') as HTMLDivElement;

	public pointerStartTime: number = 0;
	public pointerEndTime: number = 0;

	public stepOnX: number = 0;
	public stepOnY: number = 0;

	public currentPage: number = 0;
	public templateElement: HTMLTemplateElement = {} as HTMLTemplateElement;

	/**
	 * This utility is responsible to calculate the size of the list
	 * all the states. ( size of list viewport, size of hidden list,
	 * the number of items on a page and so on )
	 *
	 * @see Ch5ListSizeResolver
	 */
	public sizeResolver: Ch5ListSizeResolver = {} as Ch5ListSizeResolver;

	/**
	 * LIST CONTAINER
	 *  --------------------------------------------------
	 * |      [  VISIBLE LIST ITEMS  ]                    |
	 *  --------------------------------------------------
	 *        ^ currentXPosition
	 */
	private _currentXPosition: number = 0;
	private _currentYPosition: number = 0;

	private _defaultScrollToTime: number = 500;
	private _size: number = 1;

	/**
	 * For example when you the list size is changed this remains the unchanged
	 * for additional computation
	 *
	 * @see Ch5ListTemplate.resizeList
	 * @type {number}
	 * @private
	 */
	private _previousSize: number = 1;
	private _orientation: TCh5ListElementOrientation = Ch5List.ORIENTATION[0];
	private _bufferAmount: number = 0;
	private _itemHeight: string | null = null;
	private _itemWidth: string | null = null;
	private _minWidth: string | null = null;
	private _maxWidth: string | null = null;
	private _minHeight: string | null = null;
	private _maxHeight: string | null = null;
	private _pagedSwipe: boolean = false;
	private _scrollToTime: number = 500;
	private _indexId: string | null = null;
	private _direction: string = Ch5Common.DIRECTION[0];
	private _templateVars: string | null = null;
	private _receiveStateSize: string | null | undefined = null;
	private _receiveStateSizeSub: string = '';
	private _receiveStateScrollTo: string | null | undefined = null;
	private _receiveStateScrollToSub: string = '';
	private _receiveStateTemplateVars: string | null | undefined = null;
	private _receiveStateTemplateVarsSub: string = '';
	private _processingPan: boolean = false;

	private _storedOffsetWidth: number = 0;
	private _storedOffsetHeight: number = 0;
	private _tplHtmlString: string = '';


	/**
	 * The reference to the timer used to debounce the `update()` function.
	 * @type {number|undefined}
	 * @private
	 */
	private _updateTimer: number | undefined = undefined;

	// Touch / drag

	/**
	 * Whether the user's pointer is currently being used to drag the items.
	 * @type {boolean}
	 * @private
	 */
	private _isPointerActive = false;

	/**
	 * The ID of the active pointer that is dragging the items.
	 * @type {number}
	 * @private
	 */
	private _pointerId = 0;

	/**
	 * The coordinate on the X axis at which the active pointer first "touched".
	 * @type {number}
	 * @private
	 */
	private _pointerFirstX = 0;

	/**
	 * The coordinate on the Y axis at which the active pointer first "touched".
	 * @type {number}
	 * @private
	 */
	private _pointerFirstY = 0;

	/**
	 * The coordinate on the X axis used to the set the wrapper's translation
	 * during the last frame.
	 * @type {number}
	 * @private
	 */
	private _pointerLastX = 0;

	/**
	 * The coordinate on the Y axis used to the set the wrapper's translation
	 * during the last frame.
	 * @type {number}
	 * @private
	 */
	private _pointerLastY = 0;

	/**
	 * The coordinate on the X axis at which the active pointer last "touched".
	 * @type {number}
	 * @private
	 */
	private _pointerCurrentX = 0;

	/**
	 * The coordinate on the Y axis at which the active pointer last "touched".
	 * @type {number}
	 * @private
	 */
	private _pointerCurrentY = 0;

	/**
	 * Updated during pointer events.
	 * @type {number}
	 * @private
	 */
	private _lastDraggedLayoutIndex = 0;

	/**
	 * Array containining the translation x value assumed by the divList in
	 * the last 100ms. Used to compute the starting velocity when decelerating.
	 * @type {Array<number>}
	 * @private
	 */
	private _trackingPointsX: any[] = [];

	/**
	 * Array containining the translation y value assumed by the divList in
	 * the last 100ms. Used to compute the starting velocity when decelerating.
	 * @type {Array<number>}
	 * @private
	 */
	private _trackingPointsY: any[] = [];

	/**
	 * Flag used to limit the number of udpates to the divList to once
	 * per frame (the pointer events may fire more frequently than that).
	 * @type {boolean}
	 * @private
	 */
	private _dragTicking = false;

	/**
	 * The upper bound for the initial value of the velocity when decelerating.
	 * @type {number}
	 * @private
	 */
	private _maxDecelVelocity = 50;

	/**
	 * The lower bound for the initial value of the velocity when decelerating.
	 * @type {number}
	 * @private
	 */
	private _minDecelVelocity = 20;

	/**
	 * The value for the friction strength used when decelerating.
	 * 0 < friction < 1.
	 * @type {number}
	 * @private
	 */
	private _friction = 0.7;

	/**
	 * The value for the attraction strength used when decelerating.
	 * @type {number}
	 * @private
	 */
	private _attraction = 0.04;

	/**
	 * The value of the deceleration velocity (in px).
	 * @type {number}
	 * @private
	 */
	private _decelVelocity = 0;

	/**
	 * Whether the list is currently decelerating towards its final point
	 * after being dragged by the user.
	 * @type {boolean}
	 * @private
	 *
	 */
	private _decelerating = false;

	/**
	 * Here is keep the timeout for scrollTo transition
	 *
	 * @type {number}
	 * @private
	 */
	private _scrollToTimeReference: number = 0;

	private _initCompleted: boolean = false;
	private _cachedFirstRenderVisibleItemsNr: number = 0;

	/**
	 * The array of items, i.e. the children of this.divList.
	 * @type {Array<ICh5ListItemInfo>}
	 * @private
	 */
	private _items: ICh5ListItemInfo[] = [];

	/**
	 * The index of the the last view.
	 * @type {number}
	 * @private
	 */
	private _lastViewIndex = -1;

	/**
	 * Whether the first/previous item should infinite loop
	 * @type {boolean}
	 * @private
	 */
	private _infiniteLoop = false;

	/**
	 * The translation on the X axis applied to private divList (in px).
	 * @type {number}
	 * @private
	 */
	private _wrapperTranslateX: number = 0;

	/**
	 * The translation on the Y axis applied to private divList (in px).
	 * @type {number}
	 * @private
	 */
	private _wrapperTranslateY = 0;

	/**
	 * An internal index representing the "wrapAround" iteration about the
	 * selected index. If _infiniteLoop is false, its value doesn't change.
	 * @type {number}
	 * @private
	 */
	private _selectedIteration = 0;

	/**
	 * An internal index keeping track of the previous value for the layout
	 * index. Useful for understanding which items need to be moved.Gets
	 * updated every time `selected` changes.
	 * @type {number}
	 * @private
	 */
	private _previousEffectiveLayoutIndex = 0;

	private _isListVisible: boolean = true;

	private receiveStateScrollToChanged: boolean = false;

	public static registerSignalAttributeTypes() {
		Ch5SignalAttributeRegistry.instance.addElementAttributeEntries(Ch5List.ELEMENT_NAME, Ch5List.SIGNAL_ATTRIBUTE_TYPES);
	}

	public static registerSignalAttributeDefaults() {
		Ch5SignalAttributeRegistry.instance.addElementDefaultAttributeEntries(Ch5List.ELEMENT_NAME, {
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
			&& window.customElements.get(Ch5List.ELEMENT_NAME) === undefined) {
			window.customElements.define(Ch5List.ELEMENT_NAME, Ch5List);
		}
	}

	public constructor() {
		super();

		this.templateHelper = new Ch5ListTemplate(this);
		this.signalManager = new Ch5ListSignalManager(this);
		this.animationHelper = new Ch5ListAnimation(this);
		this.eventManager = new Ch5ListEventManager(this);
		this.bufferdItemsHelper = new Ch5ListBufferedItems(this);

		this._ch5Properties = new Ch5Properties(this, Ch5List.COMPONENT_PROPERTIES);
		this.eventManager.addAnimationHelper(this.animationHelper);
		this.eventManager.addTemplateHelper(this.templateHelper);

		this.animationHelper.addTemplateHelper(this.templateHelper);
		this.animationHelper.addEventManager(this.eventManager);

		this.bufferdItemsHelper.addTemplateHelper(this.templateHelper);
	}

	public getCssClassDisabled() {
		return `${this.primaryCssClass}--disabled`;
	}

	public connectedCallback() {
		this._isListVisible = true;
		this.contentCleanUp();

		subscribeInViewPortChange(this, () => {
			this.info(`Ch5List.subscribeInViewPortChange() with elementIsInViewPort: ${this.elementIsInViewPort}, this.receiveStateScrollToChanged: ${this.receiveStateScrollToChanged}, _isListVisible: ${this._isListVisible},  this.hasAttribute('scrollbar'): ${this.hasAttribute('scrollbar')}`);

			if (this.elementIsInViewPort && (this._isListVisible || this.receiveStateScrollToChanged)) {
				this.info("Updating View");
				const appendScrollbarIfNoEndless = this.hasAttribute('endless') ? String(this.getAttribute('endless')) !== 'true' : true;
				if (this.hasAttribute('scrollbar') && String(this.getAttribute('scrollbar')) === 'true' && appendScrollbarIfNoEndless) {
					this.templateHelper.customScrollbar(this.divList);
					setTimeout(() => {
						this.templateHelper.resizeList(this.divList, this.templateVars);
					}, 0.5);
				} else {
					this.templateHelper.resetListLayout();
				}

				this.templateHelper.checkAndSetSizes();
				if (appendScrollbarIfNoEndless) {
					this.templateHelper.customScrollbar(this.divList);
				}
				this._isListVisible = false;
				this.receiveStateScrollToChanged = false;
				if (this.hasAttribute('receiveStateScrollTo') && String(this.getAttribute('receiveStateScrollTo')) !== '') {
					this.setScrollToContent();
				}

				if (this.endless) {
					setTimeout(() => {
						this.templateHelper.removeScrollbar();
					}, 1);
				}
			}
		});

		const listInitialization = () => {
			// WAI-ARIA Attributes
			if (!this.hasAttribute('role')) {
				this.setAttribute('role', Ch5RoleAttributeMapping.ch5List);
			}

			// TODO: andrei - what happens if the endless attribute is set at a given time
			// not at initialization
			if (this.hasAttribute('endless') && this.getAttribute('endless') !== 'false' && this.getAttribute('endless') !== null) {
				this.templateHelper.endless = true;
			}

			this.info('connectedCallback');

			// set data-ch5-id
			this.setAttribute('data-ch5-id', this.getCrId());

			// callback run if template is found
			const templateFound = () => {
				this.info('connectedCallback initializations');
				this.initializations();
			};

			// callback run if template is not found
			const templateNotFound = () => {
				this.info('add mutation observer in order to extract template data');
				this._startReadyObserver();
				this.initializations();
			};

			this._tplHtmlString = this.templateHelper.checkForTemplate();

			if (this._tplHtmlString === '') {
				templateNotFound();
				this.templateHelper.updateTemplateString(this._tplHtmlString);
			} else {
				templateFound();
			}

			this.initCommonMutationObserver(this);

			const animationFactory = new Ch5AnimationFactory();
			const animationApi = animationFactory.getAnimation(duration, easeMode, this.divList);
			this.animationHelper.addAnimationApi(animationApi);

			this.info("Callback loaded - ch5 list");
		};

		Promise.all([
			customElements.whenDefined('ch5-list'),
		]).then(() => {
			listInitialization();
			this.componentLoadedEvent('ch5-list', this.id);
		});
	}

	public initializations() {
		this.cacheComponentChildrens();
		this.initializeAttributes();
		this.resolveTemplateChildren(this.templateElement);
		const tplVars = Ch5Config.getTemplateVarsForElement(this);
		if (tplVars.length > 0) {
			this.templateVars = JSON.stringify(tplVars);
		}

		this._previousEffectiveLayoutIndex = this.selected;

		if (this._tplHtmlString.length <= 0) {
			return;
		}

		this.templateHelper.resizeList(this.divList, this.templateVars);

		if (!this.isPagedSwipeCompatible(this.pagedSwipe)) {
			this.pagedSwipe = false;
		}

		this.initializeEvents();
		this._initCompleted = true;
	}

	public disconnectedCallback() {
		// remove all bindings for child elements
		this.removeEvents();
		// unsubscribe from signals
		this.unsubscribeFromSignals();
		// unsubscribe view port
		unSubscribeInViewPortChange(this);
		// disconnect common mutation observer
		this.disconnectCommonMutationObserver();
	}


	public unsubscribeFromSignals() {
		this.info('unsubscribeFromSignals()');
		super.unsubscribeFromSignals();

		this.signalManager.unsubscribeFromSignals(this.clearStringSignalSubscription);
	}
	/**
	 * Called when an HTML attribute is changed, added or removed
	 */
	public attributeChangedCallback(attr: string, oldValue: string, newValue: string) {
		if (oldValue === newValue) {
			return;
		}

		this.info('ch5-list attributeChangedCallback("' + attr + '","' + oldValue + '","' + newValue + '")');

		this.info('attribute changed callback:', attr);
		const attributeChangedProperty = Ch5List.COMPONENT_PROPERTIES.find((property: ICh5PropertySettings) => {
			return property.name.toLowerCase() === attr.toLowerCase() && property.isObservableProperty === true;
		});
		if (attributeChangedProperty) {
			const thisRef: any = this;
			const key = attributeChangedProperty.name;
			thisRef[key] = newValue;
		} else {
			switch (attr) {
				case 'selected':
					const parsedNewValue = parseInt(newValue, 10);

					// Accept only numbers between `0` and `this._lastViewIndex`.
					if (!Number.isFinite(parsedNewValue) ||
						parsedNewValue > this._lastViewIndex ||
						parsedNewValue < 0) {
						this.selected = Number(oldValue) || 0;
						return;
					}

					if (this._infiniteLoop) {
						const effectiveLayoutIndex = this.selected +
							this._selectedIteration * (this._lastViewIndex + 1);

						// Get the "jump" between the current layout position and the previous
						// one. This gives the indication of which items need to be moved to
						// a different location.
						// selectionDelta: if negative, we're selecting a item to the right
						// The absolute value is shows by how many items the "jump" is.
						// If selectionDelta === 0, no action is needed.
						const selectionDelta = this._previousEffectiveLayoutIndex -
							effectiveLayoutIndex;

						// Compute which items are going to be in view in the upcoming
						// transition.
						const itemsInViewIndexes: any = [];
						const indexOffset = selectionDelta < 0 ?
							this.getItemsPerPage() + selectionDelta : 0;
						// Starting at -1 means that we're also shifting the item to the left
						// of the current one. Useful to not brake the itemr while dragging
						// left.
						for (let i = -1; i < Math.abs(selectionDelta); i++) {
							// The index is compute by adding up:
							// - i: the current iteration's index
							// - effectiveLayoutIndex: where the itemr is currently at
							// - indexOffset: compensates when scrolling right by taking into
							//   account the number of itemsPerView and selectionDelta
							itemsInViewIndexes.push(i + effectiveLayoutIndex + indexOffset);
						}

						this._previousEffectiveLayoutIndex = effectiveLayoutIndex;
					}

					break;
				case 'disableanimation':
					this.animationHelper.disableAnimation = (newValue !== null);

					break;
				case 'size':
					const newSize: number = newValue ? Number(newValue) : 1;
					if (this._initCompleted && newSize !== this.size) {
						// trigger list resize only if all initializations are done and size prop has a different value
						// (otherwise resizeList will run twice on firs load)
						this.size = newSize;
						this.templateHelper.resizeList(this.divList, this.templateVars);
					}
					break;
				case 'orientation':
					if (this.hasAttribute('orientation')) {
						this.orientation = newValue as TCh5ListElementOrientation;
					} else {
						this.orientation = Ch5List.ORIENTATION[0];
					}
					break;
				case 'bufferamount':
					if (this.hasAttribute('bufferamount')) {
						this.bufferAmount = Number(newValue);
					} else {
						this.bufferAmount = 0;
					}
					break;
				case 'itemheight':
					if (this.hasAttribute('itemheight')) {
						this.itemHeight = newValue;
					}
					break;
				case 'itemwidth':
					if (this.hasAttribute('itemwidth')) {
						this.itemWidth = newValue;
					}
					break;
				case 'minwidth':
					if (this.hasAttribute('minwidth')) {
						this.minWidth = newValue;
					}
					break;
				case 'maxwidth':
					if (this.hasAttribute('maxwidth')) {
						this.maxWidth = newValue;
					}
					break;
				case 'minheight':
					if (this.hasAttribute('minheight')) {
						this.minHeight = newValue;
					}
					break;
				case 'maxheight':
					if (this.hasAttribute('maxheight')) {
						this.maxHeight = newValue;
					}
					break;
				case 'indexid':
					if (this.hasAttribute('indexid')) {
						this.indexId = newValue;
					}
					break;
				case 'pagedswipe':
					if (this.hasAttribute('pagedswipe')) {
						this.pagedSwipe = newValue === 'true' ? true : false;
					}
					break;
				case 'scrolltotime':
					if (this.hasAttribute('scrolltotime')) {
						this.scrollToTime = Number(newValue);
					}
					break;

				case 'dir':
					if (this.hasAttribute('dir')) {
						this.direction = newValue;
					}
					break;
				case 'receivestatesize':
					if (this.hasAttribute('receivestatesize')) {
						this.receiveStateSize = newValue;
					} else {
						this.receiveStateSize = '';
					}
					break;
				case 'receivestatescrollto':
					if (this.hasAttribute('receivestatescrollto')) {
						this.receiveStateScrollTo = newValue;
					} else {
						this.receiveStateScrollTo = '';
					}

					break;
				case 'receivestatetemplatevars':
					if (this.hasAttribute('receivestatetemplatevars')) {
						this.receiveStateTemplateVars = newValue;
					} else {
						this.receiveStateTemplateVars = '';
					}
					break;
				default:
					super.attributeChangedCallback(attr, oldValue, newValue);
					break;

			}
		}
	}

	public getItemSize() {
		return this.isHorizontal ? this.itemOffsetWidth : this.itemOffsetHeight;
	}

	/**
	 * Get the number of items per page
	 *
	 * @return {number}
	 */
	public getItemsPerPage(): number {

		let numberOfItems = 0;

		if (this.isHorizontal) {
			numberOfItems = this.viewportClientWidth / this.itemOffsetWidth;
		} else {
			numberOfItems = this.viewportClientHeight / this.itemOffsetHeight;
		}

		return numberOfItems;
	}

	/**
	 * Useful for pagedSwipe functionality
	 * If an element is cut off at the end of the list
	 * will exclude that element from that page
	 *
	 * @return {number} amount of visible items per page
	 */
	public getVisibleItemsPerPage(): number {
		const itemsPerPage = this.getItemsPerPage();
		return Math.floor(itemsPerPage);
	}


	public _canUseBufferAmount(firstRenderVisibleItemsNr: number): boolean {
		const size: number = Number(this.size);
		return firstRenderVisibleItemsNr < size;
	}

	public getFirstRenderVisibleItemsNr(resetFirstRenderVisItemsNrCache: boolean = false): number {
		if (resetFirstRenderVisItemsNrCache) {
			this._cachedFirstRenderVisibleItemsNr = 0;
		}

		if (this._cachedFirstRenderVisibleItemsNr > 0) {
			// since this method is used in many places... do not recalculate first visible items each time
			// (recalculation will be made only when resizeList is executed)
			return this._cachedFirstRenderVisibleItemsNr;
		}

		const size: number = Number(this.size);
		const bAmount: number = Number(this.bufferAmount);
		if (bAmount === 0 || size <= bAmount) {
			this._cachedFirstRenderVisibleItemsNr = size;
		} else {
			this._cachedFirstRenderVisibleItemsNr = this._getFirstRenderedItemsNr(size);
		}
		return this._cachedFirstRenderVisibleItemsNr;
	}

	/**
	 *
	 * @param swipeType Swipe type can be backwards / next.
	 */
	public swipe(func: Promise<void>): void {

		/**
		 * Only process if no other pan operation is processing
		 */
		if (!this._processingPan) {

			/**
			 * Mark that we are currently processing a pan operation to prevent others to enter processing.
			 */
			this._processingPan = true;

			/**
			 * Process only if list has elements.
			 */
			if (this.divList.childElementCount > 0) {

				/**
				 * Call the function we received and catch any errors.
				 */
				func.then(() => {
					this._processingPan = false;
				}).catch((error) => {

					/**
					 * Mark as not processing.
					 */
					this._processingPan = false;

					/**
					 * Report this to the console with our custom function.
					 */
					this.error('Error while processing a swipe operation. More details: ', error);
				}).then(noop);
			}
		}
	}

	public static get observedAttributes() {
		const commonAttributes = Ch5Common.observedAttributes;
		const newObsAttrs: string[] = [];
		for (let i: number = 0; i < Ch5List.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5List.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				newObsAttrs.push(Ch5List.COMPONENT_PROPERTIES[i].name.toLowerCase());
			}
		}
		const listAttributes = [
			'selected',
			'disableanimation',
			'size',
			'orientation',
			'bufferamount',
			'itemheight',
			'itemwidth',
			'minwidth',
			'maxwidth',
			'minheight',
			'maxheight',
			'indexid',
			'pagedswipe',
			'endless',
			'scrolltotime',
			'direction',
			'receivestateshow',
			'receivestatesize',
			'receivestatescrollto',
			'receivestatetemplatevars',

		];

		return commonAttributes.concat(listAttributes);
	}


	public set currentXPosition(position: number) {
		if (isNil(position)) {
			return;
		}

		this._currentXPosition = position;
	}

	public get currentXPosition(): number {
		return this._currentXPosition;
	}

	public set currentYPosition(position: number) {
		if (isNil(position)) {
			return;
		}

		this._currentYPosition = position;
	}

	public get currentYPosition(): number {
		return this._currentYPosition;
	}

	/**
	 * Determines if the list is vertical
	 *
	 * @type {boolean}
	 *
	 * @memberof Ch5List
	 */
	public get isVertical(): boolean {
		return this.orientation === Ch5List.ORIENTATION[0];
	}

	/**
	 * Determines if the list is horizontal.
	 *
	 * @type {boolean}
	 *
	 * @memberof Ch5List
	 */
	public get isHorizontal(): boolean {
		return this.orientation === Ch5List.ORIENTATION[1];
	}

	public get size() {
		if (this._size === undefined) {
			this._size = 1;
		}
		return this._size;
	}

	public set size(value: number | null) {
		if (isNil(value)) {
			value = 1;
		}

		if (value > 1000) {
			value = 1000;
		}

		if (value !== this._size) {
			this._size = Number(value);
			this.setAttribute('size', this._size.toString());
		}
	}

	public get previousSize() {
		if (isNil(this._previousSize)) {
			this._previousSize = 1;
		}
		return this._previousSize;
	}

	public set previousSize(value: number | null) {
		if (isNil(value)) {
			value = 1;
		}

		if (value > 1000) {
			value = 1000;
		}

		this._previousSize = Number(value);
	}

	public get orientation() {
		if (this._orientation == null) {
			this._orientation = Ch5List.ORIENTATION[0];
		}
		return this._orientation;
	}

	public set orientation(value: TCh5ListElementOrientation | null) {
		if (isNil(value)) {
			value = Ch5List.ORIENTATION[0];
		}
		if (value === this._orientation) {
			return;
		}
		if (Ch5List.ORIENTATION.indexOf(value) >= 0) {
			this._orientation = value;
		} else {
			this._orientation = Ch5List.ORIENTATION[0];
		}
		this.setAttribute('orientation', this._orientation);
	}

	public get bufferAmount() {
		return this._bufferAmount;
	}

	public set bufferAmount(value: number | null) {
		if (isNil(value)) {
			value = 0;
		}
		if (value === this.bufferAmount) {
			return;
		}
		this._bufferAmount = Number(value);
		this.setAttribute('bufferamount', this._bufferAmount.toString());
	}

	public get itemHeight() {
		return this._itemHeight;
	}

	public set itemHeight(value: string | null) {
		value = this._checkAndSetStringValue(value);
		if (value === this._itemHeight) {
			return;
		}
		this._itemHeight = value;
		this.setAttribute('itemheight', value);
		this.templateHelper.attachCSS(); // update styles related to item
		this.templateHelper.checkAndSetSizes(); // needed to not break scroll functionality on resize
	}

	public get itemWidth() {

		return this._itemWidth;
	}

	public set itemWidth(value: string | null) {
		value = this._checkAndSetStringValue(value);
		if (value === this._itemWidth) {
			return;
		}
		this._itemWidth = value;
		this.setAttribute('itemwidth', value);
		this.templateHelper.attachCSS(); // update styles related to item
		this.templateHelper.checkAndSetSizes(); // needed to not break scroll functionality on resize
	}

	public get minWidth() {
		return this._minWidth;
	}

	public set minWidth(value: string | null) {
		value = this._checkAndSetStringValue(value);

		if (value === this._minWidth) {
			return;
		}

		this._minWidth = value;
		this.setAttribute('minwidth', this._minWidth);
		this.templateHelper.triggerResizeDueWidthAndHeightUpdates();
		this.templateHelper.resetListLayout();
	}

	public get maxWidth() {
		if (isNil(this._maxWidth)) {
			this._maxWidth = '';
		}

		return this._maxWidth;
	}

	public set maxWidth(value: string | null) {
		value = this._checkAndSetStringValue(value);

		if (value === this._maxWidth) {
			return;
		}

		this._maxWidth = value;
		this.setAttribute('maxwidth', this._maxWidth);
	}

	/**
	 * Check wether the list is left-to-right or right-to-left oriented
	 *
	 * @return {boolean} true if is ltr oriented, else false
	 */
	public isLtr(): boolean {
		if (this.isVertical) {
			return true;
		}
		return this.direction === Ch5Common.DIRECTION[0];
	}

	/**
	 * Using parent element, this method can retrive list max width from percentage value
	 * @param value
	 */
	private getMaxWidthInPxFromPercentage(): string {
		let _value: string = this.maxWidth as string;
		if (this.parentElement) {
			// obtain list width from parent element width and maxWidth percentage
			const listParentSizingDetails: ClientRect | DOMRect = this.parentElement.getBoundingClientRect();
			const sizePercentage: number = Ch5Common.extractMeasurementNumber(_value as string);
			_value = `${String(listParentSizingDetails.width * sizePercentage / 100)}px`;
		}
		return _value;
	}

	/**
	 * Using parent element, this method can retrive list max height from percentage value
	 * @param value
	 */
	private getMaxHeightInPxFromPercentage(): string {
		let _value: string = this.maxHeight as string;
		if (this.parentElement) {
			// obtain list height from parent element height and maxHeight percentage
			const listParentSizingDetails: ClientRect | DOMRect = this.parentElement.getBoundingClientRect();
			const sizePercentage: number = Ch5Common.extractMeasurementNumber(_value as string);
			_value = `${String(listParentSizingDetails.height * sizePercentage / 100)}px`;
		}
		return _value;
	}

	private calculatePxSize(value: string, percentageCallback: () => any): string {
		const measurementUnit: string = Ch5Common.getMeasurementUnitFromSizeValue(value);
		switch (measurementUnit) {
			case '%':
				if (typeof percentageCallback === 'function') {
					return percentageCallback();
				}
				break;
			case 'vw':
				const unitNr: number = Ch5Common.extractMeasurementNumber(value);
				return `${Ch5Common.convertVwUnitsToPx(unitNr)}px`;
		}
		return value;
	}

	public get minHeight() {
		if (isNil(this._minHeight)) {
			this._minHeight = '';
		}
		return this._minHeight;
	}

	public set minHeight(value: string | null) {
		value = this._checkAndSetStringValue(value);

		if (value === this._minHeight) {
			return;
		}

		this._minHeight = value;
		this.setAttribute('minheight', value);
		this.templateHelper.triggerResizeDueWidthAndHeightUpdates();
		this.templateHelper.resetListLayout();
	}

	public get maxHeight() {
		return this._maxHeight;
	}

	public set maxHeight(value: string | null) {
		value = this._checkAndSetStringValue(value);

		if (value === this._maxHeight) {
			return;
		}

		this._maxHeight = value;
		this.setAttribute('maxheight', value);
		this.templateHelper.triggerResizeDueWidthAndHeightUpdates();
		this.templateHelper.resetListLayout();
	}

	public get indexId() {
		if (isNil(this._indexId)) {
			this._indexId = "1";
		}
		return this._indexId;
	}

	public set indexId(value: string | null) {
		if (isNil(value)) {
			value = '1';
		}
		if (value === this._indexId) {
			return;
		}
		this._indexId = value;
		this.setAttribute('indexid', value);
	}

	/**
	 * Getter for the pagedSwipe flag.
	 *
	 * @type {number}
	 *
	 * @memberof Ch5List
	 */
	public get pagedSwipe() {
		if (this._pagedSwipe == null) {
			this._pagedSwipe = false;
		}
		return this._pagedSwipe;
	}

	/**
	 * Setter for pagedSwipe. When this is true, a swipe backwards/forwards will trigger a paginated scroll.
	 *
	 * @type {number}
	 *
	 * @memberof Ch5List
	 */
	public set pagedSwipe(value: boolean) {
		if (value == null) {
			value = false;
		}
		if (value === this._pagedSwipe) {
			return;
		}
		this._pagedSwipe = value;
		if (value === true) {
			this.setAttribute('pagedswipe', value.toString());
		} else {
			this.removeAttribute('pagedswipe');
		}
	}

	public set endless(value: boolean) {
		this._ch5Properties.set<boolean>("endless", value, () => {
			if (this.endless) {
				setTimeout(() => {
					this.templateHelper.removeScrollbar();
				}, 1);
			}
			this._updateInfiniteLoop();
			this._computeItemsPerViewLayout();
		});
	}
	public get endless(): boolean {
		return this._ch5Properties.get<boolean>("endless");
	}

	public set scrollbar(value: boolean) {
		this._ch5Properties.set<boolean>("scrollbar", value, () => {
			this.templateHelper.removeScrollbar();
			if (this.hasAttribute('scrollbar')) {
				if (!this.endless) {
					this.templateHelper.customScrollbar(this.divList);
				}
			}
		});
	}
	public get scrollbar(): boolean {
		return this._ch5Properties.get<boolean>("scrollbar");
	}

	public get scrollToTime() {
		if (this._scrollToTime == null) {
			return this._defaultScrollToTime;
		}

		return this._scrollToTime;
	}

	public set scrollToTime(value: number) {
		if (isNil(value)) {
			value = this._defaultScrollToTime;
		}
		if (value === this._scrollToTime) {
			return;
		}
		this._scrollToTime = value;
		this.setAttribute('scrolltotime', value.toString());
	}

	public get templateVars() {
		return this._templateVars;
	}

	public set templateVars(value: string | null) {
		this._templateVars = value;
	}

	public get direction() {
		return this._direction;
	}

	public set direction(value: string | null) {
		if (value == null) {
			value = "ltr";
		}
		if (Ch5Common.DIRECTION.indexOf(value) >= 0) {
			this._direction = value;
		}
		else {
			this._direction = Ch5Common.DIRECTION[0];
		}

	}

	public set isPointerActive(status: boolean) {

		if (
			this._isPointerActive === status ||
			(isNil(status))
		) {
			return;
		}

		this._isPointerActive = status;

	}

	public get isPointerActive(): boolean {
		return this._isPointerActive;
	}

	public set pointerId(id) {
		this._pointerId = id;
	}

	public get pointerId() {
		return this._pointerId;
	}

	public set decelerating(decelerate: boolean) {
		if (
			isNil(decelerate) ||
			this.decelerating === decelerate
		) {
			return;
		}

		this._decelerating = decelerate;
	}

	public get decelerating(): boolean {
		return this._decelerating;
	}

	public set decelVelocity(velocity: number) {
		if (
			isNil(velocity) ||
			this._decelVelocity === velocity
		) {
			return;
		}

		this._decelVelocity = velocity;
	}

	public get decelVelocity(): number {
		return this._decelVelocity;
	}

	// signals
	public get receiveStateSize(): string | null | undefined {
		// The internal property is changed if/when the element is removed from DOM
		// Returning the attribute instead of the internal property preserves functionality
		return this._attributeValueAsString('receivestatesize');
	}

	public set receiveStateSize(value: string | null | undefined) {
		if (this._receiveStateSize === value || isNil(value)) {
			return;
		}

		this._receiveStateSize = value;
		this.setAttribute('receivestatesize', value);

		const callback: SignalSubscriptionCallback = (newValue: string | number | boolean) => {
			const _newValue = newValue as number;
			if (_newValue !== null || _newValue !== undefined) {
				if (_newValue >= 0 && _newValue < 1001) {
					const previousItemsCount = this._items.length;

					// changes value from number to string by concatenating with empty string
					this.setAttribute('size', '' + _newValue);
					if (this.endless) {
						// the max offset should be calculated again when list is changing
						// its size. This is calculated on pointer down if the offset translate
						// is set to undefined
						this.animationHelper.maxOffsetTranslate = undefined;
						this.shouldUpdateListAndPosition(previousItemsCount);
					} else {
						// TODO: Investigate on RTL direction
						const bufferAmount = this.bufferAmount || 0;
						const maxOffsetTranslate = this.animationHelper.adjustMaxOffset(bufferAmount > 0);

						this.animationHelper.maxOffsetTranslate = maxOffsetTranslate;
						this.shouldUpdateListAndPosition(previousItemsCount);
					}
				}
				else if (_newValue > 1000) {

					this.info(`List size exceeded : ${_newValue} ; `)
				}
			}
		};

		this._receiveStateSizeSub = this.signalManager.subscribeToSignal<number>(
			0,
			this._receiveStateSize,
			this.receiveStateSizeSub,
			callback
		);

	}

	public getLayoutInfo() {

		if (!this.bufferAmount) {
			return this.sizeResolver;
		}

		const itemsPerPage = this.getItemsPerPage();
		const firstItemSize = this.getItemSize();
		const definedListSize = this.size || 0;
		const listSize = (definedListSize - itemsPerPage) * firstItemSize;

		return {
			hiddenListSize: listSize,
			fullListSize: definedListSize * firstItemSize,
			viewPortSize: this.sizeResolver.viewPortSize,

		} as Ch5ListSizeResolver

	}

	public get receiveStateScrollTo(): string | null | undefined {
		// The internal property is changed if/when the element is removed from DOM
		// Returning the attribute instead of the internal property preserves functionality
		return this._attributeValueAsString('receivestatescrollto');
	}

	public set receiveStateScrollTo(value: string | null | undefined) {
		if (this._receiveStateScrollTo === value || isNil(value)) {
			return;
		}
		this._receiveStateScrollTo = value;
		this.setAttribute('receivestatescrollto', value);
		// this.setScrollToContent();
	}

	private setScrollToContent() {
		setTimeout(() => {
			const callback: SignalSubscriptionCallback = (newValue: string | number | boolean) => {
				const _newValue = newValue as number;
				this.info("SignalSubscriptionCallback value is ", _newValue);
				if (_newValue !== null || _newValue !== undefined) {
					const bufferAmount = this.bufferAmount || 0;
					const maxOffsetTranslate = this.animationHelper.adjustMaxOffset(bufferAmount > 0);
					this.animationHelper.maxOffsetTranslate = maxOffsetTranslate;
					this.animationHelper.signalScrollTo(_newValue as number);
					this.receiveStateScrollToChanged = true;
				}
			};
			this._receiveStateScrollToSub = this.signalManager.subscribeToSignal<number>(
				0,
				this.receiveStateScrollTo as string,
				this.receiveStateScrollToSub as string,
				callback
			);
		}, 100);

	}
	public get receiveStateTemplateVars(): string | null | undefined {
		// The internal property is changed if/when the element is removed from DOM
		// Returning the attribute instead of the internal property preserves functionality
		return this._attributeValueAsString('receivestatetemplatevars');
	}

	public set receiveStateTemplateVars(value: string | null | undefined) {

		if (this._receiveStateTemplateVars === value || isNil(value)) {
			return;
		}

		this._receiveStateTemplateVars = value;
		this.setAttribute('receivestatetemplatevars', value);

		const subscriptionCallback: SignalSubscriptionCallback = (newValue: string | number | boolean) => {
			const _newValue = newValue as string;
			if (!isNil(_newValue)) {
				this.templateVars = _newValue;
				this.templateHelper.resizeList(this.divList, this.templateVars);
			}
		};

		this._receiveStateTemplateVarsSub = this.signalManager.subscribeToSignal<string>(
			'',
			this.receiveStateTemplateVars as string,
			this.receiveStateTemplateVarsSub as string,
			subscriptionCallback
		);
	}

	public get receiveStateSizeSub(): string {
		return this._receiveStateSizeSub;
	}

	public set receiveStateSizeSub(subscription: string) {
		this._receiveStateSizeSub = subscription;
	}

	public get receiveStateScrollToSub(): string {
		return this._receiveStateScrollToSub;
	}

	public set receiveStateScrollToSub(subscription: string) {
		this._receiveStateScrollToSub = subscription;
	}

	public get receiveStateTemplateVarsSub(): string {
		return this._receiveStateTemplateVarsSub;
	}

	public set receiveStateTemplateVarsSub(subscription: string) {
		this._receiveStateTemplateVarsSub = subscription;
	}

	/**
	 * The 0-based index of the selected item. defaults to zero
	 */
	public get selected() {
		const value = this.getAttribute('selected');
		return isNil(value) ? 0 : parseInt(value, 10);
	}

	public set selected(index: number) {
		this.setAttribute('selected', index.toString());
	}

	public set disableAnimation(value) {
		value = Boolean(value);
		if (value) {
			this.setAttribute('disableAnimation', '');
		}
		else {
			this.removeAttribute('disableAnimation');
		}
	}

	public get disableAnimation() {
		return this.hasAttribute('disableAnimation');
	}

	public get appendPosition() {
		return this._appendPosition;
	}

	public set appendPosition(position: number) {
		if (
			isNil(position) ||
			this._appendPosition === position
		) {
			return;
		}

		this._appendPosition = position;
	}

	public set pointerFirstX(pointer: number) {
		if (
			isNil(pointer) ||
			this.pointerFirstX === pointer
		) {
			return;
		}

		this._pointerFirstX = pointer;
	}

	public get pointerFirstX(): number {
		return this._pointerFirstX;
	}

	public set pointerLastX(pointer: number) {
		if (
			isNil(pointer) ||
			this._pointerLastX === pointer
		) {
			return;
		}

		this._pointerLastX = pointer;
	}

	public get pointerLastX(): number {
		return this._pointerLastX
	}

	public set pointerCurrentX(pointer: number) {
		if (
			isNil(pointer) ||
			this._pointerCurrentX === pointer
		) {
			return;
		}

		this._pointerCurrentX = pointer;
	}

	public get pointerCurrentX(): number {
		return this._pointerCurrentX;
	}

	public set pointerCurrentY(pointer: number) {
		if (isNil(pointer) || this._pointerCurrentY === pointer) {
			return;
		}

		this._pointerCurrentY = pointer;
	}

	public get pointerCurrentY(): number {
		return this._pointerCurrentY;
	}

	public set pointerFirstY(pointer: number) {
		if (
			isNil(pointer) ||
			this._pointerFirstY === pointer
		) {
			return;
		}

		this._pointerFirstY = pointer;
	}

	public get pointerFirstY(): number {
		return this._pointerFirstY;
	}

	public set pointerLastY(pointer: number) {
		if (
			isNil(pointer) ||
			this._pointerLastY === pointer
		) {
			return;
		}

		this._pointerLastY = pointer;
	}

	public get pointerLastY(): number {
		return this._pointerLastY;
	}

	public set lastDraggedLayoutIndex(index: number) {

		if (
			isNil(index) ||
			this._lastDraggedLayoutIndex === index
		) {
			return;
		}

		this._lastDraggedLayoutIndex = index;
	}

	public get lastDraggedLayoutIndex(): number {
		return this._lastDraggedLayoutIndex;
	}

	public set trackingPointsX(points: any[]) {

		if (isNil(points)) {
			return;
		}

		this._trackingPointsX = points;
	}

	public get trackingPointsX(): any[] {
		return this._trackingPointsX;
	}

	public set trackingPointsY(points: any[]) {
		if (isNil(points)) {
			return;
		}

		this._trackingPointsY = points;
	}

	public get trackingPointsY(): any[] {
		return this._trackingPointsY;
	}

	public set items(items: ICh5ListItemInfo[]) {

		if (isNil(items)) {
			return;
		}

		this._items = items;
	}

	public get items(): ICh5ListItemInfo[] {
		return this._items;
	}

	public set selectedIteration(iterationNumber: number) {
		if (
			isNil(iterationNumber) ||
			this._selectedIteration === iterationNumber
		) {
			return;
		}

		this._selectedIteration = iterationNumber;
	}

	public get selectedIteration(): number {
		return this._selectedIteration;
	}

	public set wrapperTranslateX(value) {
		if (
			isNil(value) ||
			this._wrapperTranslateX === value
		) {
			return;
		}

		this._wrapperTranslateX = value;
	}

	public get wrapperTranslateX() {
		return this._wrapperTranslateX;
	}

	public set wrapperTranslateY(value: number) {
		if (
			isNil(value) ||
			this._wrapperTranslateY === value
		) {
			return;
		}

		this._wrapperTranslateY = value;
	}

	public get wrapperTranslateY() {
		return this._wrapperTranslateY;
	}

	public set minDecelVelocity(value: number) {
		if (
			isNil(value) ||
			this._minDecelVelocity === value
		) {
			return;
		}

		this._minDecelVelocity = value;
	}

	public get minDecelVelocity() {
		return this._minDecelVelocity;
	}

	public set maxDecelVelocity(value: number) {
		if (
			isNil(value) ||
			this._maxDecelVelocity === value
		) {
			return;
		}

		this._maxDecelVelocity = value;
	}


	public set divListWidth(value: number) {
		if (
			isNil(value) ||
			this._divListWidth === value
		) {
			return;
		}

		this._divListWidth = value;
	}

	public get divListWidth() {
		return this._divListWidth;
	}

	public set divListHeight(value: number) {
		if (
			isNil(value) ||
			this._divListHeight === value
		) {
			return;
		}

		this._divListHeight = value;
	}

	public get divListHeight() {
		return this._divListHeight;
	}

	public set lastViewIndex(index: number) {
		if (isNil(index) || this._lastViewIndex === index) {
			return;
		}

		this._lastViewIndex = index;
	}

	public get lastViewIndex() {
		return this._lastViewIndex;
	}

	public set attraction(value: number) {
		if (isNil(value) || this._lastViewIndex === value) {
			return;
		}

		this._attraction = value;
	}

	public get attraction() {
		return this._attraction;
	}

	public set friction(value: number) {
		if (isNil(value) || this._lastViewIndex === value) {
			return;
		}

		this._friction = value;
	}

	public get friction(): number {
		return this._friction;
	}

	public set dragTicking(tick: boolean) {
		if (
			isNil(tick) ||
			this._dragTicking === tick
		) {
			return;
		}

		this._dragTicking = tick;
	}

	public get dragTicking(): boolean {
		return this._dragTicking;
	}

	public set infiniteLoop(loop: boolean) {
		if (
			isNil(loop) ||
			this._infiniteLoop === loop
		) {
			return;
		}

		this._infiniteLoop = loop;
	}

	public get infiniteLoop(): boolean {
		return this._infiniteLoop;
	}

	public set bufferedItems(bufferedItems: ICh5ListBufferedItems) {
		if (
			isNil(bufferedItems) ||
			this._bufferedItems === bufferedItems
		) {
			return;
		}

		this._bufferedItems = bufferedItems;
	}

	public get bufferedItems(): ICh5ListBufferedItems {
		return this._bufferedItems;
	}

	public set scrollToTimeReference(ref: number) {
		if (
			isNil(ref) ||
			this._scrollToTimeReference === ref
		) {
			return;
		}

		this._scrollToTimeReference = ref;
	}

	public get scrollToTimeReference(): number {
		return this._scrollToTimeReference;
	}

	public set storedOffsetWidth(width: number) {
		if (isNil(width)) {
			return;
		}

		this._storedOffsetWidth = width;
	}

	public get storedOffsetWidth(): number {
		return this._storedOffsetWidth;
	}

	public set storedOffsetHeight(height: number) {
		if (isNil(height)) {
			return;
		}

		this._storedOffsetHeight = height;
	}

	public get storedOffsetHeight(): number {
		return this._storedOffsetHeight;
	}

	/**
	 * Selects the item preceding the currently selected one.
	 * If the currently selected item is the first item and the loop
	 * functionality is disabled, nothing happens.
	 */
	public previousViewChild() {
		this.selected = this.computePrevious(this.selected);
	}

	/**
	 * Selects the item following the currently selected one.
	 * If the currently selected item is the last item and the loop
	 * functionality is disabled, nothing happens.
	 */
	public nextViewChild() {
		this.selected = this.computeNext(this.selected);
	}

	public onResizeList() {

		this._items = this._getItems();

		// Getting the value of _lastViewIndex before calling internalUpdate(),
		// as _internalUpdate() will update its value.
		// This is done to avoid a locking situation, e.g. when the ch5-list is
		// initialised, selected wouldn't be assigned because of _lastViewIndex
		// still being -1. When we parse the items from the list, we can compute
		// _lastViewIndex, and then we can force an update on selected.
		const shouldForceSelectedUpdate = this._items.length === 0 && this._lastViewIndex === -1;

		// Calling internalUpdate instead of update, to avoid race conditions
		// (update is debounced). This is because the number of items is
		// essential for computing the remaining internal values.
		this._internalUpdate();

		// See a few lines above.
		if (shouldForceSelectedUpdate) {
			this.selected = this.selected;
		}
	}

	/**
	 * Extracts the item's data index (i.e. between 0 and this._items.lenght -1)
	 * from its layoutIndex.
	 * @param {number} layoutIndex The item's layoutIndex
	 * @return {number} The item's data index.
	 * @private
	 */
	public getItemDataIndexFromLayoutIndex(layoutIndex: number): number {
		let positiveLayoutIndex = layoutIndex;
		while (positiveLayoutIndex < 0) {
			positiveLayoutIndex += this._items.length;
		}
		return positiveLayoutIndex % this._items.length;
	}

	/**
	 * Computes the next index.
	 * @param {number} i The index of reference used to compure the next.
	 * @return {number} The next index with respect to the input.
	 */
	public computeNext(i: number) {
		let nextItemIndex = i;

		// Wrap around is true only if loop is true.
		if (i < this._lastViewIndex) {
			nextItemIndex = i + 1;
		} else if (this.endless) {
			if (this._infiniteLoop) {
				this._selectedIteration += 1;
			}

			nextItemIndex = 0;
		}

		return clamp(nextItemIndex, 0, this._lastViewIndex);
	}

	/**
	 * Computes the previous index.
	 * @param {number} i The index of reference used to compure the previous.
	 * @return {number} The previous index with respect to the input.
	 */
	public computePrevious(i: number) {
		let previousItemIndex = i;

		// Wrap around is true only if loop is true.
		if (i > 0) {
			previousItemIndex = i - 1;
		} else if (this.endless) {
			if (this._infiniteLoop) {
				this._selectedIteration -= 1;
			}

			previousItemIndex = this._lastViewIndex;
		}

		return clamp(previousItemIndex, 0, this._lastViewIndex);
	}

	/**
	 * "Forces" an update by sliding the current view in
	 */
	public update() {
		// Debouncing update.
		clearTimeout(this._updateTimer as number);
		this._updateTimer = window.setTimeout(() => {
			this._internalUpdate();
		}, 50) as number;
	}

	protected handleShow(targetElement: HTMLElement) {
		super.handleShow(targetElement);
		this.templateHelper.resizeList(this.divList, this.templateVars);
	}

	/**
	 * Check wether pagedSwipe is compatible with the list definition or not.
	 * For example a list that has 8 elements within and 6 of them are visible,
	 * in this case the list is not pagedSwipe compatible.
	 *
	 * A compatible pagedSwipe list definition would be a list with at least
	 * two pages.
	 *
	 * @param {boolean} pagedSwipe
	 * @return {boolean} true - if the list is pagedSwipe compatible, otherwise false
	 */
	private isPagedSwipeCompatible(pagedSwipe: boolean): boolean {
		if (!pagedSwipe) {
			return true;
		}

		const listSize = this.size || 0;
		const numberOfItemsPerPage = this.sizeResolver.getItemsPerPage();
		const amountOfHiddenListItems = listSize - numberOfItemsPerPage;

		if (numberOfItemsPerPage > amountOfHiddenListItems) {
			this.invokePropIncompatibility('pagedSwipe');
			return false;
		}

		return true;
	}

	/**
	 * Invoke an incompatibility warning when an attribute cannot work as
	 * expected because of the component definition.
	 *
	 * A good example in this case is `pagedSwipe` attribute which cannot work
	 * properly when the list size doesn't correspond to at least two pages.
	 *
	 * @param {string} attribute the attribute name to invoke incompatibility
	 */
	protected invokePropIncompatibility(attribute: string): void {
		switch (attribute) {
			case 'pagedSwipe':
				console.warn(this.definePropIncompatibilityInfo(
					attribute,
					[
						'size',
						'endless'
					]
				));
				break;
		}
	}

	/**
	 * Defines the information to be logged on
	 *
	 * @param {string} attribute
	 * @param {string[]} reasons
	 */
	private definePropIncompatibilityInfo(attribute: string, reasons: string[]): string {
		const reasonsList = reasons.join(',');
		return `For element #${this.id} - ${attribute} doesn't work as expected. See(${reasonsList})`;
	}

	private _getCssBiggestSizeValue(maxSize: string, actualValue: number): number {
		let s: number = actualValue;
		if (maxSize) {
			const max: number = Ch5Common.getMeasurementPxNumber(maxSize as string);
			if (s < max) {
				s = max;
			}
		}
		return s;
	}

	/**
	 * Check if a change in the total number of list items should be handled
	 */
	private shouldUpdateListAndPosition(previousItemsCount: number): void {
		this._items = this._getItems();
		// list total items have decreased
		if (this._items.length < previousItemsCount) {
			if (this.isVertical) {
				this.resetListAndPosition();
			} else if (this.isHorizontal) {
				this.resetListAndPosition();
			}
		}
		// in endless mode, stop animation, fixes an edge case if the user is scrolling while the size changes
		// where the size is not computed correctly during the animation
		else if (this.endless) {
			this.animationHelper.stop();
		}
		// list items have increased, handle RTL
		else if (this._items.length > previousItemsCount && this.direction === Ch5Common.DIRECTION[1]) {
			this.resetListAndPosition();
		}
	}

	/**
	 * Force list re-size, cancel current animation, go back to the beginning of the list
	 */
	private resetListAndPosition() {
		this.animationHelper.stop();
		this.currentXPosition = 0;
		this.currentYPosition = 0;
		this.templateHelper.resizeList(this.divList, this.templateVars);
	}

	private _getFirstRenderedItemsNr(size: number): number {
		const divListSizingDetails: ClientRect | DOMRect = this.divList.getBoundingClientRect();
		const firstItemSizingDetails: ClientRect | DOMRect = this.getFirstItemSizingDetails();

		let itemsToShowNrOnFirstRender: number = 0;

		if (this.orientation === Ch5List.ORIENTATION[0]) {
			// vertical list => use height
			// if list height is smaller than maxHeight, use maxHeight
			const _maxHeight = this.calculatePxSize(this.maxHeight as string,
				this.getMaxHeightInPxFromPercentage.bind(this));
			const listH: number = this._getCssBiggestSizeValue(_maxHeight, divListSizingDetails.height);
			const itemH: number = Math.max(this.itemOffsetHeight, firstItemSizingDetails.height);
			itemsToShowNrOnFirstRender = Math.ceil(listH / itemH);
		} else {
			// horizontal list => use width
			// if list width is smaller than maxWidth, use maxWidth
			const _maxWidth = this.calculatePxSize(this.maxWidth as string,
				this.getMaxWidthInPxFromPercentage.bind(this));
			const listW: number = this._getCssBiggestSizeValue(_maxWidth as string, divListSizingDetails.width);
			const itemW: number = Math.max(this.itemOffsetWidth, firstItemSizingDetails.width);
			itemsToShowNrOnFirstRender = Math.ceil(listW / itemW);
		}
		// double the number of items rendered first time to make sure scroll is set
		itemsToShowNrOnFirstRender = itemsToShowNrOnFirstRender * 2;

		// ensure that calculated number of first items rendered doesn't exceed list size
		itemsToShowNrOnFirstRender = itemsToShowNrOnFirstRender <= size ? itemsToShowNrOnFirstRender : size;
		return itemsToShowNrOnFirstRender;
	}

	public getFirstItemSizingDetails(): ClientRect | DOMRect {
		const firstItem = this.divList.children[0] as HTMLElement;
		// TODO: Monitor and improve if is needed
		return firstItem.getBoundingClientRect();
	}

	public setCurrentPosition(position: number) {
		if (this.isHorizontal) {
			this.currentXPosition = position;
			return;
		}

		this.currentYPosition = position;
	}

	private _startReadyObserver() {
		const templateNodeName: string = 'template';
		const observer = new MutationObserver((mutations) => {
			this.info('mutationObserver Callback');
			mutations.forEach((mutation) => {
				this.info('mutation', mutation);
				if ((mutation.type !== 'childList') || !mutation.addedNodes) {
					return;
				}

				if (mutation.addedNodes.length > 0) {
					let templateElement: any | null = null;
					// tslint:disable-next-line:prefer-for-of
					for (let i = 0; i < mutation.addedNodes.length; i++) {
						if (mutation.addedNodes[i].nodeName.toLowerCase() === templateNodeName) {
							templateElement = mutation.addedNodes[i];
							break;
						}
					}

					if (null !== templateElement) {
						this.info('templateElement innerhtml', templateElement.innerHTML);

						let tplHtml = templateElement.innerHTML;
						if (tplHtml.trim() === '') {
							// Normally this should be taken from template.contents but angular appears to change the template element
							// see https://github.com/angular/angular/issues/15557
							tplHtml = templateElement.firstElementChild.outerHTML;
							this._tplHtmlString = tplHtml;
							this.initializations();
							// disconnect observer
							observer.disconnect();
							templateElement.remove(); // remove the template element from DOM
						}
					}
				}
			});
		});

		observer.observe(this, {
			childList: true
			, subtree: false
			, attributes: false
			, characterData: false
		});
	}

	// /**
	//  * Wrapper function over Ch5ListLog log.
	//  *
	//  * @param message Message to show to the console.
	//  * @param optionalParameters Optional format parameters
	//  *
	//  * @type {void}
	//  * @memberof Ch5List
	//  */
	// private log(message: any, ...optionalParameters: any[]): void {
	//     Ch5ListLog.info(Ch5List.DEBUG, message, optionalParameters);
	// }

	// /**
	//  * Wrapper function over Ch5ListLog error.
	//  *
	//  * @param message Message to show to the console.
	//  * @param optionalParameters Optional format parameters
	//  *
	//  * @type {void}
	//  * @memberof Ch5List
	//  */
	// private error_Remove(message: any, ...optionalParameters: any[]): void {
	//     Ch5ListLog.error(Ch5List.DEBUG, message, optionalParameters);
	// }

	// ===========================================================================
	// Endless
	// ===========================================================================

	/**
	 * Gets the elements in the this.divList.children
	 * @returns {Array<ICh5ListItemInfo>} Info about the items found in this.divList.children
	 * @private
	 */
	private _getItems(): ICh5ListItemInfo[] {
		const items = Array.from(this.divList.children);

		return items.map((element, index) => ({
			element: element as HTMLElement,
			layoutIndex: index,
			translateX: 0,
			translateY: 0
		})) || [];
	};

	private _internalUpdate(): void {
		this._updateInfiniteLoop();
		this._computeItemsPerViewLayout();
		this.templateHelper.checkAndSetSizes(); // needed to not break scroll functionality on resize

	}

	/**
	 * Decides whether to wrapAround or not based on the number of views.
	 * @private
	 */
	private _updateInfiniteLoop(): void {
		// this._computeLastViewIndex() > 1 means that there are at least 2 items
		// more than the number of items in view. 2 extra items are need in
		// order to successfully shift the items and simulate an infinite loop.
		this._infiniteLoop = this.endless && this._computeLastViewIndex() > 1;
	}

	/**
	 * Updates the internal CSS used to lay out the items.
	 * @private
	 */
	private _computeItemsPerViewLayout(): void {
		// Used to compute the items's width.

		// Recompute the index of the last view (aka max value for `selected`).
		this._lastViewIndex = this._infiniteLoop ? this._items.length - 1 :
			this._computeLastViewIndex();
		// TODO: check if the wrapAround check makes sense. The idea is to not force
		// a new value for selected in case the list is wrapping around. But
		// probably we need to recompute item positions and translate to them
		if (!this._infiniteLoop && this.selected > this._lastViewIndex) {
			this.selected = this._lastViewIndex;
		}
	}

	/**
	 * Computes how many views there could be if the list didn't wrap around.
	 * @return {number} The index of the last view.
	 * @private
	 */
	private _computeLastViewIndex(): number {
		return Math.max(0, this._items.length - this.getItemsPerPage());
	}

	/**
	 *  Called to initialize all attributes
	 */
	private initializeAttributes() {
		this.info('initializeAttributes()');
		super.initAttributes();
		const thisRef: any = this;
		for (let i: number = 0; i < Ch5List.COMPONENT_PROPERTIES.length; i++) {
			if (Ch5List.COMPONENT_PROPERTIES[i].isObservableProperty === true) {
				if (this.hasAttribute(Ch5List.COMPONENT_PROPERTIES[i].name.toLowerCase())) {
					const key = Ch5List.COMPONENT_PROPERTIES[i].name;
					thisRef[key] = this.getAttribute(key);
				}
			}
		}
		if (this.hasAttribute('size')) {
			this.size = this.previousSize = Number(this.getAttribute('size'));
		} else {
			this.size = this.previousSize = 1;
		}
		if (this.hasAttribute('orientation')) {
			this.orientation = this.getAttribute('orientation') as TCh5ListElementOrientation;
		} else {
			this.orientation = Ch5List.ORIENTATION[0];
		}
		if (this.hasAttribute('bufferamount')) {
			this.bufferAmount = Number(this.getAttribute('bufferamount'));
		}
		if (this.hasAttribute('itemheight')) {
			this.itemHeight = this.getAttribute('itemheight');
		}
		if (this.hasAttribute('itemwidth')) {
			this.itemWidth = this.getAttribute('itemwidth');
		}
		if (this.hasAttribute('minwidth')) {
			this.minWidth = this.getAttribute('minwidth');
		}
		if (this.hasAttribute('maxwidth')) {
			this.maxWidth = this.getAttribute('maxwidth');
		}
		if (this.hasAttribute('minheight')) {
			this.minHeight = this.getAttribute('minheight');
		}
		if (this.hasAttribute('maxheight')) {
			this.maxHeight = this.getAttribute('maxheight');
		}
		if (this.hasAttribute('indexid')) {
			this.indexId = this.getAttribute('indexid');
		}
		if (this.hasAttribute('pagedswipe')) {
			this.pagedSwipe = this.toBoolean(this.getAttribute('pagedswipe'));
		}
		if (this.hasAttribute('endless')) {
			this.endless = this.toBoolean(this.getAttribute('endless'));
		} else {
			this.endless = false;
		}
		if (this.hasAttribute('scrolltotime')) {
			this.scrollToTime = Number(this.getAttribute('scrolltotime'));
		} else {
			this.scrollToTime = 500;
		}
		if (this.hasAttribute('dir')) {
			this.direction = this.getAttribute('dir');
		}
		if (this.hasAttribute('receivestatesize')) {
			this.receiveStateSize = this.getAttribute('receivestatesize') as string;
		}
		if (this.hasAttribute('receivestatescrollto')) {
			this.receiveStateScrollTo = this.getAttribute('receivestatescrollto') as string;
		}
		if (this.hasAttribute('receivestatetemplatevars')) {
			this.receiveStateTemplateVars = this.getAttribute('receivestatetemplatevars') as string;
		}

		this.info("Ch5 list initialized");
	}

	/**
	 * Handle the resize event for keypad to be redrawn if required
	 */
	private onWindowResizeHandler() {
		if (this.endless) {
			setTimeout(() => {
				this.templateHelper.removeScrollbar();
			}, 1);
		}
	}

	/**
	 * Called to bind proper listeners
	 */
	private initializeEvents() {
		super.attachEventListeners();
		this.eventManager.initializeEvents(this.divList);
		window.addEventListener('resize', this.onWindowResizeHandler.bind(this));

		this.info("Ch5 list - events");
	}

	/**
	 * Removes listeners
	 */
	private removeEvents() {
		super.removeEventListeners();
		this.eventManager.removeEvents(this.divList);

		window.removeEventListener('resize', this.onWindowResizeHandler.bind(this));
	}
}

Ch5List.registerCustomElement();
Ch5List.registerSignalAttributeTypes();
Ch5List.registerSignalAttributeDefaults();
