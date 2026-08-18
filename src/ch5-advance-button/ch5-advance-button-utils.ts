// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5AdvanceButton } from "./ch5-advance-button";
import { Ch5AdvanceButtonMode } from "./ch5-advance-button-mode";
import { Ch5AdvanceButtonModeState } from "./ch5-advance-button-mode-state";
import {
	TCh5AdvanceButtonIconPosition,
	TCh5AdvanceButtonType,
	TCh5AdvanceButtonCheckboxPosition,
	TCh5AdvanceButtonHorizontalAlignLabel,
	TCh5AdvanceButtonVerticalAlignLabel,
	TCh5AdvanceButtonIconUrlFillType
} from './interfaces/t-ch5-advance-button';

export interface ICh5AdvanceButtonExtendedProperties {
	type?: TCh5AdvanceButtonType;
	iconClass?: string;
	iconPosition?: TCh5AdvanceButtonIconPosition;
	iconUrl?: string;
	checkboxPosition?: TCh5AdvanceButtonCheckboxPosition;
	customClass?: string;
	customStyle?: string;
	hAlignLabel?: TCh5AdvanceButtonHorizontalAlignLabel;
	vAlignLabel?: TCh5AdvanceButtonVerticalAlignLabel;
	label?: string;
	labelHtml?: string;
	iconUrlFillType?: TCh5AdvanceButtonIconUrlFillType | null;
}

export class Ch5AdvanceButtonUtils {

	public static getAttributeValue<T>(thisClass: Ch5AdvanceButton | Ch5AdvanceButtonMode | Ch5AdvanceButtonModeState, attributeName: string, value: T, defaultOutputValue: T): T {
		if (thisClass.hasAttribute(attributeName.toString().toLowerCase())) {
			return value as T;
		} else {
			return defaultOutputValue as T;
			// 	return JSON.parse("") as T; // To Pass string as T
		}
	}

	public static getValidInputValue<T>(masterData: T[], value: T): T {
		if (masterData.indexOf(value) >= 0) {
			return value;
		} else {
			return masterData[0];
		}
	}

}
