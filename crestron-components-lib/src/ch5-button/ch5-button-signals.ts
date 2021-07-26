// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5SignalFactory } from "../ch5-core";
import { Ch5Signal } from "../ch5-core/ch5-signal";
import isNil from 'lodash/isNil';

export interface ICh5ButtonSignalDetails {
	signalName: string;
	signalValue: string;
	signalState: string;
	currentValue: any;
}

export class Ch5ButtonSignal {

	private signals: ICh5ButtonSignalDetails[] = [];

	constructor() {
		const signalsForCh5Button = ["receiveStateType", "receiveStateCustomClass", "receiveStateCustomStyle", "receiveStateIconClass", "receiveStateIconUrl", "receiveStateLabel", "receiveStateScriptLabelHtml"];
		for (let i: number = 0; i < signalsForCh5Button.length; i++) {
			this.signals.push({
				signalName: signalsForCh5Button[i],
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

		// TODO - Test below
		// TODO - also test unsubsciptions
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

	public getSignal(signalName: string): ICh5ButtonSignalDetails {
		const thisSignal: ICh5ButtonSignalDetails = (this.signals.find(signal => signal.signalName.toLowerCase() === signalName.toLowerCase())) as ICh5ButtonSignalDetails;
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
		for (let i: number = 0; i < this.signals.length; i++) {
			if (this.signals[i].signalState !== '' && this.signals[i].signalValue !== '') {
				const receiveValueSigName: string = Ch5Signal.getSubscriptionSignalName(this.signals[i].signalValue);
				const sigLabel: Ch5Signal<string> | null = csf.getStringSignal(receiveValueSigName);
				if (null !== sigLabel) {
					sigLabel.unsubscribe(this.signals[i].signalState);
					this.signals[i].signalValue = "";
					this.signals[i].signalState = "";
				}
			}
		}
	}

}
