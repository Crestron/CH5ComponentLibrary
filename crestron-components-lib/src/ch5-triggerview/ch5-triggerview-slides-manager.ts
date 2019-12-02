// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import {Ch5TriggerView} from "./ch5-triggerview";
import Swiper, { SwiperOptions } from "swiper";
import {getCSSCustomProperty} from "./utils";
import {Ch5TriggerViewChild} from "./ch5-triggerview-child";
import {isNil} from "lodash";
import { Ch5CustomAttributes } from "../ch5-custom-attrs";

export class Ch5TriggerViewSlidesManager {

  public static TRIGGERVIEW_SLIDER_CONTAINER_CLASS: string = 'swiper-container';
  public static TRIGGERVIEW_SLIDES_WRAPPER_CLASS: string = 'swiper-wrapper';
  public static TRIGGERVIEW_SLIDE_CLASS: string = 'swiper-slide';
  public static TRIGGERVIEW_CHILD_SELECTOR: string = 'ch5-triggerview-child';

  /**
   * The ch5-triggerview element
   * @type {HTMLElement}
   * @private
   */
  public triggerViewEl: Ch5TriggerView = {} as Ch5TriggerView;

  /**
   * The width of private _slidesWrapper (in px). Derived from CSS.
   * @type {number}
   * @private
   */
  private _wrapperWidth = 0;

  /**
   * The width of the gap between each slide (in px). Derived from CSS.
   * @type {number}
   * @private
   */
  private _slidesGap = 0;

  /**
   * The width of each individual slide (in px). Computed mathematically
   * from other properties.
   * @type {number}
   * @private
   */
  private _slidesWidth = 0;

  /**
   * Swiper lib object used to for slide action
   * @type {Swiper}
   * @private
   */
  private _swiper: Swiper | null = null;

  /**
   * Slide transition speed
   * @type {number}
   * @private
   */
  private _transitionSpeed: number = 200;

  /**
   * The wrapper element enclosing the slides.
   * @type {HTMLElement}
   * @private
   */
  private _externalWrapper: HTMLElement | null = null;

  /**
   * The wrapper element enclosing the slides.
   * @type {HTMLElement}
   * @private
   */
  private _slidesWrapper: HTMLElement | null = null;

  private _touchMoveListRelatedEventDisabled: boolean = false;

  constructor(el: Ch5TriggerView) {
    this.triggerViewEl = el;
  }

  /**
   * Prepare swiper wrappers and slides
   */
  public prepareSwiperSlides() {
    const slides: HTMLElement[] = this.getTriggerviewChildSlides();
    if (!this._externalWrapper) {
      this._createSlidesWrappers();
    }
    this.initSlides(slides);
    this._computeSizes();
  }

  /**
   * Initialilze Swiper
   */
  public initSwiper() {
    const id = this.triggerViewEl.getCrId();
    this._swiper = new Swiper(`#${id!} .${Ch5TriggerViewSlidesManager.TRIGGERVIEW_SLIDER_CONTAINER_CLASS}`, {
      slidesPerView: 1,
      spaceBetween: this._slidesGap,
      loop: this.triggerViewEl.endless,
      speed: this._getSlidingSpeed(),
      touchRatio: 1.4,
      followFinger: true,
      threshold: this.triggerViewEl.swipeThreshold,
      touchStartPreventDefault: false,
      touchMoveStopPropagation: false,
      nested: this.triggerViewEl.nested,
      updateOnImagesReady: true,
    });

    // make sure active slide is the one set from activeView
    if (this._swiper.realIndex !== this.triggerViewEl.activeView) {
      this.swipeTo(this.triggerViewEl.activeView, true);
    }

    this._swiper.on('slideChange', () => {
      // update active slide attributes (also prev active slide attrs will be updated)
      this._updateActiveSlideAttributes();
      this._updateTriggerViewElActiveViewWhenChangedBySwiper();
    });

    // set gestures on/off
    this.setAllowTouchMove(this.triggerViewEl.gestureable);

    this._swiper.on('touchStart', (...e: any[]) => {
      const target: HTMLElement = e[0].target;
      if (this.eventTargetBelongsToCh5List(target)) {
        this.setAllowTouchMove(false);
        this._touchMoveListRelatedEventDisabled = true;
      }
    });

    this._swiper.on('touchEnd', (...e: any[]) => {
      const target: HTMLElement = e[0].target;
      if (this.eventTargetBelongsToCh5List(target) || this._touchMoveListRelatedEventDisabled) {
        this.setAllowTouchMove(true);
        this._touchMoveListRelatedEventDisabled = false;
      }
    });

  }

  private eventTargetBelongsToCh5List(el: HTMLElement): boolean {
    return el.closest('ch5-list') !== null;
  }

  public reinitializeSwiper() {
    if (this.swiperIsActive()) {
      this.destroySwiper();
      this.initSwiper();
    }
  }

  /**
   * Getter for the swiper sensitivity
   * @param newThreshold
   */
  public set swiperSensitivity(newThreshold: number) {
    this.triggerViewEl.swipeThreshold = newThreshold;

    if (this._swiper !== null) {
        this._swiper.params.threshold = newThreshold;
    }
  }

  /**
   * Check if swiper was initialized
   */
  public swiperIsActive(): boolean {
    return this._swiper instanceof Swiper;
  }

  /**
   * Completely destroy swiper instance
   */
  public destroySwiper() {
    if (this.swiperIsActive()) {
      this._swiper!.destroy(true, false);
    }
  }

  /**
   * Get number of slides
   */
  public getSlidesNumber(): number {
    if (this.swiperIsActive() && !isNil(this._swiper) && !isNil(this._swiper.slides)) {
      return this._swiper.slides.length;
    } else {
      const slides = this.getTriggerviewChildSlides();
      return slides.length;
    }
  }

  /**
   * Init slides by adding them inside required Swiper wrappers and adding slide class
   */
  public initSlides(slides: HTMLElement[]) {

    Ch5CustomAttributes.preventUnsubscribe = true;

    const trvHasListRole: boolean = this.triggerViewEl.getAttribute('role') === 'list';
    // @ts-ignore
    Array.from(slides).forEach((slide: HTMLElement, index: number) => {
      const isActive: boolean = slide.hasAttribute('selected') || (index === this.triggerViewEl.activeView);

      slide.setAttribute('tabindex', isActive ? '1' : '-1');
      slide.setAttribute('aria-hidden', String(!isActive));

      if (isActive) {
        slide.removeAttribute('inert');

        if (!slide.hasAttribute('selected')) {
          slide.setAttribute('selected', '');
        }
      } else {
        slide.setAttribute('inert', 'true');
      }

      if (trvHasListRole) {
        slide.setAttribute('role', 'listitem');
      }

      slide.classList.add(Ch5TriggerViewSlidesManager.TRIGGERVIEW_SLIDE_CLASS);

      // No need to use document fragments here, the elements are already inside DOM,
      // we're just move them inside swiper wrappers
      (this._slidesWrapper as HTMLElement).appendChild(slide); // TODO: use document fragments? (might not be needed)
    });
  }

  /**
   * Go to a specific slide by index
   * @param slideIndex
   */
  public swipeTo(slideBaseOneIndex: number, instantTransition: boolean = false, speed?: number) {

    if (this.swiperIsActive()) {

      const _speed = speed !== undefined ? speed : this._transitionSpeed;

      // in loop mode first slide bas index 0 (because of the duplicate slides created by swiper)
      const slideIndex = this.triggerViewEl.endless ? slideBaseOneIndex + 1 : slideBaseOneIndex;
      if (slideIndex !== this._swiper!.activeIndex && this._swiper!.hasOwnProperty('snapGrid')) {

        this._swiper!.slideTo(slideIndex, instantTransition ? 0 : _speed);
        this._updateActiveSlideAttributes();
      }
    }
  }

  public getChildElSwipeIndex(childView: Ch5TriggerViewChild) {
    let slideIndex = null;
    if (this.swiperIsActive()) {

      let slide = null;
      let index = null;

      if (!isNil(this._swiper) && !isNil(this._swiper.slides)){
        Array.from(this._swiper!.slides).forEach((s: Ch5TriggerViewChild, i) => {
          if (!s.classList.contains('swiper-slide-duplicate') && childView === s) {
            slide = s;
            index = i;
          }
        });
      }

      if (slide !== null) {
        if (this.triggerViewEl.endless) {
          slideIndex = Number((slide as HTMLElement).getAttribute('data-swiper-slide-index'));
        } else {
          slideIndex = index;
        }
      }
    }
    return isNaN(slideIndex as number) ? null : slideIndex;
  }

  public slideNext() {
    this._swiper!.slideNext(this._getSlidingSpeed());
  }

  public slidePrevious() {
    this._swiper!.slidePrev(this._getSlidingSpeed());
  }

  public setAllowTouchMove(active: boolean) {
    if (this.swiperIsActive()) {
      this._swiper!.allowTouchMove = active;
    }
  }

  public refreshSlideSpeed() {
    if (this.swiperIsActive()) {
      (this._swiper!.params as any).speed = this._getSlidingSpeed();
    }
  }

  public getActiveIndex() {
    return this._swiper!.realIndex;
  }
  
  public getSwiperParam(paramName: string) {
    if (!this.swiperIsActive()) {
      return null;
    }
    return (this._swiper!.params as any)[paramName];
  }

  public getTriggerviewChildSlides() {
    const slidesElements = Array.from(this.triggerViewEl.children)
      .filter((e: Element) => e.tagName.toLowerCase() === Ch5TriggerViewSlidesManager.TRIGGERVIEW_CHILD_SELECTOR);

    return slidesElements as HTMLElement[];
  }

  /**
   * Create swiper slides wrappers
   * @private
   */
  private _createSlidesWrappers() {
    this._externalWrapper = document.createElement('div');
    this._externalWrapper.classList.add(Ch5TriggerViewSlidesManager.TRIGGERVIEW_SLIDER_CONTAINER_CLASS);
    this._slidesWrapper = document.createElement('div');
    this._slidesWrapper.classList.add(Ch5TriggerViewSlidesManager.TRIGGERVIEW_SLIDES_WRAPPER_CLASS);
    this._externalWrapper.appendChild(this._slidesWrapper);
    this.triggerViewEl.appendChild(this._externalWrapper);
  }

  /**
   * Computes a few value needed to lay out the UI.
   * @private
   */
  private _computeSizes() {
    this._wrapperWidth = this.triggerViewEl.getBoundingClientRect().width;
    this._slidesGap = this._getSlidesGap();
    this._slidesWidth = this._getSlideWidth();
  }

  /**
   * Computes the slide gap value from CSS.
   * @returns {number} The width (in px) of the gap between slides.
   * @private
   */
  private _getSlidesGap() {
    // Check if gap has unitless values (i.e. values ending with a digit).
    if (/\d$/.test(getCSSCustomProperty(this.triggerViewEl, '--ch5-triggerview-gap'))) {
      console.warn(`Warning: it looks like --ch5-triggerview-gap has a unitless value.
            Add CSS units to its value to avoid breaking the slides layout.`);
    }
    // Getting the computed style because we need a value in px, while
    // the actual CSS property can be declared with any unit.
    const firstSlideEl = this.triggerViewEl.querySelector(Ch5TriggerViewSlidesManager.TRIGGERVIEW_CHILD_SELECTOR);
    if (firstSlideEl) {
      const parsedGap = parseInt(
        window.getComputedStyle(firstSlideEl as HTMLElement).getPropertyValue("margin-right"), 10);
      // @ts-ignore
      return !Number.isFinite(parsedGap) ? 0 : parsedGap;
    }
    return 0;
  }

  /**
   * Computes the width of one slide given the layout constraint.
   * @returns {number} The width (in px) of one slide.
   * @private
   */
  private _getSlideWidth() {
    return this._wrapperWidth - this._slidesGap;
  }

  private _updateActiveSlideAttributes() {
    if (this.swiperIsActive()) {
      const activeSlideIndex = this._swiper!.activeIndex;
      // @ts-ignore
      Array.from(this._swiper!.slides).forEach((slide: HTMLElement, index) => {
        if (index !== activeSlideIndex) {
          slide.setAttribute('tabindex', '-1');
          slide.setAttribute('aria-hidden', 'true');
          slide.setAttribute('inert', 'true');
          slide.removeAttribute('selected');
        } else {
          slide.setAttribute('tabindex', '1');
          slide.setAttribute('aria-hidden', 'false');
          slide.removeAttribute('inert');
          slide.setAttribute('selected', '');
        }
      });
    }
  }

  private _updateTriggerViewElActiveViewWhenChangedBySwiper() {
        this.triggerViewEl!.setAttribute('activeView', String(this.getActiveIndex()));
  }

  private _getSlidingSpeed() {
    if (this.triggerViewEl.disableAnimation) {
      return 0;
    }
    return this.triggerViewEl.gestureable ? this._transitionSpeed : 0;
  }

  public getSlidesArray() {
    if (this.swiperIsActive() && !isNil(this._swiper) && !isNil(this._swiper.slides)) {
      return this._swiper.slides;
    } else {
      return this.getTriggerviewChildSlides();
    }
  }


}
