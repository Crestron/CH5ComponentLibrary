// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5AdvancedButton } from "./ch5-advanced-button";
import { Ch5AdvancedButtonMode } from "./ch5-advanced-button-mode";
import { Ch5AdvancedButtonModeState } from "./ch5-advanced-button-mode-state";
import {
	TCh5AdvancedButtonIconPosition,
	TCh5AdvancedButtonType,
	TCh5AdvancedButtonCheckboxPosition,
	TCh5AdvancedButtonHorizontalAlignLabel,
	TCh5AdvancedButtonVerticalAlignLabel,
	TCh5AdvancedButtonIconUrlFillType
} from './interfaces/t-ch5-advanced-button';

export interface ICh5AdvancedButtonExtendedProperties {
	type?: TCh5AdvancedButtonType;
	iconClass?: string;
	iconPosition?: TCh5AdvancedButtonIconPosition;
	iconUrl?: string;
	checkboxPosition?: TCh5AdvancedButtonCheckboxPosition;
	customClass?: string;
	customStyle?: string;
	hAlignLabel?: TCh5AdvancedButtonHorizontalAlignLabel;
	vAlignLabel?: TCh5AdvancedButtonVerticalAlignLabel;
	label?: string;
	labelHtml?: string;
	iconUrlFillType?: TCh5AdvancedButtonIconUrlFillType | null;
}

export class Ch5AdvancedButtonUtils {

	public static getAttributeValue<T>(thisClass: Ch5AdvancedButton | Ch5AdvancedButtonMode | Ch5AdvancedButtonModeState, attributeName: string, value: T, defaultOutputValue: T): T {
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
