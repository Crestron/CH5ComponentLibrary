// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { isNil } from "lodash";
import { Deprecated } from "../../../types/export/ch5-attribute";
import { Ch5Snippet } from "../../../types/export/ch5-snippet";
import { Definition } from "../../schema/definition";

function getTagNameFromObject(definition: Object): string {
    const documentationTag = "tagName";
    const keys = Object.keys(definition);

    const containsDocumentation = keys.find(x => x === documentationTag) !== undefined;
    if (!containsDocumentation) {
        return "";
    }

    // get the documentation property which should be a JSON string.
    const value: string = definition[documentationTag];

    if (!isNil(value)) {
        return value;
    }

    return "";
}

function getTypeForAriaRolesFromObject(definition: Object): string {
    const documentationTag = "role";
    const keys = Object.keys(definition);

    const containsDocumentation = keys.find(x => x === documentationTag) !== undefined;
    if (!containsDocumentation) {
        return "";
    }

    // get the documentation property which should be a JSON string.
    const value: string = definition[documentationTag];

    if (!isNil(value)) {
        return value;
    }

    return "";
}

function getComponentVersionFromObject(definition: Object): string {
    const documentationTag = "componentVersion";
    const keys = Object.keys(definition);

    const containsDocumentation = keys.find(x => x === documentationTag) !== undefined;
    if (!containsDocumentation) {
        return "";
    }

    // get the documentation property which should be a JSON string.
    const value: string = definition[documentationTag];

    if (!isNil(value)) {
        return value;
    }

    return "";
}

function getSnippetsFromObject(definition: Object): Ch5Snippet[] {
    const documentationTag = "snippets";
    const keys = Object.keys(definition);

    const containsDocumentation = keys.find(x => x === documentationTag) !== undefined;
    if (!containsDocumentation) {
        return [];
    }

    // get the documentation property which should be a JSON string.
    const value: string = definition[documentationTag];

    if (!isNil(value)) {
        const jsonValue = JSON.parse(value) as Ch5Snippet[];
        return jsonValue;
    }

    return [];
}

function getDocumentationFromObject(definition: Object): string[] {
    const documentationTag = "documentation";
    const keys = Object.keys(definition);

    const containsDocumentation = keys.find(x => x === documentationTag) !== undefined;
    if (!containsDocumentation) {
        return [];
    }

    // get the documentation property which should be a JSON string.
    const value: string = definition[documentationTag];

    if (!isNil(value)) {
        try {
            const jsonValue = JSON.parse(value) as string[];
            return jsonValue;
        } catch (e) {
            throw new Error(`${e}, from ${value}`)
        }
    }

    return [];
}

function getChildElementsFromObject(definition: Object): string[] {
    const childElementsTag = "childElements";
    const keys = Object.keys(definition);
    const containsChildElements = keys.find(x => x === childElementsTag) !== undefined;
    if (!containsChildElements) {
        return [];
    }

    // get the childElements property which should be a JSON string.
    const value: string = definition[childElementsTag];

    if (!isNil(value)) {
        try {
            const jsonValue = JSON.parse(value) as string[];
            return jsonValue;
        } catch (e) {
            throw new Error(`${e}, from ${value}`)
        }
    }

    return [];
}

function getNameFromObject(definition: Object): string {
    const documentationTag = "name";
    const keys = Object.keys(definition);

    const containsDocumentation = keys.find(x => x === documentationTag) !== undefined;
    if (!containsDocumentation) {
        return "";
    }

    // get the documentation property which should be a JSON string.
    const value: string = definition[documentationTag];

    if (!isNil(value)) {
        return value;
    }

    return "";
}

function getDefaultFromObject(definition: Object): string {
    const documentationTag = "default";
    const keys = Object.keys(definition);

    const containsDocumentation = keys.find(x => x === documentationTag) !== undefined;
    if (!containsDocumentation) {
        return "null";
    }

    // get the documentation property which should be a JSON string.
    // The value type cannot be multiple datatypes, hence making it as null in string.
    // This is because vscode extension schema is dependent on it and it cannot be more than one.
    const value: string= (definition[documentationTag] === null) ? "null" : definition[documentationTag];
    return value;
}

function getHideWhenFromObject(definition: Object): object[] {
    const documentationTag = "hideWhen";
    const keys = Object.keys(definition);

    const containsDocumentation = keys.find(x => x === documentationTag) !== undefined;
    if (!containsDocumentation) {
        return [];
    }

    // get the documentation property which should be a object array.
    const value: object[] = definition[documentationTag];

    // only one of showWhen and hideWhen should be present
    checkOppositeProperty("showWhen", keys, definition);

    if (!isNil(value)) {
        try {
            const allRules: object[] = [];

            while(value.length > 0) {
                allRules.push(value[0]);
                value.shift();
            }
            return allRules;
        } catch (e) {
            throw new Error(`${e}, from ${value}`)
        }
    }
    return [];
}

function getShowWhenFromObject(definition: Object): object[] {
    const documentationTag = "showWhen";
    const keys = Object.keys(definition);

    const containsDocumentation = keys.find(x => x === documentationTag) !== undefined;
    if (!containsDocumentation) {
        return [];
    }

    // get the documentation property which should be a object array.
    const value: object[] = definition[documentationTag];

    // only one of showWhen and hideWhen should be present
    checkOppositeProperty("hideWhen", keys, definition)

    if (!isNil(value)) {
        try {
            const allRules: object[] = [];

            while(value.length > 0) {
                allRules.push(value[0]);
                value.shift();
            }
            return allRules;
        } catch (e) {
            throw new Error(`${e}, from ${value}`)
        }
    }
    return [];
}

function checkOppositeProperty(oppositeTag: string, keys: string[], definition: Definition): void {
    const containsOppositeDocumentation = keys.find(x => x === oppositeTag) !== undefined;
    if(containsOppositeDocumentation) {
        throw new Error(`${definition["name"]} attribute should contain only one of the showWhen and hideWhen properties`);
    }
}

function getDeprecatedFromObject(definition: Object): Deprecated | undefined {
    const documentationTag = "deprecated";
    const keys = Object.keys(definition);

    const containsDocumentation = keys.find(x => x === documentationTag) !== undefined;
    if (!containsDocumentation) {
        return undefined;
    }

    // get the documentation property which should be an object.
    const value: object = definition[documentationTag]
    console.log(value);
    console.log(typeof value)

    if (!isNil(value)) {
        return {
            version: value["version"],
            description: value["description"],
        }
    }

    return undefined;
}

export {
    getDocumentationFromObject,
    getChildElementsFromObject,
    getNameFromObject,
    getSnippetsFromObject,
    getTagNameFromObject,
    getDefaultFromObject,
    getTypeForAriaRolesFromObject,
    getComponentVersionFromObject,
    getHideWhenFromObject,
    getShowWhenFromObject,
    getDeprecatedFromObject,
};
