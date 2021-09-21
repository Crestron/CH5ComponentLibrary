// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5ButtonBase } from "../ch5-button/ch5-button-base";

export class Ch5SliderRightButton extends Ch5ButtonBase {

	constructor() {
		super();
	}

	public connectedCallback() {
		super.connectedCallback();

		// preset attributes
		// this.type = "danger";
		// this.size = "regular";
	}

	public static get observedAttributes() {
		const availableAttributes: string[] = [
			'customclass',
			'customstyle',
			'show',
			'noshowtype',
			'disabled',
			'debug',
			'trace',
			'dir',

			'label',

			'iconclass',
			'iconposition',
			'orientation',
			'iconurl',

			'halignlabel',
			'valignlabel',

			'shape',
			'type',

			'selected',
			'customclassselected',
			'customclasspressed',
			'customclassdisabled',

			'receivestateenable',
			'receivestateselected',
			'receivestatelabel',
			'receivestatescriptlabelhtml',
			'receivestateiconclass',
			'receivestateiconurl',
			'receivestatetype',

			'sendeventonclick',
			'sendeventontouch'
		];

		return availableAttributes;
	}

}

if (typeof window === "object"
	&& typeof window.customElements === "object"
	&& typeof window.customElements.define === "function") {

	window.customElements.define('ch5-slider-right-button', Ch5SliderRightButton);
}
