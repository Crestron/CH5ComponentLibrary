// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5Spinner } from "./ch5-spinner";
import { Ch5AugmentVarSignalsNames } from "../ch5-common/ch5-augment-var-signals-names";

export class Ch5SpinnerTemplate {

  public static ERROR = {
    structure: 'Wrong template structure'
  };

  /**
   * @type {boolean}
   */
  public _templateDefined: boolean = false as boolean;

  /**
   * It is the ch5-spinner element
   *
   * @private
   * @memberof Ch5SpinnerTemplate
   * @type {Ch5Spinner}
   */
  private _element: Ch5Spinner = {} as Ch5Spinner;

  /**
   * Wrapper for list items
   *
   * @private
   * @memberof Ch5SpinnerTemplate
   * @type {HTMLElement}
   */
  private _wrapperElement: HTMLElement = {} as HTMLElement;

  /**
   *
   * @private
   * @memberof Ch5SpinnerTemplate
   * @type {HTMLElement}
   */
  private _scrollableArea: HTMLElement = {} as HTMLElement;

  /**
   * @private
   * @memberof Ch5SpinnerTemplate
   * @type {HTMLElement}
   */
  private _highlightElement: HTMLElement = {} as HTMLElement;

  /**
   * This overlay will be present on the whole window when
   * user drag the select list
   *
   * @private
   * @memberof Ch5SpinnerTemplate
   * @type {HTMLElement}
   */
  private _overlayElement: HTMLElement = {} as HTMLElement;

  /**
   * The template of the component
   *
   * @private
   * @memberof Ch5SpinnerTemplate
   * @type {HTMLTemplateElement}
   */
  private _templateElement: HTMLTemplateElement = {} as HTMLTemplateElement;

  /**
   * Contains the list items
   *
   * @private
   * @memberof Ch5SpinnerTemplate
   * @type {[HTMLElement]|null}
   */
  private _childrenObject: [HTMLElement] | null = null;

  /**
   * Contains the initial items
   * This will not be touched and contains the initial objects in spinner
   * Will help most for endless functionality
   *
   * @private
   * @memberof Ch5SpinnerTemplate
   * @type {[HTMLElement]|null}
   */
  private _initialchildrenObject: [HTMLElement] | null = null;

  /**
   * Contains an index of the current appended item
   * This is used along with endless attribute to know which
   * item should be appended next
   *
   * @private
   * @memberof Ch5SpinnerScroll
   * @type {number}
   */
  private _appendedItemIndex: number = 0 as number;

  /**
   * Contains an index of the current prepended item
   * This is used along with endless attribute to know which
   * item should be prepended next
   *
   * @private
   * @memberof Ch5SpinnerScroll
   * @type {number}
   */
  private _prependedItemIndex: number = 0 as number;

  /**
   * Items to be prepened/appended in spinner when endless is active
   * The number of items prepended/appended will be the same as visibleItemScroll value
   *
   * @type {[HTMLElement]}
   */
  public _clonedItems: {
    prepended: HTMLElement[],
    appended: HTMLElement[],
    [key: string]: HTMLElement[]
  } = {} as {
    prepended: HTMLElement[],
    appended: HTMLElement[]
  };


  constructor(element: Ch5Spinner) {

    this.element = element;
    this.checkTemplateDefined();

    if (this._templateDefined === true) {
      this.templateElement = this._element.querySelector('template') as HTMLTemplateElement;
    }
  }

  public destruct() {

    this.childrenObject = null;
    this.wrapperElement = {} as HTMLElement;
    this.scrollableArea = {} as HTMLElement;
    this.templateElement = {} as HTMLTemplateElement;

    this.prependedItemIndex = this.element.size;
  }

  /**
   * Setter for element property
   *
   * @param {Ch5Spinner} element
   */
  public set element(element: Ch5Spinner) {

    if (element !== undefined || element !== null) {
      this._element = element;
    }
  }

  /**
   * Getter for element property
   *
   * @return {Ch5Spinner}
   */
  public get element(): Ch5Spinner {

    return this._element;
  }

  /**
   * Setter for wrapperElement property
   *
   * @param {HTMLElement} element
   */
  public set wrapperElement(element: HTMLElement) {

    if (element !== undefined || element !== null) {
      this._wrapperElement = element;
    }
  }

  /**
   * Getter for wrapperElement property
   *
   * @return {HTMLElement}
   */
  public get wrapperElement(): HTMLElement {

    return this._wrapperElement;
  }

  /**
   * Setter for wrapperElement property
   *
   * @param {HTMLElement} area
   */
  public set scrollableArea(area: HTMLElement) {

    if (area !== undefined || area !== null) {
      this._scrollableArea = area;
    }
  }

  /**
   * Getter for scrollableArea property
   *
   * @return {HTMLElement}
   */
  public get scrollableArea(): HTMLElement {

    return this._scrollableArea;
  }

  /**
   * Setter for highlightElement property
   *
   * @param {HTMLElement} element
   */
  public set highlightElement(element: HTMLElement) {

    if (element !== undefined || element !== null) {
      this._highlightElement = element;
    }
  }

  /**
   * Getter for highlightElement
   *
   * @return {HTMLElement}
   */
  public get highlightElement(): HTMLElement {

    return this._highlightElement;
  }

  /**
   * Setter for templateElement property
   *
   * @param {HTMLTemplateElement} template
   */
  public set templateElement(template: HTMLTemplateElement) {

    if (template !== undefined || template !== null) {
      this._templateElement = template;
      this.iconPositioning();
    }
  }

  /**
   * Getter for templateElement property
   *
   * @return {HTMLTemplateElement}
   */
  public get templateElement(): HTMLTemplateElement {

    return this._templateElement;
  }

  /**
   * Setter for childrenObject property
   *
   * @param {[HTMLElement] | null} childrenObject
   */
  public set childrenObject(childrenObject: [HTMLElement] | null) {
    if (childrenObject !== undefined || childrenObject !== null) {
      this._childrenObject = childrenObject;
    }
  }

  /**
   * Getter for childrenObject property
   *
   * @return {[HTMLElement] | null}
   */
  public get childrenObject(): [HTMLElement] | null {

    return this._childrenObject;
  }

  /**
   * Setter for initialchildrenObject
   *
   * @param {[HTMLElement] | null} childrenObject
   */
  public set initialchildrenObject(childrenObject: [HTMLElement] | null) {
    if (childrenObject !== undefined || childrenObject !== null) {
      this._initialchildrenObject = childrenObject;
    }
  }

  /**
   * Getter for initialchildrenObject
   *
   * @return {[HTMLElement] | null}
   */
  public get initialchildrenObject(): [HTMLElement] | null {

    return this._initialchildrenObject;
  }

  /**
   * Setter for overlayElement property
   *
   * @param {HTMLElement} element
   */
  public set overlayElement(element: HTMLElement) {

    if (element !== undefined || element !== null) {
      this._overlayElement = element;
    }
  }

  /**
   * Getter for overlayElement property
   *
   * @return {HTMLElement}
   */
  public get overlayElement(): HTMLElement {

    return this._overlayElement;
  }

  /**
   * Setter for appendedItemIndex
   *
   * @param {number} index
   */
  public set appendedItemIndex(index: number) {

    if (
      index > this.element.size ||
      (
        index !== this.appendedItemIndex &&
        (index === undefined || index === null)
      )
    ) {
      index = 0;
    }

    if (index >= this.element.size) {
      index = 0;
    }

    this._appendedItemIndex = index;
  }

  /**
   * Getter for appendedItemIndex
   *
   * @return {number}
   */
  public get appendedItemIndex(): number {

    return this._appendedItemIndex;
  }

  /**
   * Setter for prependedItemIndex
   *
   * @param {number} index
   */
  public set prependedItemIndex(index: number) {

    if (
      index > this.element.size ||
      (
        index !== this.prependedItemIndex &&
        (index === undefined || index === null)
      )
    ) {
      index = 0;
    }

    if (index <= 0) {
      index = this.element.size - 1;
    }

    this._prependedItemIndex = index;
  }

  /**
   * Getter for prependedItemIndex
   *
   * @return {number}
   */
  public get prependedItemIndex(): number {

    return this._prependedItemIndex;
  }

  /**
   * Add child
   *
   * @param {HTMLElement} child
   * @return {HTMLElement}
   */
  public addChild(child: HTMLElement): HTMLElement {

    if (child !== undefined && child !== null) {
      child.classList.add(Ch5Spinner.primaryCssClass + '__item');
      child.style.display = 'flex';

      if (this.childrenObject === undefined || this.childrenObject === null) {
        this.childrenObject = [child];
        this.initialchildrenObject = [child];
      } else {
        this.childrenObject.push(child as HTMLElement);
        (this.initialchildrenObject as [HTMLElement]).push(child as HTMLElement);
      }
    }

    return child;
  }

  /**
   * Generate the template for spinner.
   *
   * @see {@link addDefaultTemplate}
   * @param {number} size
   * @return {void}
   */
  public generateTemplate(size: number): void {

    const itemHeightValue = this.element.getItemHeightValue();
    const itemHeightMeasurementUnit = this.element.getItemHeightMeasurementUnit();
    const visibleItemScroll = this.element.visibleItemScroll;
    const endless = this.element.endless;



    // create the overlay element
    // this will be appended to the document body
    this.overlayElement = document.createElement('div');
    this.overlayElement.classList.add(Ch5Spinner.primaryCssClass + '__overlay');

    // create the wrapper element
    // there will be saved the child elements
    this.wrapperElement = document.createElement('div');
    this.wrapperElement.classList.add(Ch5Spinner.primaryCssClass + '__wrapper');

    // adjust the width by resize attribute
    if (this.element.resize === true) {
      this.wrapperElement.style.width = 'auto';
    }

    this.scrollableArea = document.createElement('div');
    this.scrollableArea.classList.add(Ch5Spinner.primaryCssClass + '__scrollarea--animate');

    this.highlightElement = document.createElement('div');
    this.highlightElement.style.height = this._element.itemHeight;
    this.highlightElement.style.top = this.element.getHighlightOffset();
    this.highlightElement.classList.add(Ch5Spinner.primaryCssClass + '__highlight');

    // create the default template if this is not defined
    // by a <template> element inside component
    if (this._templateDefined === false) {
      this.addDefaultTemplate();
    } else {
      this.cleanTheTemplate();
      this.element.label = '';
    }

    // create the childrens
    for (let i = 0; i < size; i++) {
      this.invokeChildElement(i);
    }
    if (this.childrenObject !== null) {

      if (endless === true) {
        const childrenObject = this.childrenObject as HTMLElement[];
        let clonedItemsLength;
        let marginTopNegativeOffset;


        for (let i = childrenObject.length - 1; i >= childrenObject.length - Math.ceil(visibleItemScroll / 2); i--) {
          this.pushElementToClonedItemsList('prepended', i, true);
        }

        for (let i = 0; i < Math.ceil(visibleItemScroll / 2); i++) {
          this.pushElementToClonedItemsList('appended', i);
        }

        clonedItemsLength = this._clonedItems.prepended.length;
        marginTopNegativeOffset = -(clonedItemsLength * itemHeightValue) + itemHeightMeasurementUnit;

        this._clonedItems.prepended[0].style.marginTop = marginTopNegativeOffset;

        this._clonedItems.prepended.forEach((element, index) => {
          this.scrollableArea.appendChild(element);
        });

      }

      this.childrenObject.forEach(spinnerItem => {
        this.scrollableArea.appendChild(spinnerItem);
      });

      if (endless === true) {
        this._clonedItems.appended.forEach(element => {
          this.scrollableArea.appendChild(element);
        });
      }

      if (this.childrenObject !== undefined && this.childrenObject !== null) {
        for (let i = this.childrenObject.length - 1; i >= 0; i--) {
          (this.childrenObject[i] as HTMLElement).style.height = this._element.itemHeight;
        }
      }
    }

    // show only a number of items based on visibleItemScroll property
    this.wrapperElement.style.height = itemHeightValue * visibleItemScroll + itemHeightMeasurementUnit;
    this.wrapperElement.appendChild(this.highlightElement);
    this.wrapperElement.appendChild(this.scrollableArea);

    // remove  wrapper if exist
    if (this._element.querySelectorAll('.' + Ch5Spinner.primaryCssClass + '__overlay').length
      || this._element.querySelectorAll('.' + Ch5Spinner.primaryCssClass + '__wrapper').length) {
      const overlayEle = Array.from(this._element.querySelectorAll('.' + Ch5Spinner.primaryCssClass + '__overlay'));
      const wrapperEle = Array.from(this._element.querySelectorAll('.' + Ch5Spinner.primaryCssClass + '__wrapper'));
      overlayEle.forEach(e => e.parentNode!.removeChild(e));
      wrapperEle.forEach(e => e.parentNode!.removeChild(e));
    }
    this._element.appendChild(this.wrapperElement);
    this._element.appendChild(this.overlayElement);

    if (this.childrenObject !== null && this.childrenObject !== undefined) {
      for (let i = (this.childrenObject as [HTMLElement]).length - 1; i >= 0; i--) {
        const child = (this.childrenObject as [HTMLElement])[i];
        const label = child.querySelector('.' + Ch5Spinner.primaryCssClass + '__label') as HTMLElement;

        if (label !== null && label.hasAttribute('data-ch5-textcontent-placeholder')) {
          const textcontent = label.getAttribute('data-ch5-textcontent-placeholder') as string;
          label.removeAttribute('data-ch5-textcontent-placeholder');
          label.setAttribute('data-ch5-textcontent', textcontent);
        }
      }

      // TODO-ANDREI
      // This is a temporary solution and
      // needs further improvements
      if (parseInt(this._element.itemHeight, 10) <= 0 || isNaN(parseInt(this._element.itemHeight, 10))) {
        this.handleDefaultItemHeight((this.childrenObject as [HTMLElement])[0] as HTMLElement);
      }

    }
  }

  /**
   * Show/Hide the overlay panel
   *
   * @param {boolean} show
   * @param {boolean} onTop
   * @return {void}
   */
  public toggleOverlay(show: boolean = false, onTop: boolean = false) {

    if (onTop === true) {
      this.overlayElement.style.zIndex = '999999';
    } else {
      this.overlayElement.style.zIndex = '';
    }

    if (show === true) {
      this.overlayElement.style.display = 'block';
      return;
    }

    this.overlayElement.style.display = 'none';
  }

  /**
   * @private
   * @memberof Ch5SpinnerTemplate
   * @param {number} item
   * @return {void}
   */
  public setActiveItem(item: number): void {

    try {
      const element = this.getSelectedItem(item);

      if (element !== null) {
        this.removeActiveItemClass();
        element.classList.add(Ch5Spinner.primaryCssClass + '--active');
        this.element.selectedItem = element;
      }
    } catch (e) {
      console.error(Ch5SpinnerTemplate.ERROR.structure);
    }
  }

  /**
   * Get the selected item
   *
   * @param {number} index
   * @return {HTMLElement|null}
   */
  public getSelectedItem(index: number): HTMLElement | null {

    try {
      if (this.childrenObject !== null) {
        const element = (this.childrenObject as [HTMLElement])[index];

        if (element !== undefined && element !== null) {
          return element;
        }
      }
    } catch (e) {
      console.error(Ch5SpinnerTemplate.ERROR.structure);
    }

    return null;
  }


  public handleDefaultItemHeight(child: HTMLElement) {

    let image: HTMLElement | null = null;
    let time: number = 1;
    let label: HTMLElement | null = null;
    let count = 0;
    let itemHeight: number = 0;

    const getBoundingRect = () => {
      if (count % 8 === 0) {
        // use offsetHeight instead of clientHeight as it also includes borders
        itemHeight = (image && (image.offsetHeight || image.getBoundingClientRect().height) ||
          (label && (label.offsetHeight || label.getBoundingClientRect().height)) ||
          (child.offsetHeight || child.getBoundingClientRect().height));
      }
      count++;
    };

    time += this.element.signalValueSyncTimeout / 60;
    if (this.element.signalValueSyncTimeout > time) {
      this.toggleOverlay(true, true);
      if (child) {
        image = child.querySelector('ch5-image');

        label = child.querySelector('label');

        getBoundingRect();

        if (itemHeight > 0) {
          this.element.itemHeight = itemHeight + '';
        }
      }
    } else {
      this.toggleOverlay(false);
    }
  }

  /**
   *
   * @param {number} index
   * @param {NodeListOf<HTMLElement>} elements
   * @return {void}
   */
  public resolveId(index: number, elements: NodeListOf<HTMLElement> | [HTMLElement]): DocumentFragment | undefined {

    if (elements.length === 0) {
      return;
    }

    const documentContainer: HTMLTemplateElement = document.createElement('template');
    // @ts-ignore
    Array.from(elements).forEach((e: Element) => documentContainer.content.appendChild(e));
    if (this.element.indexId !== '') {
      // replace the placeholder for id'sd
      // replace indexId in attributes
      Ch5AugmentVarSignalsNames.replaceIndexIdInTmplElemsAttrs(documentContainer, index, this.element.indexId);
      // replace remaining Idx from content using innerHTML and replace
      Ch5AugmentVarSignalsNames.replaceIndexIdInTmplElemsContent(documentContainer, index, this.element.indexId);
    }
    return documentContainer.content;
  }

  /**
   * Check if the icon element is set
   * Used mainly when have to decide where the icon has to be placed (first|last)
   *
   * @protected
   * @memberof Ch5SpinnerTemplates
   * @return {boolean}
   */
  public iconPositioning() {

    try {

      if (this.templateElement !== null && this.templateElement.content !== undefined) {
        const icon = this.templateElement.content.querySelector('.' + Ch5Spinner.primaryCssClass + '__icon') as HTMLElement;
        const label = this.templateElement.content.querySelector('.' + Ch5Spinner.primaryCssClass + '__label') as HTMLElement;
        const iconPosition = this.element.iconPosition as string;

        if (icon !== null && label !== null) {
          if (iconPosition === 'last') {
            (label.parentNode as HTMLElement).insertBefore(icon, label.nextSibling);
          } else {
            (label.parentNode as HTMLElement).insertBefore(icon, label.previousSibling);
          }
        }
      }
    } catch (e) {
      console.error(Ch5SpinnerTemplate.ERROR.structure, e);
    }
  }

  /**
   * Append an element to the cloned items list
   *
   * @param {string} type
   * @param {number} elementIndex
   * @param {boolean} addOnTop
   * @return {void}
   */
  protected pushElementToClonedItemsList(type: string = 'append', elementIndex: number, addOnTop: boolean = false): void {

    if (this.childrenObject !== null && this.childrenObject[elementIndex] !== undefined) {
      const clonedNode = this.childrenObject[elementIndex].cloneNode(true) as HTMLElement;
      clonedNode.classList.add('cloned');
      clonedNode.style.height = this.element.itemHeight;

      if (this._clonedItems[type.toString()] === undefined) {
        this._clonedItems[type.toString()] = [clonedNode] as HTMLElement[];
        return;
      }

      if (!addOnTop) {
        this._clonedItems[type].push(clonedNode);
      } else {
        this._clonedItems[type].unshift(clonedNode);
      }
    }
  }

  /**
   * TODO: find a better way to improve item html generation
   * Create the child elements
   *
   * @param {number} index
   * @return {void}
   */
  protected invokeChildElement(index: number): void {

    const template = this.element.querySelector('template') as HTMLTemplateElement;
    // replace indexId in attributes
    // Ch5AugmentVarSignalsNames
    // .replaceIndexIdInTmplElemsAttrs(template, (index), this.element.indexId as string);
    // // replace remaining Idx from content using innerHTML and replace
    // Ch5AugmentVarSignalsNames
    //   .replaceIndexIdInTmplElemsContent(template, (index), this.element.indexId as string);

    let childrenObject: DocumentFragment = document.importNode(template.content, true);

    if (childrenObject.children.length > 0) {
      // replace the placeholder for id'sd
      const childrenObjectUpdated: DocumentFragment | undefined =
        this.resolveId(index, childrenObject.childNodes as NodeListOf<HTMLElement>);

      if (childrenObjectUpdated !== undefined) {
        childrenObject = childrenObjectUpdated;
      }

      const children = childrenObject.children[0];
      children.setAttribute('data-initial-index', String(index));
      children.setAttribute('role', 'option');

      Ch5AugmentVarSignalsNames.differentiateTmplElemsAttrs(
        children as HTMLElement,
        this.element.getAttribute("contractname") || '',
        parseInt(this.element.getAttribute("booleanjoinoffset") || '0', 10) || 0,
        parseInt(this.element.getAttribute("numericJoinOffset") || '0', 10) || 0,
        parseInt(this.element.getAttribute("stringJoinOffset") || '0', 10) || 0
      );

      this.addChild(childrenObject.children[0] as HTMLElement);
    }
  }

  /**
   * Check if a template is defined
   *
   * @protected
   * @return {void}
   */
  protected checkTemplateDefined(): void {

    if (this._element.querySelector('template') !== null) {
      this._templateDefined = true;
    }
  }

  /**
   * Generate the default template.
   *
   * @return {void}
   */
  protected addDefaultTemplate(): void {

    const template = document.createElement('template');
    const icon = document.createElement('ch5-image');
    const label = document.createElement('label');
    const wrapper = document.createElement('div');
    const fragment = document.createDocumentFragment();

    const indexId = this.element.indexId;

    icon.classList.add(Ch5Spinner.primaryCssClass + '__icon');

    if (this.element.receiveStateUrl !== '') {
      icon.setAttribute('receiveStateUrl', this.element.receiveStateUrl);
      icon.setAttribute('refreshrate', '0');
      wrapper.appendChild(icon);
    }

    label.classList.add(Ch5Spinner.primaryCssClass + '__label');

    if (this.element.receiveStateLabel !== '') {
      label.setAttribute('data-ch5-textcontent-placeholder', this.element.receiveStateLabel);
    } else {
      label.innerHTML = this.element.label;
    }

    wrapper.appendChild(label);
    fragment.appendChild(wrapper);

    template.content.appendChild(fragment);
    this._element.appendChild(template);

    this.templateElement = template;
  }

  /**
   * Clean the template tag and keep only valid elements
   *
   * @protected
   * @memberof Ch5SpinnerTemplate
   * @return {void}
   */
  protected cleanTheTemplate(): void {

    const template = this.element.querySelector('template');

    if (template !== undefined && template !== null) {
      let templateNodes = template.content.children;

      if (templateNodes.length === 0 && template.childNodes.length > 0) {
        templateNodes = template.children;
      }

      for (let i = templateNodes.length - 1; i >= 0; i--) {
        const node = templateNodes[i];

        // remove all nodes which are elements
        if (node.nodeType !== 1) {
          templateNodes[i].remove();
        }
      }
    }
  }

  /**
   * @return {void}
   */
  private removeActiveItemClass(): void {

    try {

      const childrenObject = this.childrenObject as [HTMLElement];

      for (let i = childrenObject.length - 1; i >= 0; i--) {
        const element = childrenObject[i];
        const activeClassName = Ch5Spinner.primaryCssClass + '--active';

        if (element.classList.contains(activeClassName)) {
          element.classList.remove(activeClassName);
        }
      }
    } catch (e) {
      console.error(Ch5SpinnerTemplate.ERROR.structure);
    }
  }
}
