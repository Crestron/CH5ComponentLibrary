// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { isArray } from "util";
import { Definition } from "../schema/definition";
import { TypeFormatter } from "../type-formatter";
import { AliasType } from "../type/alias-type";
import { AnnotatedType } from "../type/annotated-type";
import { BaseType } from "../type/base-type";
import { DefinitionType } from "../type/definition-type";
import { ReferenceType } from "../type/reference-type";
import { uniqueArray } from "./unique-array";


function getNonRefType(type: BaseType): BaseType {
    if (type instanceof ReferenceType || type instanceof DefinitionType ||
        type instanceof AliasType || type instanceof AnnotatedType) {
        return getNonRefType(type.getType());
    }
    return type;
}

// TODO: Can we do this at parse time? See heritage clause in interfaces.
// TODO: We really only need this if the children use additionalProperties: false.
export function getAllOfDefinitionReducer(childTypeFormatter: TypeFormatter, isRoot?: boolean) {
    // combine object instead of using allOf because allOf does not work well with additional properties
    return (definition: Definition, baseType: BaseType) => {
        const other = childTypeFormatter.getDefinition(getNonRefType(baseType), isRoot);
        definition.attributes = new Map<string, Definition>(
            [...Array.from(other.attributes || new Map<string, Definition>()), ...Array.from(definition.attributes || new Map<string, Definition>())],
        );

        function additionalPropsDefinition(props?: boolean | Definition): props is Definition {
            return props !== undefined && props !== true;
        }

        if (additionalPropsDefinition(definition.additionalProperties) &&
            additionalPropsDefinition(other.additionalProperties)) {

            // additional properties is false only if all children also set additional properties to false
            // collect additional properties and merge into a single definition
            let additionalProps: Definition[] = [];
            let additionalTypes: string[] = [];
            const addAdditionalProps: (addProps: Definition) => void = (addProps: Definition) => {
                if (addProps !== false) {
                    if (addProps.anyOf) {
                        for (const prop of addProps.anyOf) {
                            if (prop.type) {
                                additionalTypes = additionalTypes.concat(isArray(prop.type) ?
                                    prop.type : [prop.type]);
                            } else {
                                additionalProps.push(prop);
                            }
                        }
                    } else if (addProps.type) {
                        additionalTypes = additionalTypes.concat(isArray(addProps.type) ?
                            addProps.type : [addProps.type]);
                    } else {
                        additionalProps.push(addProps);
                    }
                }
            };

            addAdditionalProps(definition.additionalProperties);
            addAdditionalProps(other.additionalProperties);

            additionalTypes = uniqueArray(additionalTypes);
            additionalProps = uniqueArray(additionalProps);

            if (additionalTypes.length > 1) {
                additionalProps.push({
                    type: additionalTypes,
                });
            } else if (additionalTypes.length === 1) {
                additionalProps.push({
                    type: additionalTypes[0],
                });
            }

            if (additionalProps.length > 1) {
                definition.additionalProperties = {
                    anyOf: additionalProps,
                };
            } else if (additionalProps.length === 1) {
                if (Object.keys(additionalProps[0]).length === 0) {
                    delete definition.additionalProperties;
                } else {
                    definition.additionalProperties = additionalProps[0];
                }
            } else {
                definition.additionalProperties = false;
            }
        }

        if (other.required) {
            definition.required = uniqueArray((definition.required || []).concat(other.required)).sort();
        }

        return definition;
    };
}
