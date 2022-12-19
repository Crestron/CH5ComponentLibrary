// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

/**
 * @ignore
 */
export interface ICh5CommonAttributesForCustomClass {

	/**
	 * @documentation
	 * [
	 * "`customclass` attribute",
	 * "***",
	 * "Contains a list of space delimited CSS classes that are applied on the component"
	 * ]
	 * @name customclass
	 * @hideWhen [
	 *  {"receiveStateCustomClass": ["true"] }
	 * ]
	 * @attributeType "String"
	 */
	customClass: string;
	
}
