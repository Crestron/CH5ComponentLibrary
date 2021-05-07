// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { isNil } from "lodash";
import { Ch5Snippet } from "../../../types/export/ch5-snippet";

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

function getDefaultFromObject(definition: Object): string | null{
    const documentationTag = "default";
    const keys = Object.keys(definition);

    const containsDocumentation = keys.find(x => x === documentationTag) !== undefined;
    if (!containsDocumentation) {
        return null;
    }

    // get the documentation property which should be a JSON string.
    const value: string | null = definition[documentationTag];
    return value;
}

export {
    getDocumentationFromObject,
    getNameFromObject,
    getSnippetsFromObject,
    getTagNameFromObject,
    getDefaultFromObject
};
