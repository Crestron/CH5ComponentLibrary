// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import isNil from 'lodash/isNil';
import isUndefined from 'lodash/isUndefined';
import { Ch5List, ICh5ListItemInfo } from './ch5-list';
import { Ch5ListAbstractHelper } from './ch5-list-abstract-helper';
import { Ch5AugmentVarSignalsNames } from '../ch5-common/ch5-augment-var-signals-names';
import { Ch5Common } from '../ch5-common/ch5-common';
import { TAnimateCallback } from './ch5-list-animation';
import { debounce, IDebouncerDetails } from '../ch5-core/utility-functions/debounce';
import { Ch5ListSizeResolver } from './ch5-list-size-resolver';
import { TCh5ListElementOrientation } from "./interfaces";
import { elementAt } from 'rxjs/operators';

export interface ICh5ListStylesheet {
    [key: string]: any
}

export class Ch5ListTemplate extends Ch5ListAbstractHelper {

    public scrollbarSize: number = 0;

    public cachedListFullSize: number | undefined;

    /**
     * Tracks the endless attribute
     *
     * @type {boolean}
     */
    public endless: boolean = false;

    private _tmplString: string = '';
    private _scrollbarElement: HTMLElement | null = {} as HTMLElement;
    private _lastScrollbarPosition: number = 0;

    private resizeDebouncer: IDebouncerDetails = {} as IDebouncerDetails;
    public initializationTask: number | undefined;
    public resetListLayoutTask: number | undefined;

    public set scrollbarElement(element: HTMLElement | null) {
        if (element !== undefined || element !== null) {
            this._scrollbarElement = element;
        }
    }

    public get scrollbarElement(): HTMLElement | null {
        return this._scrollbarElement;
    }

    public checkForTemplate(): string {
        // check if there is a <template> element
        let tplEl;

        if (!(this._list.templateElement instanceof HTMLTemplateElement)) {
            tplEl = this._list.templateElement = this._list.getElementsByTagName('template')[0] as HTMLTemplateElement;
        } else {
            tplEl = this._list.templateElement;
        }

        let tmplString = '';

        if (tplEl && tplEl.innerHTML && tplEl.innerHTML.length > 0) { // when not used in angular
            this._list.info('ch5-list-template - tpEL.innerHtml ', tplEl.innerHTML);
            tmplString = tplEl.innerHTML;
        } else if (tplEl && tplEl.firstElementChild && tplEl.firstElementChild.outerHTML
            && tplEl.firstElementChild.outerHTML.length > 0) { // when used in angular with router
            this._list.info('ch5-list-template - tplEl.firstElementChild.outerHTML ', tplEl.firstElementChild.outerHTML);
            tmplString = tplEl.firstElementChild.outerHTML;
        }

        this._tmplString = tmplString;

        return tmplString;
    }

    public updateTemplateString(tmplString: string) {
        this._tmplString = tmplString;
    }

    /**
     * Process items (template) for each IDX
     * @param uid  = list id
     * @param index = idx increment starting from 0
     */
    public processTemplate(uid: string, index: number, templateVars: string | null): HTMLElement {
        this._list.info(`ch5-list-template - processTemplate`);

        const divTemplate = document.createElement('div');

        divTemplate.id = `${uid}_${index}`;
        divTemplate.classList.add(Ch5List.ITEMCLASS);

        // replace indexId in list item elements attributes and text content
        const documentContainer: HTMLElement = document.createElement('template');
        documentContainer.innerHTML = this._tmplString;

        if (this._list.indexId !== null) {
            // replace indexId in attributes
            Ch5AugmentVarSignalsNames
                .replaceIndexIdInTmplElemsAttrs(documentContainer, (index), this._list.indexId as string);
            // replace remaining Idx from content using innerHTML and replace
            Ch5AugmentVarSignalsNames
                .replaceIndexIdInTmplElemsContent(documentContainer, (index), this._list.indexId as string);
        }

        divTemplate.appendChild((documentContainer as HTMLTemplateElement).content);

        // replace template vars
        if (templateVars !== null && templateVars !== "") {
            const inputData = JSON.parse(templateVars);
            divTemplate.innerHTML = this.processTemplateForVars(divTemplate.innerHTML, inputData[index]);
        }

        return divTemplate as HTMLElement;
    }

    /**
     * Process css applied on list item
     */
    public listItemCSS() {
        this._list.info(`ch5-list-template - listItemCSS, process list item CSS`);
        const _orientationclass = this._list.orientation === Ch5List.ORIENTATION[0] ? '' : 'inline-block';
        const _cssWidth = this._list.itemWidth == null ? '' : this._list.itemWidth;
        const _cssHeight = this._list.itemHeight == null ? '' : this._list.itemHeight;

        return {
            display: _orientationclass,
            width: _cssWidth,
            height: _cssHeight
        }
    }

    public attachCSS() {
        this._list.info(`ch5-list-template - attachCSS`);

        const existingStyleElement = this._list.getElementsByTagName('style');
        const style: HTMLStyleElement = (existingStyleElement.length === 0)
            ? document.createElement('style')
            : existingStyleElement[0];

        if (existingStyleElement.length === 0) {
            this._list.appendChild(style);
        }

        style.innerHTML = this.prepareStyleSheet().toString();
    }

    public updateListMainElStyle() {
        this._list.info(`ch5-list-template - updateListMainElStyle`);

        let cssText: string = '';
        if (this._list.minWidth) {
            cssText += `min-width: ${this._list.minWidth};`;
        }
        if (this._list.maxWidth) {
            cssText += `max-width: ${this._list.maxWidth};`;
        }
        if (this._list.minHeight) {
            cssText += `min-height: ${this._list.minHeight};`;
        }
        if (this._list.maxHeight) {
            cssText += `max-height: ${this._list.maxHeight};`;
        }
        if (cssText) {
            this._list.style.cssText = cssText;
        }
    }

    /**
     * Resize the list to specified value
     */
    public resizeList(element: HTMLElement, templateVars: string | null, resize: boolean = false): void {
        this._list.info('ch5-list-template - resizeList()');

        this._list.animationHelper.minOffsetTranslate = 0;

        if (
            this._list.isHorizontal
            && !isNaN(this._list.currentXPosition)
            && this._list.getItemSize() > 0
        ) {
            this._list.currentXPosition = this.computeItemLocation(this._list.currentXPosition);
            this.setWrapperTranslateX(this._list.currentXPosition);
            this.updateScrollBarPosition(this._list.currentXPosition);
        } else if (
            !this._list.isHorizontal
            && !isNaN(this._list.currentYPosition)
            && this._list.getItemSize() > 0
        ) {
            this._list.currentYPosition = this.computeItemLocation(this._list.currentYPosition);
            this.setWrapperTranslateY(this._list.currentYPosition);
            this.updateScrollBarPosition(this._list.currentYPosition);
        }

        // Resize the list from initial size
        const uid = this._list.getCrId();

        const _scrollbarClassName = this._list.orientation === Ch5List.ORIENTATION[0] ? 'ch5-list-vertical-scrollbar' : 'ch5-list-horizontal-scrollbar';
        const _scrollOrientationClassName = this._list.orientation === Ch5List.ORIENTATION[0] ? 'ch5-list-vertical' : 'ch5-list-horizontal';
        const _scrollbarClass = this._list.scrollbar === true ? _scrollbarClassName : '';

        element.id = uid;

        element.className = `${_scrollbarClass} ${_scrollOrientationClassName}`;

        // append divList to be able to get BoundingClientRect
        if (isNil(element.parentElement)) {
            this._list.appendChild(element);
        }

        if (this._list.size === 0) {
            return;
        }

        // add first item then, if needed, calculate item height and width
        // this.initListMaxWidthAndHeight();
        // style contains item size properties, we need to attach the style here
        // for better firstItem size related operations
        this.attachCSS();
        this.updateListMainElStyle();
        this.checkAndSetSizes();

        if (!resize) {
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }

            // firstRenderVisibleItemsNr = size or a computed number based on bufferAmount
            // it's value will be cached
            element.appendChild(this.processTemplate(uid, 0, templateVars));
            const firstRenderVisibleItemsNr = this._list.getFirstRenderVisibleItemsNr(true);
            this._list._appendPosition = firstRenderVisibleItemsNr;

            const listFragment = document.createDocumentFragment();

            // continue elements rendering starting with next item (index: 1)
            for (let index = 1; index < firstRenderVisibleItemsNr; index++) {
                listFragment.appendChild(this.processTemplate(uid, index, templateVars));
            }

            element.appendChild(listFragment);

            // update first buffered elements
            this._list._bufferedItems.bufferActive = this._list._canUseBufferAmount(firstRenderVisibleItemsNr);
            if (this._list._bufferedItems.bufferActive) {
                // orig: this._list._bufferedItems.bufferForwardStartIndex = firstRenderVisibleItemsNr + 1;
                this._list._bufferedItems.bufferForwardStartIndex = firstRenderVisibleItemsNr;
                // always init bufferBackwardsStartIndex, even list is not endless
                // we need this when buffered items are created
                if (this._list.size !== null) {
                    // orig: this._list._bufferedItems.bufferBackwardsStartIndex = Number(this._list.size);
                    this._list._bufferedItems.bufferBackwardsStartIndex = Number(this._list.size);
                }

            }
            this._list.bufferdItemsHelper.bufferItems();
        } else {
            this._list.items = this._list.items.map((elData: ICh5ListItemInfo) => {
                elData.element.style.transform = '';
                return { ...elData, translateX: 0, translateY: 0 }
            });
        }


        // TODO: maybe change the name and location. This is only a prototype version
        this._list.onResizeList();

        if (this._list.scrollbar !== false) {
            const newScrollbarPosition = this._list.isHorizontal
                ? this._list.currentXPosition
                : (this._list.currentYPosition - this.scrollbarSize);
            this.updateScrollBarPosition(newScrollbarPosition);
        }

        this._list.previousSize = this._list.size;

        const elements = this._list.items.map((itemInfo) => itemInfo.element);

        const viewport = {
            width: this._list.viewportClientWidth,
            height: this._list.viewportClientHeight,
        }

        this._list.sizeResolver = new Ch5ListSizeResolver(
            elements,
            this._list.orientation as TCh5ListElementOrientation,
        );

        clearTimeout(this.initializationTask);

        this.initializationTask = window.setTimeout(() => {

            this._list.sizeResolver.updateViewport(this._list);
            this.customScrollbar(element);

            const { fullListSize, viewPortSize } = this._list.sizeResolver;

            this._list.animationHelper.maxOffsetTranslate = undefined;

            if (this._list.endless || fullListSize <= viewPortSize) {
                return;
            }
        });

    }

    public resetListLayout() {
        clearTimeout(this.resetListLayoutTask);

        this.resetListLayoutTask = window.setTimeout(() => {

            if (!(this._list.sizeResolver instanceof Ch5ListSizeResolver)) {
                clearTimeout(this.resetListLayoutTask);
                return;
            }

            this.checkAndSetSizes();
            this._list.sizeResolver.updateViewport(this._list);

            this.resetItemsTransform()

            this._list.items.sort((listElement, nextListElement) => listElement.layoutIndex - nextListElement.layoutIndex);

            if (this._list.endless) {
                this._list.animationHelper.stop();
            }

            this._list.animationHelper.minOffsetTranslate = 0;
            this._list.animationHelper.maxOffsetTranslate = -this._list.sizeResolver.hiddenListSize;

            if (this._list.isHorizontal) {
                this._list.currentXPosition = this._list.currentXPosition % this._list.sizeResolver.fullListSize;
            } else {
                this._list.currentYPosition = this._list.currentYPosition % this._list.sizeResolver.fullListSize;
            }

            if (this.isPositionExceedingMaximumBoundary()) {
                if (this._list.isHorizontal) {
                    this._list.currentXPosition = this._list.animationHelper.maxOffsetTranslate;
                } else {
                    this._list.currentYPosition = this._list.animationHelper.maxOffsetTranslate;
                }
            }

            if (this._list.sizeResolver.viewPortSize > 0) {
                this._list.templateHelper.customScrollbar(this._list.divList);
            }

            const axisPosition = this._list.isHorizontal ? this._list.currentXPosition : this._list.currentYPosition;

            this._list.templateHelper.updateScrollBarPosition(axisPosition);
            this._list.animationHelper.updateDragPosition(axisPosition);

            const { fullListSize, viewPortSize } = this._list.sizeResolver;

            if (fullListSize > 0 && viewPortSize > 0 && fullListSize <= viewPortSize) {
                this.resetItemsTransform();
            }

            const isBufferAmount = !isNil(this._list.bufferAmount);

            if (fullListSize <= viewPortSize) {
                this._list.setCurrentPosition(0);
                this._list.templateHelper.setWrapperTranslateX(0);
                this._list.templateHelper.setWrapperTranslateY(0);
                return;
            }

            if (this._list.endless) {
                return;
            }

            this._list.animationHelper.maxOffsetTranslate = this._list.animationHelper.adjustMaxOffset(isBufferAmount);

            if (this._list.animationHelper.maxOffsetTranslate) {
                let position = this._list.isHorizontal ? this._list.currentXPosition : this._list.currentYPosition;

                if (position < this._list.animationHelper.maxOffsetTranslate) {
                    position = this._list.animationHelper.maxOffsetTranslate;

                    this._list.animationHelper.updateDragPosition(position);
                }
            }
        });
    }

    /**
     * Method called when list min/max width and height are updated.
     * resizingInProgress flag was added to avoid running resizeList multiple times
     */
    public triggerResizeDueWidthAndHeightUpdates(): void {
        // make sure resizeList is executed just once even the current method
        // is called on every min/max width/height update
        debounce(this.resizeDebouncer, () => {
            this.updateListMainElStyle();
            this.checkAndSetSizes();
            this.customScrollbar(this._list.divList);
        });
    }

    /**
     * Removing the scrollbar element
     */
    public removeScrollbar(): void {

        if (this._scrollbarElement !== null && this._scrollbarElement instanceof HTMLElement) {

            // remove the scrollbar container
            if (this._scrollbarElement.parentElement !== null) {
                this._scrollbarElement.parentElement.remove();
            }

            // remove the scrollbar pointer
            this._scrollbarElement.remove();
            this._scrollbarElement = null;
        }
    }


    public customScrollbar(additionalElement: HTMLElement) {

        this.createScrollbar();

        if (
            this._list.scrollbar &&
            this._list.size !== null &&
            additionalElement !== undefined &&
            additionalElement.children !== undefined &&
            this._scrollbarElement &&
            this._scrollbarElement.parentElement !== undefined
        ) {

            const layoutInfo = this._list.getLayoutInfo();

            const listSize = layoutInfo.fullListSize;
            const container = (this._scrollbarElement as HTMLElement).parentElement;
            const event = new Event('scroll');
            const scroll = this._scrollbarElement;

            const containerSize = layoutInfo.viewPortSize;

            if (container !== null && layoutInfo.fullListSize <= layoutInfo.viewPortSize) {
                (container as HTMLElement).remove();
                this._scrollbarElement = null;
                return;
            }

            const relativeScrollSize = Math.ceil((containerSize / listSize) * 100) as number;

            if (scroll !== undefined) {
                (container as HTMLElement).addEventListener('scroll', () => {
                    if (scroll.style !== undefined && container) {
                        /**
                         * container represents the scroll wrapper element
                         * if relativeScrollSize === 100 it means the scroll is 100% and is not needed => scroll is hidden
                         */
                        if (relativeScrollSize === 100) {
                            container.style.display = 'none';
                        } else {
                            container.style.display = 'block';
                        }
                        if (this._list.isHorizontal) {
                            (scroll as HTMLElement).style.width = relativeScrollSize + "%";
                        } else {
                            (scroll as HTMLElement).style.height = relativeScrollSize + "%";
                        }
                    }
                });

                this.scrollbarSize = this._list.isHorizontal ? (relativeScrollSize / 100) * containerSize : (relativeScrollSize / 100) * containerSize;

                window.addEventListener('resize', (container as HTMLElement).dispatchEvent.bind(container, event));
                (container as HTMLElement).dispatchEvent(event);
            }
        } else {
            this.removeScrollbar();
        }
    }

    /**
     * Update scrollbar position
     *
     * @param newPosition
     */
    public updateScrollBarPosition(newPosition: number, animate?: TAnimateCallback): void {
        if (this._list.size !== null) {

            const layoutInfo = this._list.getLayoutInfo()
            const containerSize = layoutInfo.viewPortSize;
            const fullListSize = layoutInfo.fullListSize

            // used to extract scrollbar size from containerSize if it is endless
            let divListSize = layoutInfo.viewPortSize;

            if (this._list.endless) {
                divListSize = divListSize - this.scrollbarSize;
            }

            const maxScrollbarRightOffset = containerSize;
            let pxScrollPosition = this.getRelativeScrollbarPosition(newPosition, fullListSize, divListSize);
            let negativeCurrentPosition = -pxScrollPosition;

            if (pxScrollPosition < 0 && Math.abs(pxScrollPosition) > maxScrollbarRightOffset) {
                pxScrollPosition = negativeCurrentPosition = 0;
            }

            if (this.scrollbarElement instanceof HTMLElement) {
                if (animate === undefined) {
                    if (this._list.isHorizontal) {
                        if (this._list.direction === Ch5Common.DIRECTION[1]) {
                            this.scrollbarElement.style.transform = `translate3d(${-negativeCurrentPosition}px, 0, 0)`;
                        }
                        this.scrollbarElement.style.transform = `translate3d(${negativeCurrentPosition}px, 0, 0)`;
                    } else {
                        this.scrollbarElement.style.transform = `translate3d(0, ${negativeCurrentPosition}px, 0)`;
                    }
                } else {
                    const orientation = this._list.isHorizontal ? Ch5List.ORIENTATION[1] : Ch5List.ORIENTATION[0];
                    animate(this.scrollbarElement, negativeCurrentPosition, orientation, -this._lastScrollbarPosition);
                }
            }

            this._lastScrollbarPosition = pxScrollPosition;
        }
    }

    /**
     * Updates the wrapper's translateX property (ie. shows a different view).
     * @param {number} tx The value (in px) for the wrapper's translateX property.
     */
    public setWrapperTranslateX(tx: number, animate?: TAnimateCallback) {
        if (!isNil(this._list)) {
            if (animate === undefined) {
                this._list.divList.style.transform = `translate3d(${tx}px, 0, 0)`
                this._list.wrapperTranslateX = tx;
            } else {
                animate(this._list.divList, tx, Ch5List.ORIENTATION[1], this._list.wrapperTranslateX);
                this._list.wrapperTranslateX = tx;
            }
        }
    }

    /**
     * Updates the wrapper's translateY property (ie. shows a different view).
     * @param {number} ty The value (in px) for the wrapper's translateX property.
     */
    public setWrapperTranslateY(ty: number, animate?: TAnimateCallback) {
        if (!isNil(this._list)) {
            if (animate === undefined) {
                this._list.wrapperTranslateY = ty;
                this._list.divList.style.transform = `translate3d(0, ${ty}px, 0)`
            } else {
                animate(this._list.divList, ty, Ch5List.ORIENTATION[0], this._list.wrapperTranslateY);
                this._list.wrapperTranslateY = ty;
            }
        }
    }

    public setItemTranslateX(tx: number, item: ICh5ListItemInfo) {
        if (!isNil(item)) {
            item.translateX = tx;
            item.element.style.transform = `translateX(${item.translateX}px)`;
        }
    }

    public setItemTranslateY(ty: number, item: ICh5ListItemInfo) {
        if (!isNil(item)) {
            item.translateY = ty;
            item.element.style.transform = `translateY(${item.translateY}px)`;
        }
    }

    /**
     * Get the current page
     *
     * @param {number} coord
     * @param {number} start
     * @param {number} end
     * @return {number}
     */
    public computePage(coord: number, start?: number, end?: number): number {

        const itemSize = this._list.getItemSize();
        // need only the visible items per page to calculate the next page
        // starting point
        // if the last element of a page is not fully visible, that would be the
        // starting point of the next page
        const pageSize = itemSize * this._list.getVisibleItemsPerPage();
        let directionDiff = 0;
        let currentPage = this._list.currentPage;

        if (Math.abs(coord) <= 0) {
            return currentPage;
        }

        if (!isNil(start) && !isNil(end)) {
            directionDiff = Math.abs(start) - Math.abs(end);
        }

        if (coord < 0) {
            if (!isNil(start) && !isNil(end) && directionDiff < 0) {
                this._list.currentPage = currentPage = Math.floor(coord / pageSize);
            } else {
                this._list.currentPage = currentPage = Math.ceil(coord / pageSize);
            }
        } else {
            if (!isNil(start) && !isNil(end) && directionDiff < 0) {
                this._list.currentPage = currentPage = Math.ceil(coord / pageSize);
            } else {
                this._list.currentPage = currentPage = Math.floor(coord / pageSize);
            }
        }

        return currentPage;
    }

    public checkAndSetSizes(): void {
        if (this._list.divList.childElementCount > 0) {
            const divListSizeDetails: ClientRect | DOMRect = this._list.divList.getBoundingClientRect();
            const firstItem = this._list.divList.children[0] as HTMLElement;

            this._list.divListWidth = divListSizeDetails.width;
            this._list.divListHeight = divListSizeDetails.height;
            this.updateViewportSize();

            setTimeout(() => {
                // setting the list offset and client sizes
                // use offsetWidth and offsetHeight to include borders
                this._list.itemOffsetHeight = firstItem.offsetHeight;
                this._list.itemOffsetWidth = firstItem.offsetWidth;
                this._list.divListWidth = divListSizeDetails.width;
                this._list.divListHeight = divListSizeDetails.height;

                if (this._list.sizeResolver.fullListSize > this._list.sizeResolver.viewPortSize) {
                    this._list.style.width = '100%';
                }

                this.updateViewportSize();
            });

            if (firstItem instanceof HTMLElement) {
                this._list.itemOffsetHeight = firstItem.offsetHeight;
                this._list.itemOffsetWidth = firstItem.offsetWidth;
            }

            this._list.storedOffsetWidth = this._list.offsetWidth;
            this._list.storedOffsetHeight = this._list.offsetHeight;
        }
    }

    /**
     * Updates the viewport size
     *
     * @param {number} viewportSize specified value for viewportsize
     */
    public updateViewportSize(viewportSize: number = 0) {

        if (!viewportSize) {
            const listViewportBoundingRect: ClientRect | DOMRect = this._list.getBoundingClientRect();
            viewportSize = this._list.isHorizontal ? listViewportBoundingRect.width : listViewportBoundingRect.height;
        }

        if (!this._list.isHorizontal) {
            this._list.viewportClientHeight = viewportSize;
            return;
        }

        this._list.viewportClientWidth = viewportSize;
    }

    /**
     * Resolve the endless list when the number of items visible in the list
     * is the same as the list size. Then is not need the list to be endless.
     *
     * @return {void}
     */
    public resolveEndlessViewportSize(): void {


        if (!this.endless) {
            return;
        }

        const itemsPerPage = this._list.sizeResolver.getItemsPerPage();
        const listSize = this._list.size;

        if (Math.floor(itemsPerPage) === listSize) {
            this._list.endless = false;
        } else {
            this._list.endless = true;
        }
    }

    private resetItemsTransform() {
        this._list.items = this._list.items.map((elData: ICh5ListItemInfo) => {
            elData.element.style.transform = 'translate3d(0,0,0)';
            return { ...elData, translateX: 0, translateY: 0 };
        });
    }

    private isPositionExceedingMaximumBoundary() {

        if (!this._list.animationHelper) {
            return false;
        }

        const { maxOffsetTranslate } = this._list.animationHelper;
        const { currentYPosition, currentXPosition, isHorizontal } = this._list;

        if (!maxOffsetTranslate) {
            return false;
        }

        if (this._list && this._list.isLtr()) {
            if (
                (isHorizontal && currentXPosition < maxOffsetTranslate)
                || (!isHorizontal && currentYPosition < maxOffsetTranslate)
            ) {
                return true;
            }
        } else {
            if (
                (isHorizontal && currentXPosition > maxOffsetTranslate)
                || (!isHorizontal && currentYPosition > maxOffsetTranslate)
            ) {
                return true;
            };
        }

        return false;
    }

    /**
     * Getting the relative (% in percentage) scrollbar position
     *
     * @param {number} position
     * @param {number} listSize
     * @param {number} viewPortsize
     * @return {number}
     */
    private getRelativeScrollbarPosition(position: number, listSize: number, viewPortsize: number): number {
        let percentageScrollPosition = (position / listSize * 100) % 100;
        let pxScrollPosition;
        let direction = 1;

        // horizontal rtl needs special handling; all other cases are the same
        if ((this._list.isVertical || this._list.direction === Ch5Common.DIRECTION[0]) && position > 0) {
            percentageScrollPosition = 100 - percentageScrollPosition;
            direction = -1;
        }

        if (this._list.isHorizontal && this._list.direction === Ch5Common.DIRECTION[1] && position < 0) {
            percentageScrollPosition = 100 + percentageScrollPosition;
        }
        pxScrollPosition = Math.round(percentageScrollPosition / 100 * viewPortsize) * direction;

        return pxScrollPosition;
    }

    /**
     * Used when the list is in endless mode
     * to compute the original position of the list
     *
     * @param {number} currentListPosition
     * @return {number}
     */
    private computeItemLocation(currentListPosition: number): number {

        const currentPosition = this._list.isHorizontal ? this._list.currentXPosition : this._list.currentYPosition;
        const listContainerSize = this._list.previousSize! * this._list.getItemSize();
        let initialListPosition = currentPosition % listContainerSize;

        if (currentListPosition > 0) {
            initialListPosition = listContainerSize - currentPosition;
        }

        // The initial list position is always lower or equal than 0
        initialListPosition = initialListPosition <= 0 ? initialListPosition : -initialListPosition;

        return initialListPosition;
    }

    private processTemplateForVars(template: string, currentVars: object): string {
        // tslint:disable-next-line:forin
        for (const key in currentVars) {
            const strReplace = `{{${key}}}`;
            const replaceWith = (currentVars as any)[key];
            template = this.textReplace(template, strReplace, replaceWith, true);
        }

        return template;
    }

    // tslint:disable-next-line:member-ordering
    private textReplace(fullText: string, toReplace: string, replaceWith: string, replaceGlobal: boolean) {
        let result = "";
        if (fullText !== null && fullText !== undefined) {
            if (replaceGlobal === true) {
                result = fullText.replace(new RegExp(toReplace, 'g'), replaceWith);
            } else {
                result = fullText.replace(new RegExp(toReplace), replaceWith);
            }
        }
        return result;
    }

    /**
     * Create scrollbar element
     */
    private createScrollbar(): void {

        if (this._scrollbarElement instanceof HTMLElement) {
            this.removeScrollbar();
        }

        const _scrollbarContainer = document.createElement('div');
        const listPosition = this._list.isHorizontal ? this._list.currentXPosition : this._list.currentYPosition;

        this._scrollbarElement = document.createElement('div');
        this._scrollbarElement.classList.add('scrollbar');

        _scrollbarContainer.classList.add('scrollbar-container');
        _scrollbarContainer.appendChild(this._scrollbarElement);

        this._list.appendChild(_scrollbarContainer);
        this.updateScrollBarPosition(listPosition);
    }

    private prepareStyleSheet() {

        const stylesheet: ICh5ListStylesheet = {
            [`#${this._list.getCrId()}`]: {
                'white-space': this._list.orientation === Ch5List.ORIENTATION[0] ? 'none' : 'nowrap',
                'will-change': 'transform',
                'transition': 'height .3s ease-out'
            },

            [`#${this._list.getCrId()} .${Ch5List.ITEMCLASS}`]: {
                ...this.listItemCSS()
            }
        };

        return {
            toString: () => {
                let _stylesheet = '';

                for (const element in stylesheet) {
                    if (stylesheet.hasOwnProperty(element)) {
                        _stylesheet += ` ${element}{`;

                        for (const property in stylesheet[element]) {
                            if (stylesheet[element].hasOwnProperty(property)) {
                                let propertyValue = stylesheet[element][property];

                                if (!isNil(propertyValue) && propertyValue !== '') {
                                    propertyValue = propertyValue.trim();
                                    _stylesheet += `${property}: ${propertyValue};`;
                                }
                            }
                        }

                        _stylesheet += '}';
                    }
                }

                return _stylesheet;
            }
        }
    }

    private initListMaxWidthAndHeight() {
        if (!this._list.maxWidth) {
            this._list.maxWidth = '100%';
        }

        if (!this._list.maxHeight) {
            this._list.maxHeight = '100%';
        }
    }
}
