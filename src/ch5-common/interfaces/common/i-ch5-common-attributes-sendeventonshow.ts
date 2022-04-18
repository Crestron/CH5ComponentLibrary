// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

/**
 * @ignore
 */
export interface ICh5CommonAttributesForSendEventOnShow {

	/**
	 * @documentation
	 * [
	 * "`sendeventonshow` attribute",
	 * "***",
	 * "Has a boolean value of true when the component is visible and false when not visible.",
	 * "Note that even if component is completely covered by other visible elements, it is still considered visible."
	 * ]
	 * @name sendeventonshow
	 * @join {"direction": "event", "isContractName": true, "booleanJoin": 1}
	 * @attributeType "Join"
	 */
	sendEventOnShow: string;

}
