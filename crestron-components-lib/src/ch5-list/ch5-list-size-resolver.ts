/*
 * Copyright (C) 2018 to the present, Crestron Electronics, Inc.
 * All rights reserved.
 * No part of this software may be reproduced in any form, machine
 * or natural, without the express written consent of Crestron Electronics.
 * Use of this source code is subject to the terms of the Crestron Software License Agreement
 * under which you licensed this source code.
 */

import { TCh5ListElementOrientation } from "../_interfaces/ch5-list/types";


export class Ch5ListSizeResolver {

  /**
   * Contains the list elements
   * @public
   */
  public elements: HTMLElement[] = [] as HTMLElement[];

  /**
   * The viewport size ( width or height, depends on orientation )
   * @public
   */
  public viewPortSize: number = 0;

  /**
   * The entire list size
   * @public
   */
  public fullListSize: number = 0;

  /**
   * Size of the hidden list
   * @public
   */
  public hiddenListSize: number = 0;

  /**
   * The list orientation
   * @public
   */
  public orientation: TCh5ListElementOrientation = 'horizontal';


  constructor(
    elements: HTMLElement[],
    orientation: TCh5ListElementOrientation,
  ) {
    this.elements = Array.from(elements);
    this.orientation = orientation;

    this.init();
  }

  /**
   * This method get the number of items in a page
   *
   * @return the items per page
   */
  public getItemsPerPage(): number {
    let sizeAccumulator = 0;

    let numberOfVisibleItems = Array.from(this.elements).reduce((acc, curr) => {
      if (sizeAccumulator <= this.viewPortSize) {
        sizeAccumulator += this.getElementSize(curr);
        return ++acc;
      } else {
        return acc;
      }
    }, 0);

    numberOfVisibleItems = numberOfVisibleItems - 1;

    return numberOfVisibleItems;
  }

  /**
   * Get the size of the total list
   * Each item of the list should be iterated in order to get the real size
   * of the list.
   *
   * @return the entire list size
   */
  public getTotalSize(): number {
    const sizeOfVisibleItems = Array.from(this.elements).reduce(
      (acc, curr) => acc + this.getElementSize(curr),
      0
    );

    return sizeOfVisibleItems;
  }

  /**
   * Get the size of the hidden list
   *
   * @return the hidden list size
   */
  public getOverflowSize(): number {
    const visibleItemsPerPage = this.getTotalSize();
    return visibleItemsPerPage - this.viewPortSize;
  }

  /**
   * Get the size of the entire list
   *
   * @return the full list size
   */
  public getFullSize(): number {
    return this.viewPortSize + this.getOverflowSize();
  }


  /**
   * This method can be called to update the viewport size if is the
   * subject to change
   * This will update the size of the hidden and full list too
   *
   * @param {HTMLElement} viewport
   */
  public updateViewport(viewport: HTMLElement): void {
    const boundingClientRect = viewport.getBoundingClientRect();
    if (this.orientation === 'horizontal') {
      this.viewPortSize = boundingClientRect.width;
    } else {
      this.viewPortSize = boundingClientRect.height;
    }

    this.fullListSize = this.getFullSize();
    this.hiddenListSize = this.getOverflowSize();
  }

  private init() {
    this.fullListSize = this.getFullSize();
    this.hiddenListSize = this.getOverflowSize();
  }

  /**
   * Get a specific element size depending on the orientation
   *
   * @param {HTMLElement} element
   * @return the offsetWidth/offsetHeight of the element
   */
  private getElementSize(element: HTMLElement) {
    if (this.orientation === 'horizontal') {
      return element.offsetWidth;
    }

    return element.offsetHeight;
  }
}
