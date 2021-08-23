// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5ButtonBase } from "../ch5-button/ch5-button-base";

export class Ch5SliderLeftButton extends Ch5ButtonBase {

	constructor() {
		super();
	}
	
}

if (typeof window === "object"
	&& typeof window.customElements === "object"
	&& typeof window.customElements.define === "function") {

	window.customElements.define('ch5-slider-left-button', Ch5SliderLeftButton);
}
