// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.


interface Ch5SignalElementAttributeRegistryEntry {
    readonly direction?: "event" | "state";
    readonly booleanJoin?: number;
    readonly numericJoin?: number;
    readonly stringJoin?: number; 
    readonly contractName?: boolean;
};

export interface Ch5SignalElementAttributeRegistryEntries {
    [attributeName: string]: Ch5SignalElementAttributeRegistryEntry;
};

export interface CH5SignalElementDefaultAttributeEntry {
    attributes: string[]; 
    defaultValue: string;
};

export interface CH5SignalElementDefaultAttributeEntries {
    contractName?: CH5SignalElementDefaultAttributeEntry;
    booleanJoin?: CH5SignalElementDefaultAttributeEntry;
    numericJoin?: CH5SignalElementDefaultAttributeEntry;
    stringJoin?: CH5SignalElementDefaultAttributeEntry;
}

export interface CH5SignalElementRegistryEntry {
    attributes: Ch5SignalElementAttributeRegistryEntries; 
    addAttributeWhen?: CH5SignalElementDefaultAttributeEntries;
}

interface RegistryEntries {
    [elementName: string]: CH5SignalElementRegistryEntry;
}

export class Ch5SignalAttributeRegistry {

    public static readonly BOOLEAN_JOIN = "booleanJoin"; 
    public static readonly NUMERIC_JOIN = "numericJoin"; 
    public static readonly STRING_JOIN = "stringJoin"; 
    public static readonly CONTRACT_NAME = "contractName"; 

    private static readonly CUSTOM_ATTRIBUTE_PSUEDO_ELEMENT_NAME = "*";

    //#region Singleton
    private static _instance: Ch5SignalAttributeRegistry;
    public static get instance(): Ch5SignalAttributeRegistry {
        if (Ch5SignalAttributeRegistry._instance === undefined) {
            Ch5SignalAttributeRegistry._instance = new Ch5SignalAttributeRegistry();
        }
        return Ch5SignalAttributeRegistry._instance;
    } 


    private _registry: RegistryEntries;
    private constructor() {
        this._registry = {};
    }
    //#endregion

    //#region public methods
    public addElementAttributeEntries(elementName: string, entries: Ch5SignalElementAttributeRegistryEntries) {
        if (!this._registry[elementName.toUpperCase()]) {
            this._registry[elementName.toUpperCase()] = {attributes: entries};
        }
        else {
            this._registry[elementName.toUpperCase()].attributes = entries;
        }
    }
    public addCustomAttributeEntry(attributeName: string, entry: Ch5SignalElementAttributeRegistryEntry) {
        if (!this._registry[Ch5SignalAttributeRegistry.CUSTOM_ATTRIBUTE_PSUEDO_ELEMENT_NAME]) {
            this._registry[Ch5SignalAttributeRegistry.CUSTOM_ATTRIBUTE_PSUEDO_ELEMENT_NAME] = { attributes: {} }; 
        }
        this._registry[Ch5SignalAttributeRegistry.CUSTOM_ATTRIBUTE_PSUEDO_ELEMENT_NAME].attributes[attributeName] 
            = entry;
    }

    public addElementDefaultAttributeEntries(elementName: string, entries: CH5SignalElementDefaultAttributeEntries) {
        if (!this._registry[elementName.toUpperCase()]) {
            this._registry[elementName.toUpperCase()] = {attributes: {}};
        }
        this._registry[elementName.toUpperCase()].addAttributeWhen = entries;
    }

    public getElementAttributeEntry(elementName: string, attributeName: string): Ch5SignalElementAttributeRegistryEntry | undefined {
        if (this._registry[elementName] !== undefined) {
            return this._registry[elementName].attributes[attributeName];
        }
        else if (this._registry[Ch5SignalAttributeRegistry.CUSTOM_ATTRIBUTE_PSUEDO_ELEMENT_NAME] !== undefined) {
            // the custom crestron attributes like data-ch5-show are registered here
            return this._registry[Ch5SignalAttributeRegistry.CUSTOM_ATTRIBUTE_PSUEDO_ELEMENT_NAME].attributes[attributeName];
        }
        return undefined;
    }

    public getElementDefaultAttributeEntries(elementName: string): CH5SignalElementDefaultAttributeEntries | undefined {
        if (this._registry[elementName] !== undefined) {
            return this._registry[elementName].addAttributeWhen;
        }
        return undefined;
    }
    //#endregion
}