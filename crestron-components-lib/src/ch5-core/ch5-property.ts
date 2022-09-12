import { Ch5ButtonBase } from "./../ch5-button/ch5-button-base";
import _ from "lodash";
import { Ch5Signal } from "./ch5-signal";
import { Ch5SignalFactory } from "./ch5-signal-factory";
import { TSignal } from "./types/signal.type";
import { Ch5Common } from "../ch5-common/ch5-common";

export type TPropertyTypes = boolean | number | string | object | any;

export interface ICh5PropertySettings {
	default: any;
	enumeratedValues?: any[];
	isNullable?: boolean;
	isObservableProperty: boolean;
	isSignal?: boolean;
	name: string;
	nameForSignal?: string;
	signalType?: string;
	removeAttributeOnNull: boolean;
	type: string;
	valueOnAttributeEmpty: any;
	numberProperties?: {
		min: number;
		max: number;
		conditionalMin: number;
		conditionalMax: number;
		conditionalMinValue: number;
		conditionalMaxValue: number;
	},
	attributes?: {

	},
	signals?: {
		name: string;

	}
};

export class Ch5Property {

	private _attributeName: string = "";
	private _signalName: string = "";
	private _signalValue: string = "";
	private _signalState: string = "";
	private _currentValue: any;
	private _propertyName: string = "";
	private _propertyValue: boolean | string | object | any;
	private initializedValue: boolean = false;

	private _hasChangedSinceInit: boolean = false;

	constructor(public ch5Component: Ch5Common, public property: ICh5PropertySettings) {
		this._attributeName = property.name.toLowerCase();
		this._propertyName = property.name;
		this._propertyValue = property.default;
	}

	public get value(): boolean | string | object | any {
		return this._propertyValue;
	}
	public set value(value: boolean | string | object | any) {
		this.processValue(value, false);
	}
	public get name(): string {
		return this._propertyName;
	}
	public get attributeName(): string {
		return this._attributeName;
	}
	public get signalName(): string {
		return this._signalName;
	}
	public set signalName(value: string) {
		this._signalName = value;
	}
	public get signalValue(): string {
		return this._signalValue;
	}
	public set signalValue(value: string) {
		this._signalValue = value;
	}
	public get signalState(): string {
		return this._signalState;
	}
	public set signalState(value: string) {
		this._signalState = value;
	}
	public get currentValue(): any {
		return this._currentValue;
	}

	// public get prevValue(): T {
	// 	return this._prevValue;
	// }

	public hasChangedSinceInit(): boolean {
		return this._hasChangedSinceInit;
	}

	public setValue<T>(value: T, callback?: any, signalCallback?: any) {
		this.processValue<T>(value, false, callback, signalCallback);
	}

	public setValueFromSignal<T>(value: T, callback?: any, signalCallback?: any) {
		this.processValue<T>(value, true, callback, signalCallback);
	}

	private processValue<T>(value: boolean | string | object | any, setFromSignal: boolean, callback?: any, signalCallback?: any) {
		this.ch5Component.logger.log('setAttributeAndProperty: ' + this.property.name + ' - "' + value + '"');

		if (_.isNil(value) && this.property.isNullable && this.property.isNullable === true) { // TODO why isNullable
			this._propertyValue = null;
			this.ch5Component.removeAttribute(this._attributeName);
			if (!_.isNil(callback)) {
				callback();
			}
			return true;
		} else {
			if (this.property.type === "boolean") {
				let valueToSet: boolean;
				if (typeof value === this.property.type) {
					valueToSet = value;
				} else {
					if (this.ch5Component.hasAttribute(this._attributeName)) {
						let tempVal: any = value;
						if ([true, false, "true", "false", "0", "1", 0, 1, '', null].indexOf(tempVal) < 0) {
							tempVal = this.property.default;
						}
						valueToSet = this.toBoolean(tempVal, this.property.valueOnAttributeEmpty);
					} else {
						valueToSet = this.property.default as unknown as boolean;
					}
				}

				if (this._propertyValue !== valueToSet || setFromSignal === true || this.initializedValue === false) { // || String(value) !== String(valueToSet)) {
					// This variable is required only for checking first time and making changes when the default value is true
					this._propertyValue = valueToSet;
					this.initializedValue = true;

					if (["true", "false", ''].indexOf(String(this.ch5Component.getAttribute(this._attributeName))) < 0) {
						if (this.property.removeAttributeOnNull === true) {
							if (!this.ch5Component.hasAttribute(this._attributeName)) {
								if (setFromSignal === true) {
									this.ch5Component.setAttribute(this._attributeName, String(valueToSet));
								} else {
									this.ch5Component.removeAttribute(this._attributeName);
								}
							} else {
								this.ch5Component.setAttribute(this._attributeName, String(valueToSet));
							}
						} else {
							this.ch5Component.setAttribute(this._attributeName, String(valueToSet));
						}
					} else {
						this.ch5Component.setAttribute(this._attributeName, String(valueToSet));
					}
					if (!_.isNil(callback)) {
						callback();
					}
					return true;
				}

			} else if (this.property.type === "enum") {

				if (this._propertyValue !== value) {
					// Implies that the content has to be an enumerated value ONLY
					if (this.property.enumeratedValues && this.property.enumeratedValues.length > 0 && this.property.enumeratedValues.indexOf(value) >= 0) {
						this.ch5Component.setAttribute(this._attributeName, String(value));
						this._propertyValue = String(value) as unknown as T;
					} else {
						if (!_.isNil(this.property.default)) {
							this.ch5Component.setAttribute(this._attributeName, String(this.property.default));
							this._propertyValue = String(this.property.default) as unknown as T;
						} else {
							this.ch5Component.removeAttribute(this._attributeName);
							this._propertyValue = String(this.property.default) as unknown as T;
						}
					}
					if (!_.isNil(callback)) {
						callback();
					}
					return true;
				}
			} else if (this.property.type === "number") {


				if (this._propertyValue !== value) {
					if (Number.isNaN(value)) {
						value = this.property.default;
					}
					if (this.property.numberProperties) {
						if (value >= this.property.numberProperties.min && value <= this.property.numberProperties.max) {
							if (value > this.property.numberProperties.conditionalMax) {
								value = this.property.numberProperties.conditionalMaxValue;
							} else if (value < this.property.numberProperties.conditionalMin) {
								value = this.property.numberProperties.conditionalMinValue;
							}
							this.ch5Component.setAttribute(this._attributeName, String(value));
							this._propertyValue = value as unknown as number;
						} else {
							this.ch5Component.setAttribute(this._attributeName, String(this.property.default));
							this._propertyValue = this.property.default as unknown as number;
							// } else {
							// 	this.ch5Component.removeAttribute(this._attributeName);
							// 	this._propertyValue = String(this.property.default) as unknown as number;
							// }
						}
					} else {
						// TODO - check for attributes has attribute etc for all number string etc
						this.ch5Component.setAttribute(this._attributeName, String(this.property.default));
						this._propertyValue = String(this.property.default) as unknown as number;
					}
					if (!_.isNil(callback)) {
						callback();
					}
					return true;
				}
			} else if (this.property.type === "string") {
				if (this._propertyValue !== value) {
					if (_.isNil(value) || String(value).trim() === "") {
						this.ch5Component.removeAttribute(this._attributeName);
						this._propertyValue = String(this.property.default);
					} else {
						this.ch5Component.setAttribute(this._attributeName, String(value));
						this._propertyValue = String(value);
					}
// TODO - clear signal
		// 			this.clearStringSignalSubscription(this._receiveStateCustomClass, this._subKeySigReceiveCustomClass);

					if (this.property.isSignal === true) {
						if (this.property.signalType === "number") {
							const signalResponse = this.setSignalByNumber(value);
							if (!_.isNil(signalResponse)) {
								this.signalState = signalResponse.subscribe((newValue: number) => {
									this._currentValue = newValue;
									this.setVariable<number>(newValue);
									if (!_.isNil(callback)) {
										callback();
									}
									if (!_.isNil(signalCallback)) {
										signalCallback(newValue);
									}
									return true;
								});
							}
						} else if (this.property.signalType === "string") {
							const signalResponse = this.setSignalByString(value);
							if (!_.isNil(signalResponse)) {
								this.signalState = signalResponse.subscribe((newValue: string) => {
									this._currentValue = newValue;
									this.setVariable<string>(newValue);
									if (!_.isNil(callback)) {
										callback();
									}
									if (!_.isNil(signalCallback)) {
										signalCallback(newValue);
									}
									return true;
								});
							}
						} else if (this.property.signalType === "boolean") {
							const signalResponse = this.setSignalByBoolean(value);
							if (!_.isNil(signalResponse)) {
								this.signalState = signalResponse.subscribe((newValue: boolean) => {
									this._currentValue = newValue;
									this.setVariable<boolean>(newValue);
									if (!_.isNil(callback)) {
										callback();
									}
									if (!_.isNil(signalCallback)) {
										signalCallback(newValue);
									}
									return true;
								});
							}
						}

					}
				}
			}
		}
		return false;
	}

	// public set mode(value: number) {
	// 	this.logger.log('set mode("' + value + '")');
	// 	if (this._mode !== value) {
	// 		if (Number.isNaN(value)) {
	// 			this._mode = 0;
	// 		} else {
	// 			if (value >= this.MODES.MIN_LENGTH && value <= this.MODES.MAX_LENGTH) {
	// 				const buttonModesArray = this.getElementsByTagName("ch5-button-mode");
	// 				if (buttonModesArray && buttonModesArray.length > 0) {
	// 					if (value < buttonModesArray.length) {
	// 						this._mode = value;
	// 					} else {
	// 						this._mode = 0;
	// 					}
	// 				} else {
	// 					this._mode = 0;
	// 				}
	// 			} else {
	// 				this._mode = 0;
	// 			}
	// 		}
	// 		this.setAttribute('mode', String(this._mode));
	// 		this.setButtonDisplay();
	// 	}
	// }

	public setSignalByNumber(signalValue: string): Ch5Signal<number> | null {
		if (this.signalValue === signalValue || signalValue === null) {
			return null;
		}

		// clean up old subscription
		if (this.signalValue) {
			const oldReceiveStateSigName: string = Ch5Signal.getSubscriptionSignalName(this.signalValue);
			const oldSignal: Ch5Signal<number> | null = Ch5SignalFactory.getInstance().getNumberSignal(oldReceiveStateSigName);

			if (oldSignal !== null) {
				oldSignal.unsubscribe(this.signalState as string);
			}
		}

		this.signalValue = signalValue;

		// setup new subscription.
		const receiveLabelSigName: string = Ch5Signal.getSubscriptionSignalName(this.signalValue);
		const receiveSignal: Ch5Signal<number> | null = Ch5SignalFactory.getInstance().getNumberSignal(receiveLabelSigName);

		if (receiveSignal === null) {
			return null;
		}
		return receiveSignal;
	}

	public setSignalByString(signalValue: string): Ch5Signal<string> | null {
		if (this.signalValue === signalValue || signalValue === null) {
			return null;
		}

		// clean up old subscription
		if (this.signalValue) {
			const oldReceiveStateSigName: string = Ch5Signal.getSubscriptionSignalName(this.signalValue);
			const oldSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(oldReceiveStateSigName);

			if (oldSignal !== null) {
				oldSignal.unsubscribe(this.signalState as string);
			}
		}

		this.signalValue = signalValue;

		// setup new subscription.
		const receiveLabelSigName: string = Ch5Signal.getSubscriptionSignalName(this.signalValue);
		const receiveSignal: Ch5Signal<string> | null = Ch5SignalFactory.getInstance().getStringSignal(receiveLabelSigName);

		if (receiveSignal === null) {
			return null;
		}
		return receiveSignal;
	}
	public setSignalByBoolean(signalValue: string): Ch5Signal<boolean> | null {
		if (this.signalValue === signalValue || signalValue === null) {
			return null;
		}

		// clean up old subscription
		if (this.signalValue) {
			const oldReceiveStateSigName: string = Ch5Signal.getSubscriptionSignalName(this.signalValue);
			const oldSignal: Ch5Signal<boolean> | null = Ch5SignalFactory.getInstance().getBooleanSignal(oldReceiveStateSigName);

			if (oldSignal !== null) {
				oldSignal.unsubscribe(this.signalState as string);
			}
		}

		this.signalValue = signalValue;

		// setup new subscription.
		const receiveLabelSigName: string = Ch5Signal.getSubscriptionSignalName(this.signalValue);
		const receiveSignal: Ch5Signal<boolean> | null = Ch5SignalFactory.getInstance().getBooleanSignal(receiveLabelSigName);

		if (receiveSignal === null) {
			return null;
		}
		return receiveSignal;
	}
	// public getSignal(signalName: string): ICh5PropertySignalDetails {
	// 	const thisSignal: ICh5PropertySignalDetails = (this.signals.find(signal => signal.signalName.toLowerCase() === signalName.toLowerCase())) as ICh5PropertySignalDetails;
	// 	return thisSignal;
	// }

	public setVariable<T>(attributeValue: T) {
		this._currentValue = attributeValue;
	}

	public getVariable<T>(): T {
		return this.currentValue as T;
	}

	private toBoolean(val: any, isEmptyValueEqualToTrue = false): boolean {
		const str = String(val).toLowerCase().trim();
		switch (str) {
			case "true": case "yes": case "1":
				return true;
			case "false": case "no": case "0":
				return false;
			case "": case null: case undefined: case "null": case "undefined":
				if (isEmptyValueEqualToTrue === true) {
					return true;
				} else {
					return false;
				}
			default:
				return false;
		}
	}

}
