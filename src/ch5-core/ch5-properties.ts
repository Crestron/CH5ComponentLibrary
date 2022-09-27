import _ from "lodash";
import { Ch5Property, ICh5PropertySettings, TPropertyTypes } from "./ch5-property";
import { Ch5SignalFactory } from "./ch5-signal-factory";
import { Ch5Signal } from "./ch5-signal";
import { Ch5Common } from "../ch5-common/ch5-common";

export class Ch5Properties {

	private _properties: Ch5Property[] = [];

	public constructor(public ch5Component: Ch5Common, public propertiesObject: ICh5PropertySettings[]) {
		for (let i: number = 0; i < propertiesObject.length; i++) {
			const newProperty = new Ch5Property(ch5Component, propertiesObject[i]);
			this._properties.push(newProperty);
		}
	}

	public unsubscribe() {
		const csf = Ch5SignalFactory.getInstance();
		// TODO - understand how signalname is fetched becos this instance is common across app
		for (const eachSignal of this._properties) {
			if (eachSignal.signalState !== '' && eachSignal.signalValue !== '') {
				const receiveValueSigName: string = Ch5Signal.getSubscriptionSignalName(eachSignal.signalValue);
				const receiveSignal: Ch5Signal<string> | null = csf.getStringSignal(receiveValueSigName);
				if (null !== receiveSignal) {
					receiveSignal.unsubscribe(eachSignal.signalState);
					eachSignal.signalValue = "";
					eachSignal.signalState = "";
				}
			}
		}
	}

	public getSignalValue<T>(propertyName: string): T {
		return this.getPropertyByName(propertyName)?.getVariable<T>() as unknown as T;
	}

	public get<T>(propertyName: string): T {
		return this.getPropertyByName(propertyName)?.value as unknown as T;
	}

	public set<T>(propertyName: string, value: TPropertyTypes, callback?: any, signalCallback?: any) {
		const selectedProperty = this.getPropertyByName(propertyName);
		if (selectedProperty) {
			if ((_.isNil(selectedProperty.property.nameForSignal) || selectedProperty.property.nameForSignal === "")) {
				selectedProperty.setValue<T>(value, callback, signalCallback);
			} else {
				if (this.isAttributeAvailableInComponent(selectedProperty.property.nameForSignal) === false) {
					selectedProperty.setValue<T>(value, callback, signalCallback);
				}
			}
		}
	}

	public setForSignalResponse<T>(propertyName: string, value: TPropertyTypes, callback?: any, signalCallback?: any) {
		const selectedProperty = this.getPropertyByName(propertyName);
		if (selectedProperty) {
			selectedProperty.setValueFromSignal<T>(value, callback, signalCallback);
		}
	}

	private isAttributeAvailableInComponent(selectedPropertyName: string): boolean {
		return this.ch5Component.hasAttribute(selectedPropertyName) && this.ch5Component.getAttribute(selectedPropertyName)?.trim() !== "";
	}

	private getPropertyByName(propertyName: string): Ch5Property | null {
		const propertyObject: Ch5Property | undefined = this._properties.find((componentProperty: Ch5Property) => { return componentProperty.name === propertyName });
		if (propertyObject) {
			return propertyObject;
		} else {
			return null;
		}
	}

}
