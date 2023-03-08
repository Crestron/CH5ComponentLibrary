// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5Signal, Ch5SignalFactory } from "../ch5-core";

export class CH5DpadUtils {

	// the join number is applied to the up button, join+1 applies to down,
	// join+2 applies to left, join+3 applies to right, join+4 to center
	public static readonly sendEventOnClickSigCountToAdd = {
		up: 0,
		down: 1,
		left: 2,
		right: 3,
		center: 4
	};

	public static readonly contractSuffix = {
		up: 'Up',
		down: 'Down',
		left: 'Left',
		right: 'Right',
		center: 'Center'
	};


	/**
	 * Function to return a 'span' tag to be placed as icon for dpad child btn
	 * @param imageUrl image url for icon
	 * @returns HTMLElement, a 'span' tag
	 */
	public static getImageContainer(imageUrl: string) {
		const retEle = document.createElement('span');
		retEle.classList.add('dpad-btn-icon');
		retEle.classList.add('image-url');
		retEle.setAttribute('data-img-url', imageUrl);
		return retEle;
	}

	/**
	 * Function to return an 'i' tag to be placed as icon for dpad child btn
	 * @param iconClass icon class for icon
	 * @returns HTMLElement, a 'i' tag
	 */
	public static getIconContainer() {
		const retEle = document.createElement('span');
		retEle.classList.add('dpad-btn-icon');
		// retEle.classList.add('icon-class');
		retEle.classList.add('fas');
		return retEle;
	}

	/**
	 * Function to return an 'span' tag to be placed as label for dpad child btn
	 * @param labelInput label instead of icon
	 * @returns HTMLElement, a 'span' tag
	 */
	public static getLabelContainer(labelClassName: string) {
		const retEle = document.createElement('span');
		retEle.classList.add(labelClassName);
		return retEle;
	}

	public static createIconTag(thisRef: any) {
		if (thisRef._icon.classList === undefined || thisRef._icon.classList.length <= 0) {
			thisRef._icon = document.createElement('span');
		}
	}
}