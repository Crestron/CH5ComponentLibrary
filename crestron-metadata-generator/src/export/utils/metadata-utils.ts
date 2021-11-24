// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { isNil } from "lodash";
import { Ch5Attribute } from "../../../types/export/ch5-attribute";
import { Ch5Element } from "../../../types/export/ch5-element";
import { Definition, DefinitionTuple } from "../../schema/definition";
import * as _ from "../utils/schema-utils";
import { isBasicType } from "./type-utils";

function addTypeDefinition(definition: Definition, aliases: DefinitionTuple[]): Ch5Element {
    const result = Ch5Element.New();
    result.description = _.getDescription(definition);
    result.documentation = _.getDocumentation(definition);
    result.childElements = _.getChildElements(definition);
    result.name = _.getName(definition);
    result.tagName = _.getTagName(definition);
    result.role = _.getTypeForAriaRoles(definition);
    result.snippets = _.getSnippets(definition);
    result.attributes = getProperties(definition, aliases);
    result.componentVersion = _.getComponentVersion(definition);
    return result;
}

function addAttributeDefinition(definition: Definition, aliases: DefinitionTuple[]): Ch5Attribute {
    const result = Ch5Attribute.New();
    result.documentation = _.getDocumentation(definition);
    result.name = _.getName(definition);
    result.value = getProperties(definition, aliases)[0].value;
    return result;
}

function getProperties(definition: Definition, aliases: DefinitionTuple[]): Ch5Attribute[] {
    const properties = definition.attributes;
    const attributes: Ch5Attribute[] = [];
    if (!isNil(properties)) {
        const propertyKeys = Array.from(properties.keys() || []);
        if (!isNil(propertyKeys) && propertyKeys.length > 0) {
            // we have attributes, parse them.
            for (const propertyKey of propertyKeys) {
                const propertyMetadata = properties.get(propertyKey);
                if (!isNil(propertyMetadata)) {
                    attributes.push(addPropertyDefinition(propertyMetadata, aliases));
                }
            }
        }
    }
    return attributes;
}

function getAliasTypesRefs(definition: Definition): string[] {
    let aliasTypesRefs: string[] = [];

    const ref = definition.$ref || '';

    // in case there are multiple types added (separated by '|', ex: orientation: TCh5ListElementOrientation | null)
    if (!ref && !isNil(definition.anyOf)) {
        for (const def of definition.anyOf) {
            if (!isNil(def) && def.hasOwnProperty('$ref') && (def.$ref as string).startsWith("#/definitions")) {
                aliasTypesRefs.push(def.$ref as string);
            }
        }
    } else {
        // just one alias type
        // The below if condition is to ensure that an empty value is not populated into the array of AliasTypesRef
        if (!isNil(ref) && ref !== '') {
            aliasTypesRefs.push(ref);
        }
    }
    return aliasTypesRefs;
}

function getAliasTypeValues(ref: string, aliases: DefinitionTuple[]): string[] {
    let values: string[] = [];
    const aliasName = ref.substring(ref.lastIndexOf("/") + 1);
    const alias = aliases.find(x => x.name === aliasName);
    if (!isNil(alias)) {
        const aliasValues = alias.definition.enum;
        values = [...(<string[]>aliasValues)];
    }
    return values;
}

function getAliasTypeValuesForBasicTypes(type: string): string[] {
    let values: string[] = [];
    if (type.toLowerCase() === 'boolean') {
        values = ["false", "true"];
    }
    // values = [...(<string[]>aliasValues)];
    return values;
}

function addPropertyDefinition(definition: Definition, aliases: DefinitionTuple[]): Ch5Attribute {
    const result = Ch5Attribute.New();
    const aliasTypesRefs = getAliasTypesRefs(definition);
    const isAliasType = aliasTypesRefs.length > 0;

    if (isAliasType) {
        let resultValues: string[] = [];
        aliasTypesRefs.forEach((ref) => {
            resultValues = [...resultValues, ...getAliasTypeValues(ref, aliases)];
        });
        result.value = resultValues;
    } else {
        // direct type
        if (!isNil(definition.type)) {
            if (definition.type instanceof Array) {
                const array = definition.type as string[];
                if (!isNil(array)) {
                    result.value = array;
                } else {
                    result.value = [];
                }
            } else {
                const type = definition.type as string;
                if (!isNil(type)) {
                    if (isBasicType(type)) {
                        result.value = getAliasTypeValuesForBasicTypes(type);
                    } else {
                        result.value = [type];
                    }
                } else {
                    result.value = [];
                }
            }
        } else {
            result.value = [];
        }
    }

    result.name = _.getName(definition);
    result.documentation = _.getDocumentation(definition);
    // const defaultValue = _.getDefault(definition);
    // if (!isNil(defaultValue) && defaultValue !== "") {
    result.default = _.getDefault(definition);
    result.hideWhen = _.getHideWhen(definition);
    result.showWhen = _.getShowWhen(definition);
    if (_.getDeprecated(definition) !== null) {
        result.deprecated = _.getDeprecated(definition);
    }
    // }

    return result;
}

export {
    addTypeDefinition,
    addAttributeDefinition,
};
