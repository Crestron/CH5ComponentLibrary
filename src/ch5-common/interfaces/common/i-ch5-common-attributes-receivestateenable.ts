// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

/**
 * @ignore
 */
export interface ICh5CommonAttributesForReceiveStateEnable {

	/**
	 * @documentation
	 * [
	 * "`receivestateenable` attribute",
	 * "***",
	 * "When true, the boolean value of the signal determines if the component is enabled.",
	 * "Note that the signal name is provided, and the value of the signal has the opposite ",
	 * "convention of the 'disabled' attribute. This is to provide consistency with current programming practices."
	 * ]
	 * @name receivestateenable
	 * @join {"direction": "state", "isContractName": true, "booleanJoin": 1}
	 * @attributeType "Join"
	 */
	receiveStateEnable: string;

}
