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
	public type: TCh5ButtonType | null = null;
	public iconClass: string | null = null;
	public iconPosition: TCh5ButtonIconPosition | null = null;
	public iconUrl: string | null = null;
	public checkboxPosition: TCh5ButtonCheckboxPosition | null = null;
	public customClass: string | null = null;
	public customStyle: string | null = null;
	public hAlignLabel: TCh5ButtonHorizontalAlignLabel | null = null;
	public vAlignLabel: TCh5ButtonVerticalAlignLabel | null = null;
	public label: string | null = null;
}
