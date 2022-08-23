// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { TCh5ShowType } from "./../t-ch5-common";

/**
 * @ignore
 */
export interface ICh5CommonAttributesForNoShowType {

	/**
	 * @documentation
	 * [
	 * "`noshowtype` attribute",
	 * "***",
	 * "This property reflects the type of the visibility of the item. See the 'data-ch5-noshow-type' ",
	 * "custom HTML attribute for further information."
	 * ]
	 * @name noshowtype
	 * @attributeType "String"
	 */
	noshowType: TCh5ShowType;

}
