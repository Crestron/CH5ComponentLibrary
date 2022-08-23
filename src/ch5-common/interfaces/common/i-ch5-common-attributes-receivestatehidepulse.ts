// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

/**
 * @ignore
 */
export interface ICh5CommonAttributesForReceiveStateHidePulse {

	/**
	 * @documentation
	 * [
	 * "`receivestatehidepulse` attribute",
	 * "***",
	 * "on transition from false to true, this signal will direct if the component is no longer visible."
	 * ]
	 * @name receivestatehidepulse
	 * @join {"direction": "state", "isContractName": true, "booleanJoin": 1}
	 * @attributeType "Join"
	 */
	receiveStateHidePulse: string;

}
