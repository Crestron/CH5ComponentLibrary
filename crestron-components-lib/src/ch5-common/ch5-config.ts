// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import {Ch5Common} from "./ch5-common";

export type TCh5ConfigAttributes={
    [attrName:string]: string
}
export type TCh5ConfigTemplateVars={
    [varName:string]: string
}

export type TCh5Config={
    "attributes": {
        "id": {
            [id:string]:TCh5ConfigAttributes
        },
        "component": {
            [component:string]:TCh5ConfigAttributes
        }
    },
    "templatevariables": {
        "id": {
            [id:string]:TCh5ConfigTemplateVars[]
        }
    }
}

export class Ch5Config {

    protected static _defaultConfig:TCh5Config = {
        "attributes": {
            "id": {},
            "component": {}
        },
        "templatevariables": {
            "id": {}
        }
    };

    protected static _config:TCh5Config = Ch5Config._defaultConfig;

    /**
     *
     * Loads a new configuration. Overrides the existing one.
     */
    public static loadConfig(newConfig:TCh5Config) {
        const preparedConfig = this._defaultConfig;

        if (newConfig.hasOwnProperty('attributes')) {
            if (newConfig.attributes.hasOwnProperty('id')) {
                preparedConfig.attributes.id = newConfig.attributes.id;
            }
            if (newConfig.attributes.hasOwnProperty('component')) {
                preparedConfig.attributes.component = newConfig.attributes.component;
            }
        }
        if (newConfig.hasOwnProperty('templatevariables')) {
            if (newConfig.templatevariables.hasOwnProperty('id')) {
                preparedConfig.templatevariables.id = newConfig.templatevariables.id;
            }
        }

        Ch5Config._config = preparedConfig;
    }

    public static setAttributeForId(elementId:string, attributeName:string, attributeValue:string){
        if (!Ch5Config._config.attributes.id.hasOwnProperty(elementId)) {
            Ch5Config._config.attributes.id[elementId] = {} as TCh5ConfigAttributes;
        }
        Ch5Config._config.attributes.id[elementId][attributeName.toLowerCase()] = attributeValue;
    }

    public static setAttributeForComponent(componentName:string, attributeName:string, attributeValue:string){
        const lcCompName = componentName.toLowerCase();
        if (!Ch5Config._config.attributes.component.hasOwnProperty(lcCompName)) {
            Ch5Config._config.attributes.component[lcCompName] = {} as TCh5ConfigAttributes;
        }
        Ch5Config._config.attributes.component[lcCompName][attributeName.toLowerCase()] = attributeValue;
    }

    public static setTemplateVarsForId(elementId:string, tempVarsItems:any[]){
        if (!Ch5Config._config.templatevariables.id.hasOwnProperty(elementId)) {
            Ch5Config._config.templatevariables.id[elementId] = [] as TCh5ConfigTemplateVars[];
        }
        Ch5Config._config.templatevariables.id[elementId] = tempVarsItems;
    }

    public static getConfig() {
        return Ch5Config._config;
    }

    public static getAttributesForId(elementId:string):TCh5ConfigAttributes{
        const idAttrs = Ch5Config._config.attributes.id;

        if (idAttrs.hasOwnProperty(elementId)){
            return idAttrs[elementId];
        }
        return {} as TCh5ConfigAttributes;
    }

    public static getAttributesForComponent(componentName:string):TCh5ConfigAttributes{
        const attrs = Ch5Config._config.attributes.component;
        componentName = componentName.toLowerCase();

        if (attrs.hasOwnProperty(componentName)){
            return attrs[componentName];
        }
        return {} as TCh5ConfigAttributes;
    }

    public static getAttributesForElement(cr:Ch5Common):TCh5ConfigAttributes {
        let attrs:TCh5ConfigAttributes;
        let idAttrs:TCh5ConfigAttributes = {} as TCh5ConfigAttributes;
        const componentName = cr.tagName.toLowerCase();
        const componentAttrs = Ch5Config.getAttributesForComponent(componentName);
        if (cr.hasAttribute('id')) {
            const elId = cr.getAttribute('id');
            if (null !== elId) {
                idAttrs = Ch5Config.getAttributesForId(elId);
            }
        }
        attrs = { ...componentAttrs, ...idAttrs};

        return attrs;
    }

    public static getTemplateVarsForElementById(elementId:string):TCh5ConfigTemplateVars[] {
        const tplVars = Ch5Config._config.templatevariables.id;

        if (tplVars.hasOwnProperty(elementId)){
            return tplVars[elementId];
        }
        return [] as TCh5ConfigTemplateVars[];

    }

    public static getTemplateVarsForElement(cr:Ch5Common):TCh5ConfigTemplateVars[] {
        let tplVars:TCh5ConfigTemplateVars[] = [] as TCh5ConfigTemplateVars[];
        if (cr.hasAttribute('id')) {
            const elId = cr.getAttribute('id');
            if (null !== elId ){
                tplVars = Ch5Config.getTemplateVarsForElementById(elId);
            }
        }
        return tplVars as TCh5ConfigTemplateVars[];
    }

}