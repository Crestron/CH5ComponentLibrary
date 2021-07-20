// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import {
	TCh5ButtonIconPosition,
	TCh5ButtonType,
	TCh5ButtonCheckboxPosition,
	TCh5ButtonHorizontalAlignLabel,
	TCh5ButtonVerticalAlignLabel
} from './interfaces/t-ch5-button';

export class Ch5ButtonExtendedProperties {
	type: TCh5ButtonType | null = null;
	iconClass: string | null = null;
	iconPosition: TCh5ButtonIconPosition | null = null;
	iconUrl: string | null = null;
	checkboxPosition: TCh5ButtonCheckboxPosition | null = null;
	customClass: string | null = null;
	customStyle: string | null = null;
	hAlignLabel: TCh5ButtonHorizontalAlignLabel | null = null;
	vAlignLabel: TCh5ButtonVerticalAlignLabel | null = null;
	label: string | null = null;
}
