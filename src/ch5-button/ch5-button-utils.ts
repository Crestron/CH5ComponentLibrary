// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5Button } from "./ch5-button";
import { Ch5ButtonMode } from "./ch5-button-mode";
import { Ch5ButtonModeState } from "./ch5-button-mode-state";
import {
	TCh5ButtonIconPosition,
	TCh5ButtonType,
	TCh5ButtonCheckboxPosition,
	TCh5ButtonHorizontalAlignLabel,
	TCh5ButtonVerticalAlignLabel,
	TCh5ButtonIconUrlFillType
} from './interfaces/t-ch5-button';

export interface ICh5ButtonExtendedProperties {
	type?: TCh5ButtonType;
	iconClass?: string;
	iconPosition?: TCh5ButtonIconPosition;
	iconUrl?: string;
	checkboxPosition?: TCh5ButtonCheckboxPosition;
	customClass?: string;
	customStyle?: string;
	hAlignLabel?: TCh5ButtonHorizontalAlignLabel;
	vAlignLabel?: TCh5ButtonVerticalAlignLabel;
	label?: string;
	labelHtml?: string;
	iconUrlFillType?: TCh5ButtonIconUrlFillType | null;
}

export class Ch5ButtonUtils {

	public static getAttributeValue<T>(thisClass: Ch5Button | Ch5ButtonMode | Ch5ButtonModeState, attributeName: string, value: T, defaultOutputValue: T): T {
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
