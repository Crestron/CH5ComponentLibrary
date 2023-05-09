// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { TSignalNonStandardTypeName } from "../types/core";
import { Ch5SignalFactory } from "../ch5-signal-factory";
import { Ch5Signal } from "../ch5-signal";

/**
 * Utility function that unsubscribes from a signal
 */
export function unsubscribeState(signalType: TSignalNonStandardTypeName, signalName: string, subscriptionId: string): void {
	/** The tslint comments provide a double purpose: to disable the linting error and to signal that the fallthrough was
	 * intentional
	 */
	const csf = Ch5SignalFactory.getInstance();

	// if subscription is made for a join number signal name, make sure unsubscribe is made for the right signal name
	// check for join number signal name and append prefix if needed (ex: 200 => fb200, test22 => test22)
	signalName = Ch5Signal.getSubscriptionSignalName(signalName);

	switch (signalType.toLowerCase()) {
		case 'b': // tslint:disable-line:no-switch-case-fall-through
		case 'boolean':
			const bSig = csf.getBooleanSignal(signalName);
			if (null !== bSig) {
				bSig.unsubscribe(subscriptionId);
			}
			break;
		case 'n': // tslint:disable-line:no-switch-case-fall-through
		case 'number': // tslint:disable-line:no-switch-case-fall-through
		case 'numeric':
			const nSig = csf.getNumberSignal(signalName);
			if (null !== nSig) {
				nSig.unsubscribe(subscriptionId);
			}
			break;
		case 's': // tslint:disable-line:no-switch-case-fall-through
		case 'string':
			const sSig = csf.getStringSignal(signalName);
			if (null !== sSig) {
				sSig.unsubscribe(subscriptionId);
			}
			break;
		case 'o': // tslint:disable-line:no-switch-case-fall-through
		case 'object':
			const oSig = csf.getObjectSignal(signalName);
			if (null !== oSig) {
				oSig.unsubscribe(subscriptionId);
			}
			break;
	}
}
