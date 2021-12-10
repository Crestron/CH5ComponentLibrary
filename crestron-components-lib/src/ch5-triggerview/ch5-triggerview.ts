// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { intSetter, intGetter, booleanGetter, booleanSetter } from './utils';

import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5Signal, Ch5SignalFactory, subscribeInViewPortChange } from "../ch5-core";
import { Ch5TriggerViewChild } from "./ch5-triggerview-child";
import { Ch5TriggerViewSlidesManager } from "./ch5-triggerview-slides-manager";
import { isNil } from 'lodash';
import { Ch5RoleAttributeMapping } from "../utility-models";
import { ICh5TriggerViewAttributes } from './interfaces/i-ch5-triggerview-attributes';
import { Ch5SignalElementAttributeRegistryEntries } from '../ch5-common/ch5-signal-attribute-registry';

export type TActiveViewCallback = () => {};

const SPEED_BETWEEN_PAGES = 300;

const triggerViewHtml = `
  <slot id="slidesSlot">
    <p class="slidesFallback">No content available</p>
  </slot>
  <div id="aria-live">
    <slot id="ariaSlot" name="ariaSlot"></slot>
  </div>`;

const triggerViewStyles = `
/*******************************************************************************
 Host and CSS properties
*******************************************************************************/

:host {
    position: relative;

    display: flex;
    flex-direction: column;
    align-items: stretch;

    contain: content;

    -webkit-tap-highlight-color: rgba(0,0,0,0);

    --ch5-triggerview-gap: 16px;

    --ch5-triggerview-background-color: transparent;

    --ch5-triggerview-slide-min-height: 0px;
    --ch5-triggerview-slide-max-height: none;

    --ch5-triggerview-transition-duration: 0.6s;
    --ch5-triggerview-transition-timing-function: ease-in-out;

    --ch5-triggerview-fallback-message-color-background: #fff;

    --ch5-triggerview__internal__slides-per-view: 1;
    
    overflow: hidden;
}

:host([hidden]) {
    display: none
}

/*******************************************************************************
Slides wrapper: flexbox container, is the transitioning element when moving the slides.
*******************************************************************************/
#slidesWrapper {
    display: flex;
    align-items: stretch;

    height: 100%;
    min-height: var(--ch5-triggerview-slide-min-height);
    max-height: var(--ch5-triggerview-slide-max-height);

    will-change: transform;
}

:host([transitioning]) #slidesWrapper {
    transition-property: transform;
    transition-duration: var(--ch5-triggerview-transition-duration);
    transition-timing-function: var(--ch5-triggerview-transition-timing-function);
}

/*******************************************************************************
Slides: width is calculated with a css formula
*******************************************************************************/
#slidesWrapper ::slotted(*) {
    flex-grow: 0;
    flex-shrink: 0;
    /* (100% - gap * (slidesPerView - 1)) / slidesPerView */
    flex-basis: calc((100% - (var(--ch5-triggerview__internal__slides-per-view) - 1) *
        var(--ch5-triggerview-gap)) / var(--ch5-triggerview__internal__slides-per-view));

    min-height: var(--ch5-triggerview-slide-min-height);
    max-height: var(--ch5-triggerview-slide-max-height);

    margin-right: var(--ch5-triggerview-gap);

    /*
        * Enforces the slides to keep their size even if the content requires
        * a bigger slide size.
        */
    overflow: hidden;

    outline: 0;

    user-select: auto;
}

.slidesFallback {
    display: flex;
    align-items: center;
    justify-content: center;

    margin: 0;
    padding: .5em 1em;

    width: 100%;

    background-color: var(--ch5-triggerview-fallback-message-color-background);
}

:host([gestureable=true]) #slidesWrapper ::slotted(*) {
    user-select: none;
}

/*******************************************************************************
  aria-live styles
*******************************************************************************/
#aria-live ::slotted(*) {
    position: absolute;
    height: 1px;
    width: 1px;
    margin: -1px;
    padding: 0;
    clip: rect(0 0 0 0);
    overflow: hidden;
    border: 0;
}

/*******************************************************************************
 * Print styles:
 * - Show all slides and stack them vertically
 * - Eliminate the slide gap, show an outline
 * - make sure the page doesn't break a slide in half
 *******************************************************************************/

@media print {
    #slidesWrapper ::slotted(*) {
        margin-right: 0;
        margin-bottom: .2em;
        outline: 1px solid #000;
        color: #000;
        page-break-inside: avoid;
    }

    /* Stack the slides */
    #slidesWrapper {
        display: block;
        transform: none !important;
        transition: 0s;
    }
}
`;

/**
 * Markup and styles.
 */
const template = document.createElement('template');
template.innerHTML = `<style>${triggerViewStyles}</style> ${triggerViewHtml}`;

export class Ch5TriggerView extends Ch5Common implements ICh5TriggerViewAttributes {

	public static readonly SIGNAL_ATTRIBUTE_TYPES: Ch5SignalElementAttributeRegistryEntries = {
		...Ch5Common.SIGNAL_ATTRIBUTE_TYPES,
		receivestateshowchildindex: { direction: "state", numericJoin: 1, contractName: true },
		sendeventshowchildindex: { direction: "event", booleanJoin: 1, contractName: true }
	};

	/**
	 * CSS classes
	 */
	public primaryCssClass = 'ch5-triggerview';
	public cssClassPrefix = 'ch5-triggerview';

	/**
	 * COMPONENT PUBLIC ATTRIBUTES
	 * - activeView - 1-based index of current view
	 * - endless
	 * - gestureable
	 * - disableAnimation
	 */

	/**
	 * Invoked on each activeView attribute change
	 */
	private _activeViewCallback: TActiveViewCallback = {} as TActiveViewCallback;

	// swipe sensitivity
	private _swipeThreshold = 30.0;

	private _activeView: number = 0;

	/**
	 * The slot where the slides are injected into.
	 * @type {HTMLSlotElement|null}
	 * @private
	 */
	private _slidesSlot: HTMLSlotElement;

	/**
	 * The slot where the aria-live element is injected into.
	 * @type {HTMLSlotElement}
	 * @private
	 */
	private _ariaSlot: HTMLSlotElement;

	private _ariaLiveRegion: HTMLElement = {} as HTMLElement;

	/**
	 * COMPONENT SEND SIGNALS
	 *
	 * - sendEventShowChildIndex
	 */

	/**
	 *
	 * The name of the number signal that will be sent to native of current visible item on select
	 *
	 * HTML attribute name: sendEventShowChildIndex or sendeventshowchildindex
	 * @private
	 * @type {string}
	 */
	private _sendEventShowChildIndexSigName: string = '';

	/**
	 * COMPONENT RECEIVE SIGNALS
	 *
	 * - receiveStateShowChildIndex
	 */

	/**
	 * The name of a number signal that will be applied to the activeView
	 *
	 * HTML attribute name: receiveStateShowChildIndex or receivestateshowchildIndex
	 */
	private _receiveStateShowChildIndexSigName: string = '';

	/**
	 * The subscription id for the receiveStateValue signal
	 */
	private _subReceiveStateShowChildIndexId: string = '';

	private _signalIsReceived: boolean = false;

	private slidesManager: Ch5TriggerViewSlidesManager = {} as Ch5TriggerViewSlidesManager;

	private _nested: boolean = false;

	/**
	 * Creates a new instance of Ch5TriggerView.
	 * @constructor
	 */
	constructor() {
		/*
		* Runs anytime a new instance is created (in HTML or JS).
		* The constructor is a good place to create shadow DOM, though you should
		* avoid touching any attributes or light DOM children as they may not
		* be available yet.
		*/
		super();

		this.info('Ch5TriggerView.constructor()');

		this._listOfAllPossibleComponentCssClasses = this.generateListOfAllPossibleComponentCssClasses();

		this.attachShadow({ mode: 'open' });
		(this.shadowRoot as ShadowRoot).appendChild(template.content.cloneNode(true));

		this._slidesSlot = (this.shadowRoot as ShadowRoot).querySelector('#slidesSlot') as HTMLSlotElement;
		this._ariaSlot = (this.shadowRoot as ShadowRoot).querySelector('#ariaSlot') as HTMLSlotElement;

		this.slidesManager = new Ch5TriggerViewSlidesManager(this);
	}

	/**
	 * Fires when the element is inserted into the DOM.
	 * It's a good place to set the initial `role`, `tabindex`, internal state,
	 * and install event listeners.
	 */
	public connectedCallback() {
		const setup = () => {
			this.info('Ch5TriggerView.connectedCallback()');

			// WAI-ARIA Attributes
			if (!this.hasAttribute('role')) {
				this.setAttribute('role', Ch5RoleAttributeMapping.ch5TriggerView);
			}

			this.cacheComponentChildrens();

			// Setup the component.
			this.initAttributes();
			this.updateCssClasses();

			// attach event listeners
			this.attachEventListeners();

			// Sometimes the 'slot-changed' event doesn't fire consistently across
			// browsers, depending on how the Custom Element was parsed and initialized
			// (see https://github.com/whatwg/dom/issues/447)
			this._onSlidesSlotChange();

			// TODO: css will be removed to sass files, used here temporary
			// const style = document.createElement('style') as HTMLElement;
			// style.innerHTML = swiperCss;
			// this.appendChild(style);

			this.id = this.getCrId();

			this.slidesManager.prepareSwiperSlides();
			// activate swiper
			this.slidesManager.initSwiper();
		}

		if (!this.closest('ch5-modal-dialog')) {
			setTimeout(setup);
			return;
		}

		subscribeInViewPortChange(this, () => {
			this.info('ch5-triggerview.subscribeInViewPortChange()');
			if (this.elementIsInViewPort && !this.wasInstantiatedInViewport) {
				this._updateSizeStyleProperties();
				setup();
				this.wasInstantiatedInViewport = true;
			}
		});

		// this is a quick fix
		// problem is that when connected callback is called
		// the triggerview doesn't have children attached
	}

	/**
	 * Fires when the element is removed from the DOM.
	 * It's a good place to do clean up work like releasing references and
	 * removing event listeners.
	 * @private
	 */
	public disconnectedCallback() {
		this.info('Ch5TriggerView.disconnectedCallback()');

		this.removeEvents();
		this.unsubscribeFromSignals();
		this.slidesManager.destroySwiper();
	}

	/**
	 * Defining handleEvent allows to pass `this` as the callback to every
	 * `addEventListener` and `removeEventListener`. This avoids the need of
	 * binding every function. See
	 * https://medium.com/@WebReflection/dom-handleevent-a-cross-platform-standard-since-year-2000-5bf17287fd38
	 *
	 * @param {Event} e Any event.
	 * @private
	 */
	public handleEvent(e: Event) {
		// Slot change
		if (e.type === 'slotchange' && e.target === this._slidesSlot) {
			this._onSlidesSlotChange();
		}
	}

	// ===========================================================================
	// Public methods (previousViewChild, nextViewChild, setActiveViewChild, setActiveView)
	// ===========================================================================

	/**
	 * Selects the slide preceding the currently selected one.
	 * If the currently selected slide is the first slide and the loop
	 * functionality is disabled, nothing happens.
	 */
	public previousViewChild() {
		this.slidesManager.slidePrevious();
	}

	/**
	 * Selects the slide following the currently selected one.
	 * If the currently selected slide is the last slide and the loop
	 * functionality is disabled, nothing happens.
	 */
	public nextViewChild() {
		this.slidesManager.slideNext();
	}

	/**
	 * Show the child based on an childview component. This will be called by the child view.
	 *
	 * @param {Ch5TriggerViewChild} childView
	 */
	public setActiveViewChild(childView: Ch5TriggerViewChild): void {
		const slideIndex = this.slidesManager.getChildElSwipeIndex(childView);
		if (slideIndex !== null) {
			this.activeView = slideIndex;
		}
	}

	/**
	 * Show the child based upon 1 based index
	 *
	 * @param {number} index
	 */
	public setActiveView(index: number) {
		this.activeView = index;
	}

	// ===========================================================================
	// Attributes / properties (selected, activeView, endless, gestureable)
	// ===========================================================================

	/**
	 * An array of the observed attributes.
	 * @static
	 */
	static get observedAttributes() {
		const commonAttributes = Ch5Common.observedAttributes;

		const ch5TriggerViewAttributes: string[] = [
			'activeview',
			'endless',
			'gestureable',
			'disableanimation',

			// SEND SIGNALS
			'sendeventshowchildindex',

			// RECEIVE SIGNALS
			'receivestateshowchildindex',
			'nested'
		];

		return commonAttributes.concat(ch5TriggerViewAttributes);
	}

	/**
	 * Called whenever an observedAttribute's value changes.
	 * @param {string} name The attribute's local name.
	 * @param {string} oldValue The attribute's previous value.
	 * @param {string} newValue The attribute's new value.
	 * @fires selected
	 * @private
	 */
	public attributeChangedCallback(name: string, oldValue: string, newValue: string) {
		if (oldValue === newValue) {
			return;
		}
		this.info('Ch5TriggerView attributeChangedCallback("' + name + '","' + oldValue + '","' + newValue + ')"');

		if (this.slidesManager.getSlidesNumber() === 0) {
			this._onSlidesSlotChange();
		}

		switch (name) {			
			case 'activeview':
				if (oldValue !== newValue) {

					const parsedNewValue = parseInt(newValue, 10);
					// Accept only numbers between `0` and slides number
					if (this.slidesManager.getSlidesNumber() >= 0 &&
						(parsedNewValue > this.slidesManager.getSlidesNumber() || parsedNewValue < 0)) {
						this.activeView = 0;
						return;
					}
					this.activeView = parsedNewValue;
				}
				break;

			case 'endless':
				this.endless = booleanGetter(this, 'endless');
				break;

			case 'gestureable':
				this.gestureable = booleanGetter(this, 'gestureable');
				break;

			case 'disableanimation':
				this.disableAnimation = booleanGetter(this, 'disableanimation');
				break;

			case 'sendeventshowchildindex':
				if (this.hasAttribute('sendeventshowchildindex')) {
					this.sendEventShowChildIndex = newValue;
				} else {
					this.sendEventShowChildIndex = '';
				}
				break;

			case 'receivestateshowchildindex':
				if (this.hasAttribute('receivestateshowchildindex')) {
					this.receiveStateShowChildIndex = newValue;
				} else {
					this.receiveStateShowChildIndex = '';
				}
				break;

			case 'nested':
				this.nested = this.hasAttribute('nested');
				break;

			default:
				super.attributeChangedCallback(name, oldValue, newValue);
				break;
		}

		if (name === 'dir') {
			// ignore rtl direction and apply only for children since this breaks animation
			this.style.setProperty('direction', 'ltr');
			this._updateChildrenDirAttr();
		}
	}

	/**
	 * Unsubscribe signals
	 */
	public unsubscribeFromSignals(): void {
		super.unsubscribeFromSignals();

		this.info('Ch5TriggerView.unsubscribeFromSignals()');

		const csf = Ch5SignalFactory.getInstance();

		if ('' !== this._subReceiveStateShowChildIndexId && '' !== this._receiveStateShowChildIndexSigName) {
			const sigSelected: Ch5Signal<number> | null = csf.getNumberSignal(this._receiveStateShowChildIndexSigName);
			if (null !== sigSelected) {
				sigSelected.unsubscribe(this._subReceiveStateShowChildIndexId);
				this._receiveStateShowChildIndexSigName = '';
			}
		}
	}

	public getSlidesAsArray(): HTMLElement[] {
		return Array.prototype.slice.call(this.slidesManager.getSlidesArray(), 0);
	}

	/**
	 * Returns css class when disabled
	 *
	 * @return { string }
	 */
	public getCssClassDisabled(): string {
		return this.cssClassPrefix + '--disabled';
	}

	public set activeViewCallback(callback: TActiveViewCallback) {
		if (!(callback instanceof Function)) {
			return;
		}

		this._activeViewCallback = callback;
	}

	public get activeViewCallback(): TActiveViewCallback {
		return this._activeViewCallback;
	}

	/**
	 * The 1-based index of the selected slide.
	 * @type {number}
	 */
	set activeView(index: number) {
		index = Number(index);

		if (isNaN(index)) {
			index = 0;
		}

		if (this.slidesManager.swiperIsActive()) {
			const speed = this.computeTransitionByDistance(index);
			this.slidesManager.swipeTo(this.activeView, this.disableAnimation, speed);
		} else if (this.slidesManager.ch5SwiperIsActive()) {
			this.slidesManager.swipeTo(this.activeView, false, 0);
		}

		this.dispatchEvent(new CustomEvent('select', {
			detail: this.activeView,
			bubbles: false,
		}));

		// prevent sending signal if select is happening from receive signal
		// We should only prevent signal if the receive and send are same. If different, then we should trigger the signal send.
		this.info("this._signalIsReceived", this._signalIsReceived);
		this.info("this._sendEventShowChildIndexSigName", this._sendEventShowChildIndexSigName);
		this.info("this._receiveStateShowChildIndexSigName", this._receiveStateShowChildIndexSigName);
		if (this._sendEventShowChildIndexSigName !== this._receiveStateShowChildIndexSigName) {
			// send signal with selected value 1-based index
			this.info("SUCCESS");
			this._sendValueForSelectSignal(this.activeView);
		}
		this._updateAriaLiveDom();

		if (this.activeViewCallback instanceof Function) {
			this.activeViewCallback();
		}

		intSetter(this, 'activeview', index);
		this._activeView = index;
	}

	get activeView() {
		return intGetter(this, 'activeview', 0);
	}

	public getPlainActiveView() {
		return this._activeView;
	}

	/**
	 * Getter for the swiper sensitivity
	 */
	public get getSwiperSensitivity(): number {
		return this.swipeThreshold;
	}

	/**
	 * Setter for the swiper sensitivity
	 * @param sensitivity
	 */
	public setSwiperSensitivity(sensitivity: number) {
		this.slidesManager.swiperSensitivity = sensitivity;
	}

	/**
	 * Whether the slider is looping (e.g wrapping around).
	 * @type {boolean}
	 */
	set endless(flag) {
		booleanSetter(this, 'endless', flag);

		const swiperLoop = this.slidesManager.getSwiperParam('loop');
		const newEndlessVal = booleanGetter(this, 'endless');
		if (typeof swiperLoop === 'boolean' && swiperLoop !== newEndlessVal) {
			this.slidesManager.reinitializeSwiper();
		}
	}

	get endless() {
		return booleanGetter(this, 'endless');
	}

	/**
	 * If true, the slides can not be dragged with pointer events.
	 * @type {boolean}
	 */
	set gestureable(flag) {
		if (this.disableAnimation) {
			this.slidesManager.reinitializeSwiper();
		} else {
			this.slidesManager.setAllowTouchMove(booleanGetter(this, 'gestureable'));
			this.slidesManager.refreshSlideSpeed();
		}
		booleanSetter(this, 'gestureable', flag);
	}

	get gestureable() {
		return booleanGetter(this, 'gestureable');
	}

	/**
	 * If true, disables CSS transitions and drag deceleration.
	 * @type {boolean}
	 */
	set disableAnimation(flag) {
		booleanSetter(this, 'disableanimation', flag);

		const swiperFollowFinger = this.slidesManager.getSwiperParam('followFinger');
		const newDisableAnimation = booleanGetter(this, 'disableanimation');
		if (typeof swiperFollowFinger === 'boolean' && !swiperFollowFinger !== newDisableAnimation) {
			this.slidesManager.reinitializeSwiper();
		}
	}

	get disableAnimation() {
		return booleanGetter(this, 'disableanimation');
	}

	/**
	 * SEND SIGNALS GETTERS AND SETTERS
	 */

	/**
	 * Getter sendEventShowChildIndex
	 */
	get sendEventShowChildIndex(): string {
		return this._sendEventShowChildIndexSigName;
	}

	/**
	 * Setter sendEventShowChildIndex
	 */
	set sendEventShowChildIndex(value: string) {
		this.info('set _sendEventShowChildIndexSigName(\'' + value + '\')');

		if ('' === value) {
			return;
		}

		if (this._sendEventShowChildIndexSigName !== value) {
			this._sendEventShowChildIndexSigName = value;
			this.setAttribute('sendeventshowchildindex', value);
		}
	}

	/**
	 * RECEIVED SIGNALS GETTERS AND SETTERS
	 */

	/**
	 * Getter receiveStateShowChildIndex
	 */
	get receiveStateShowChildIndex(): string {
		// The internal property is changed if/when the element is removed from DOM
		// Returning the attribute instead of the internal property preserves functionality
		return this._attributeValueAsString('receivestateshowchildindex');
	}

	/**
	 * Setter receiveStateShowChildIndex
	 */
	set receiveStateShowChildIndex(value: string) {
		this.info('set receiveStateShowChildIndex(\'' + value + '\')');

		if ('' === value
			|| this._receiveStateShowChildIndexSigName === value
			|| null === value
			|| undefined === value) {
			return;
		}

		// clean up old subscription
		if (this._receiveStateShowChildIndexSigName !== ''
			&& this._receiveStateShowChildIndexSigName !== undefined
			&& this._receiveStateShowChildIndexSigName !== null) {

			const oldStateName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateShowChildIndexSigName);
			const oldState: Ch5Signal<number> | null = Ch5SignalFactory.getInstance().getNumberSignal(oldStateName);

			if (oldState !== null) {
				oldState.unsubscribe(this._subReceiveStateShowChildIndexId);
			}
		}

		// setup new subscription.
		this._receiveStateShowChildIndexSigName = value;
		this.setAttribute('receivestateshowchildindex', value);

		const receiveStateName: string = Ch5Signal.getSubscriptionSignalName(this._receiveStateShowChildIndexSigName);
		const receiveState: Ch5Signal<number> | null = Ch5SignalFactory.getInstance().getNumberSignal(receiveStateName);

		if (receiveState === null) {
			return;
		}

		this._subReceiveStateShowChildIndexId = receiveState.subscribe((newValue: number) => {
			if (!isNaN(newValue) && receiveState.hasChangedSinceInit()) {
				this._signalIsReceived = true;
				this.activeView = newValue;
			} else {
				this.info('Ch5TriggerView receiveStateShowChildIndex signal value for ' + this.getAttribute('data-ch5-id') + ' is invalid');
			}
		});
	}

	public set swipeThreshold(sensitivity: number) {
		if (isNil(sensitivity) || isNaN(sensitivity)) {
			return;
		}
		this._swipeThreshold = sensitivity;
	}

	public get swipeThreshold(): number {
		return this._swipeThreshold;
	}

	/**
	 * Flag to mark the component as child of ch5-triggerview-child
	 * @type {boolean}
	 */
	set nested(nestedValue) {
		if (nestedValue !== this._nested) {
			this._nested = nestedValue;
			if (this._nested) {
				this.setAttribute('nested', '');
			} else {
				this.removeAttribute('nested');
			}
			this.slidesManager.reinitializeSwiper();
		}
	}

	get nested() {
		return this._nested;
	}

	/**
	 * Called to initialize all attributes/properties
	 * @protected
	 */
	protected initAttributes(): void {
		super.initAttributes();

		if (!this.hasAttribute('activeView')) {
			// update attr to avoid triggering slideTo action here
			this.setAttribute('activeView', '0');
		}
		this._upgradeProperty('endless');
		this._upgradeProperty('gestureable');
		this._upgradeProperty('disableanimation');
		this._upgradeProperty('receiveStateShowChildIndex');
		this._upgradeProperty('sendEventShowChildIndex');
	}

	/**
	 * Called to bind proper listeners
	 * @protected
	 */
	protected attachEventListeners(): void {
		super.attachEventListeners();
		// Add event listeners.
		this._slidesSlot.addEventListener('slotchange', this);
	}

	/**
	 * Removes listeners
	 * @protected
	 */
	protected removeEvents(): void {
		super.removeEventListeners();
		this._slidesSlot.removeEventListener('slotchange', this);
	}

	/**
	 * Update the width style property with the width get from offsetWidth.
	 * This is helpful when the triggerview is not in the viewport at initialization
	 * and is need to determine the viewport sizes.
	 *
	 * @param {boolean} watchForResize apply size change in window.resize callback
	 * @return {void}
	 */
	protected _updateSizeStyleProperties(): void {
		this.style.width = `${this.offsetWidth}px`;
	}

	/**
	 * Apply css classes for attrs inherited from common (e.g. customClass, customStyle )
	 * @protected
	 */
	protected updateCssClasses(): void {
		// apply css classes for attrs inherited from common (e.g. customClass, customStyle )
		super.updateCssClasses();

		// @ts-ignore
		const setOfCssClassesToBeApplied = new Set<string>();

		// primary
		setOfCssClassesToBeApplied.add(this.primaryCssClass);

		const targetEl: HTMLElement = this.getTargetElementForCssClassesAndStyle();
		if (typeof targetEl.classList !== 'undefined') {
			this._listOfAllPossibleComponentCssClasses.forEach((cssClass: string) => {
				if (setOfCssClassesToBeApplied.has(cssClass)) {
					targetEl.classList.add(cssClass);
					// this.classList.add(cssClass);
					this.info('add CSS class', cssClass);
				} else {
					targetEl.classList.remove(cssClass);
					// this.classList.remove(cssClass);
					this.info('remove CSS class', cssClass);
				}
			});
		}
	}

	/**
	 * Generates a list of all possible components css classes
	 *
	 * @private
	 * @returns {string[]}
	 */
	protected generateListOfAllPossibleComponentCssClasses(): string[] {
		const cssClasses: string[] = this._listOfAllPossibleComponentCssClasses;
		cssClasses.push(this.primaryCssClass);
		return cssClasses;
	}

	/**
	 * Calculate the speed of transition by the number of diff pages
	 *
	 * @param {number} viewToLoad
	 */
	public computeTransitionByDistance(viewToLoad: number): number {
		const pageGap = Math.abs(this._activeView - viewToLoad);
		return SPEED_BETWEEN_PAGES * pageGap;
	}

	/**
	 * Send signal value on view change
	 * @private
	 */
	private _sendValueForSelectSignal(value: number): void {
		let sigSelect: Ch5Signal<number> | null = null;

		if ('' !== this._sendEventShowChildIndexSigName
			&& undefined !== this._sendEventShowChildIndexSigName
			&& null !== this._sendEventShowChildIndexSigName) {

			sigSelect = Ch5SignalFactory.getInstance().getNumberSignal(this._sendEventShowChildIndexSigName);

			if (sigSelect !== null) {
				sigSelect.publish(value);
			}
		}
	}

	// ===========================================================================
	// Slides slot
	// ===========================================================================

	/**
	 * Updates the slider to react to DOM changes in #slidesSlot.
	 * @private
	 */
	private _onSlidesSlotChange() {
		// Remove text nodes (if they are around, they may cause the text content
		// to not be picked up)
		this._slidesSlot.assignedNodes({ flatten: true }).forEach(node => {
			if (node.nodeType === Node.TEXT_NODE && node.parentNode) {
				node.parentNode.removeChild(node);
			}
		});
	}

	// ===========================================================================
	// aria-live region
	// ===========================================================================
	/**
	 * Updates the aria-live region, used to notify screen readers.
	 * @private
	 */
	private _updateAriaLiveDom() {
		if (this._ariaSlot.assignedNodes().length !== 1) {
			this._ariaLiveRegion = document.createElement('div');
			this._ariaLiveRegion.setAttribute('slot', 'ariaSlot');
			this._ariaLiveRegion.setAttribute('aria-live', 'polite');
			this._ariaLiveRegion.setAttribute('aria-atomic', 'true');
			this.appendChild(this._ariaLiveRegion);
		}
		this._ariaLiveRegion.textContent =
			`Item ${this.activeView} of ${this.slidesManager.getSlidesNumber()} visible`;
	}

	// ===========================================================================
	// Pointer events + drag
	// ===========================================================================

	private _updateChildrenDirAttr(): void {
		customElements.whenDefined('ch5-triggerview-child').then(() => {
			// this._slides.forEach(slide => slide.element.dir = this.dir);
		});
	}

	/**
	 * Used for upgrading properties in case this element is upgraded lazily.
	 * See web/fundamentals/architecture/building-components/best-practices#lazy-properties
	 * @param {*} prop
	 * @private
	 */
	private _upgradeProperty(prop: any) {
		if (this.constructor.prototype.hasOwnProperty(prop)) {
			const val = (this as any)[prop];
			delete (this as any)[prop];
			(this as any)[prop] = val;
		}
	}

}

if (typeof window === "object" && typeof window.customElements === "object"
	&& typeof window.customElements.define === "function") {
	window.customElements.define('ch5-triggerview', Ch5TriggerView);
}
