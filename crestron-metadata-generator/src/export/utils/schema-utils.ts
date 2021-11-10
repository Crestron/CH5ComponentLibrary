// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { isNil } from "lodash";
import { Ch5Snippet } from "../../../types/export/ch5-snippet";
import { Definition, DefinitionTuple } from "../../schema/definition";
import { Schema } from "../../schema/schema";
import { DefinitionComparer } from "../definition-comparer";
import { safeBoolean } from "./boolean-utils";
import * as parser from "./object-parse-utils";

function getKeys(schema: Schema): Array<string> {
    const array = Array.from(schema.definitions.keys() || []);
    return array;
}

function hasKeys(schema: Schema) {
    const keys = getKeys(schema);
    return keys.length > 0;
}

function getAliasTypes(schema: Schema): DefinitionTuple[] {
    const keys = getKeys(schema);
    return getTypesInternal(keys, schema.definitions, (def) => safeBoolean(def.isAliasType));
}

function getTypes(schema: Schema): Definition[] {
    const keys = getKeys(schema);
    return getTypesInternal(keys, schema.definitions, (def) => !safeBoolean(def.isAliasType)).map(x => x.definition);
}

function getName(definition: Definition): string {
    return parser.getNameFromObject(definition);
}

function getDefault(definition: Definition): string {
    return parser.getDefaultFromObject(definition);
}

function getDocumentation(definition: Definition): string[] {
    return parser.getDocumentationFromObject(definition);
}

function getChildElements(definition: Definition): string[] {
    return parser.getChildElementsFromObject(definition);
}

function getDescription(definition: Definition): string {
    return definition.description || "";
}

function getSnippets(definition: Definition): Ch5Snippet[] {
    return parser.getSnippetsFromObject(definition);
}

function getTypeForAriaRoles(definition: Definition): string {
    return parser.getTypeForAriaRolesFromObject(definition);
}

function getComponentVersion(definition: Definition): string {
    return parser.getComponentVersionFromObject(definition);
}

function getTagName(definition: Definition): string {
    return parser.getTagNameFromObject(definition);
}

function getTypesInternal(keys: string[], definitions: Map<string, Definition>, filter: DefinitionComparer): DefinitionTuple[] {
    const result: DefinitionTuple[] = [];

    for (const key of keys) {
        const value = definitions.get(key);
        if (!isNil(value)) {
            if (filter(value)) {
                result.push(<DefinitionTuple>{
                    definition: value,
                    name: key,
                });
            }
        }
    }
    return result;
}

function getHideWhen(definition: Definition): object[] {
    return parser.getHideWhenFromObject(definition);
}

function getShowWhen(definition: Definition): object[] {
    return parser.getShowWhenFromObject(definition);
}

export {
    hasKeys,
    getTypes,
    getAliasTypes,
    getName,
    getTagName,
    getDocumentation,
    getChildElements,
    getSnippets,
    getDescription,
    getDefault,
    getTypeForAriaRoles,
    getComponentVersion,
    getHideWhen,
    getShowWhen
};
