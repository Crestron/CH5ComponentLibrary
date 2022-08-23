// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

/**
 * @ignore
 */
export interface ICh5CommonAttributesForReceiveStateCustomStyle {

	/**
	 * @documentation
	 * [
	 * "`receivestatecustomstyle` attribute",
	 * "***",
	 * "The value of this signal will be applied as an equivalent property on 'styleClass'.",
	 * "The change of value will remove the prior value and apply the new value."
	 * ]
	 * @name receivestatecustomstyle
	 * @join {"direction": "state", "isContractName": true, "stringJoin": 1}
	 * @attributeType "Join"
	 */
	receiveStateCustomStyle: string;

}
