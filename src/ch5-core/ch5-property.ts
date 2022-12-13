import _ from "lodash";
import { Ch5Signal } from "./ch5-signal";
import { Ch5SignalFactory } from "./ch5-signal-factory";
import { Ch5Common } from "../ch5-common/ch5-common";
import { Ch5Log } from "../ch5-common/ch5-log";

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
	private _propertyName: string = "";
	private _propertyValue: boolean | string | object | any;
	private _propertySignalValue: boolean | string | object | any = null;
	private initializedValue: boolean = false;
	private _propertySignalType: string = "";
	// private _hasChangedSinceInit: boolean = false;

	constructor(public ch5Component: Ch5Common | Ch5Log, public property: ICh5PropertySettings) {
		this._attributeName = property.name.toLowerCase();
		this._propertyName = property.name;
		this._propertyValue = property.default;
		if (property.signalType) {
			this._propertySignalType = property.signalType;
		}
	}
	public get signalType(): string {
		return this._propertySignalType;
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

	public setValue<T>(value: T, callback?: any, signalCallback?: any) {
		this.processValue<T>(value, false, callback, signalCallback);
	}

	public setValueFromSignal<T>(value: T, callback?: any, signalCallback?: any) {
		this.processValue<T>(value, true, callback, signalCallback);
	}

	public clearProperty() {
		this._signalName = "";
		this._signalValue = "";
		this._signalState = "";
		this._propertyValue = this.property.default;
		this._propertySignalValue = null;
		this.initializedValue = false;
	}

	private processValue<T>(value: boolean | string | object | any, setFromSignal: boolean, callback?: any, signalCallback?: any) {
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
						this._propertyValue = String(value) as unknown as T;
						this.ch5Component.setAttribute(this._attributeName, String(value));
					} else {
						if (!_.isNil(this.property.default)) {
							this._propertyValue = String(this.property.default) as unknown as T;
							this.ch5Component.setAttribute(this._attributeName, String(this.property.default));
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
					if (isNaN(value) || !Number.isInteger(parseInt(value, 10))) {
						value = this.property.default;
					}
					value = Number(value);
					if (this.property.numberProperties) {
						if (value < this.property.numberProperties.min || value > this.property.numberProperties.max) {
							if (value > this.property.numberProperties.conditionalMax) {
								value = this.property.numberProperties.conditionalMaxValue;
							} else if (value < this.property.numberProperties.conditionalMin) {
								value = this.property.numberProperties.conditionalMinValue;
							}
						}
						this._propertyValue = value + "";
						this.ch5Component.setAttribute(this._attributeName, String(value));
					} else {
						// TODO - check for attributes has attribute etc for all number string etc
						this._propertyValue = this.property.default as unknown as number;
						this.ch5Component.setAttribute(this._attributeName, String(this.property.default));
					}
					if (!_.isNil(callback)) {
						callback();
					}
					return true;
				}
			} else if (this.property.type === "string") {
				if (this._propertyValue !== String(value).trim()) {
					if (_.isNil(value) || String(value).trim() === "") {
						this._propertyValue = String(this.property.default);
						this.ch5Component.removeAttribute(this._attributeName);
					} else {
						this._propertyValue = String(value).trim();
						this.ch5Component.setAttribute(this._attributeName, String(value).trim());
					}
					//  clear signal
					// 			this.clearStringSignalSubscription(this._receiveStateCustomClass, this._subKeySigReceiveCustomClass);
					if (!_.isNil(callback)) {
						callback();
					}
					if (this.property.isSignal === true) {
						if (this.property.signalType === "number") {
							const signalResponse = this.setSignalByNumber(value);
							if (!_.isNil(signalResponse)) {
								this.signalState = signalResponse.subscribe((newValue: number) => {
									if (!_.isNil(signalCallback)) {
										if (newValue !== this._propertySignalValue) {
											this._propertySignalValue = newValue as unknown as number;
											signalCallback(newValue);
										}
									}
									return true;
								});
							}
						} else if (this.property.signalType === "string") {
							const signalResponse = this.setSignalByString(value);
							if (!_.isNil(signalResponse)) {
								this.signalState = signalResponse.subscribe((newValue: string) => {
									if (!_.isNil(signalCallback)) {
										if (newValue !== this._propertySignalValue) {
											this._propertySignalValue = newValue as unknown as string;
											signalCallback(newValue);
										}
									}
									return true;
								});
							}
						} else if (this.property.signalType === "boolean") {
							const signalResponse = this.setSignalByBoolean(value);
							if (!_.isNil(signalResponse)) {
								this.signalState = signalResponse.subscribe((newValue: boolean) => {
									if (!_.isNil(signalCallback)) {
										if (newValue !== this._propertySignalValue) {
											this._propertySignalValue = newValue as unknown as boolean;
											signalCallback(newValue);
										}
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

	// public setVariable<T>(attributeValue: T) {
	// 	this._currentValue = attributeValue;
	// }

	// public getVariable<T>(): T {
	// 	return this.currentValue as T;
	// }

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
