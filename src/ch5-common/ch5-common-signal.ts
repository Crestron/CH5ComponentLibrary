// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5SignalFactory } from "../ch5-core";
import { Ch5Signal } from "../ch5-core/ch5-signal";

export interface ICh5CommonSignalInfo {
	signalName: string;
	signalValue: string;
	signalState: string;
	currentValue: any;
}

export class Ch5CommonSignal {

	private signals: ICh5CommonSignalInfo[] = [];

	constructor(signalsForCh5Button: string[]) {
		// const signalsForCh5Button = ["receiveStateType", "receiveStateCustomClass", "receiveStateCustomStyle", "receiveStateIconClass", "receiveStateIconUrl", "receiveStateLabel", "receiveStateScriptLabelHtml"];
		for (const eachSignal of signalsForCh5Button) {
			this.signals.push({
				signalName: eachSignal,
				signalValue: "",
				signalState: "",
				currentValue: ""
			});
		}
	}

	public setSignal(signalName: string, signalValue: string): Ch5Signal<string> | null {
		const thisSignal: any = this.signals.find((signal: any) => signal.signalName.toLowerCase() === signalName.toLowerCase());
		if (thisSignal.signalValue === signalValue || signalValue === null) {
			return null;
		}

		// clean up old subscription
		if (thisSignal.signalValue) {
			const oldReceiveStateSigName: string = Ch5Signal.getSubscriptionSignalName(thisSignal.signalValue);
			const oldSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(oldReceiveStateSigName);

			if (oldSignal !== null) {
				oldSignal.unsubscribe(thisSignal.signalState as string);
			}
		}

		thisSignal.signalValue = signalValue;

		// setup new subscription.
		const receiveLabelSigName: string = Ch5Signal.getSubscriptionSignalName(thisSignal.signalValue);
		const receiveSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(receiveLabelSigName);

		if (receiveSignal === null) {
			return null;
		}
		thisSignal.signalState = receiveSignal;
		return receiveSignal;
	}

	public getSignal(signalName: string): ICh5CommonSignalInfo {
		const thisSignal: ICh5CommonSignalInfo = (this.signals.find(signal => signal.signalName.toLowerCase() === signalName.toLowerCase())) as ICh5CommonSignalInfo;
		return thisSignal;
	}

	public setVariable<T>(attributeName: string, attributeValue: string) {
		this.getSignal(attributeName).currentValue = attributeValue;
	}

	public getVariable<T>(attributeName: string): T {
		return this.getSignal(attributeName).currentValue as T;
	}

	public unsubscribeAll() {
		const csf = Ch5SignalFactory.getInstance();
		for (const eachSignal of this.signals) {
			if (eachSignal.signalState !== '' && eachSignal.signalValue !== '') {
				const receiveValueSigName: string = Ch5Signal.getSubscriptionSignalName(eachSignal.signalValue);
				const sigLabel: Ch5Signal<string> | null = csf.getStringSignal(receiveValueSigName);
				if (null !== sigLabel) {
					sigLabel.unsubscribe(eachSignal.signalState);
					eachSignal.signalValue = "";
					eachSignal.signalState = "";
				}
			}
		}
	}

}
