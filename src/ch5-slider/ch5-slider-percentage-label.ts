// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5SliderLabelBase } from "./ch5-slider-label-base";

export class Ch5SliderPercentageLabel extends Ch5SliderLabelBase {

	constructor() {
		super();
	}

	public connectedCallback() {
		super.connectedCallback();
	}

}

if (typeof window === "object"
	&& typeof window.customElements === "object"
	&& typeof window.customElements.define === "function") {

	window.customElements.define('ch5-slider-percentage-label', Ch5SliderPercentageLabel);
}
