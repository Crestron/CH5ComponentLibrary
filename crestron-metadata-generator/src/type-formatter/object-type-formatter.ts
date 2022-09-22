// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { isNil } from "lodash";
import { Definition } from "../schema/definition";
import { SubTypeFormatter } from "../sub-type-formatter";
import { TypeFormatter } from "../type-formatter";
import { AnyType } from "../type/any-type";
import { BaseType } from "../type/base-type";
import { ObjectProperty, ObjectType } from "../type/object-type";
import { UndefinedType } from "../type/undefined-type";
import { UnionType } from "../type/union-type";
import { getAllOfDefinitionReducer } from "../utils/all-of-definition";

export class ObjectTypeFormatter implements SubTypeFormatter {
    public constructor(
        private childTypeFormatter: TypeFormatter,
    ) {
    }

    public supportsType(type: ObjectType): boolean {
        return type instanceof ObjectType;
    }
    public getDefinition(type: ObjectType, isRoot?: boolean): Definition {
        if (type.getBaseTypes().length === 0) {
            return this.getObjectDefinition(type, isRoot);
        }

        return type.getBaseTypes().reduce(
            getAllOfDefinitionReducer(this.childTypeFormatter, isRoot), this.getObjectDefinition(type, isRoot));
    }
    public getChildren(type: ObjectType): BaseType[] {
        const properties: ObjectProperty[] = type.getProperties();
        const additionalProperties: BaseType | boolean = type.getAdditionalProperties();

        return [
            ...type.getBaseTypes().reduce((result: BaseType[], baseType) => [
                ...result,
                ...this.childTypeFormatter.getChildren(baseType).slice(1),
            ], []),

            ...additionalProperties instanceof BaseType ?
                this.childTypeFormatter.getChildren(additionalProperties) :
                [],

            ...properties.reduce((result: BaseType[], property) => [
                ...result,
                ...this.childTypeFormatter.getChildren(property.getType()),
            ], []),
        ];
    }

    private getObjectDefinition(type: ObjectType, isRoot?: boolean): Definition {
        const objectProperties: ObjectProperty[] = type.getProperties();
        const additionalProperties: BaseType | boolean = type.getAdditionalProperties();

        const required = objectProperties
            .map((property) => this.prepareObjectProperty(property))
            .filter((property) => property.isRequired())
            .map((property) => property.getName());
        const attributes: Map<string, Definition> = objectProperties
            .map((property) => this.prepareObjectProperty(property))
            .reduce((result: Map<string, Definition>, property) => {
                return result.set(property.getName(), this.childTypeFormatter.getDefinition(property.getType(), isRoot));
            }, new Map<string, Definition>());

        return {
            type: "object",
            ...(!isNil(attributes.keys()) && Array.from(attributes.keys()).length > 0 ? { attributes } : {}),
            ...(required.length > 0 ? { required } : {}),
            ...(additionalProperties === true || additionalProperties instanceof AnyType ? {} :
                {
                    additionalProperties: additionalProperties instanceof BaseType ?
                        this.childTypeFormatter.getDefinition(additionalProperties, isRoot) :
                        additionalProperties,
                }),
        };
    }
    private getAdditionalProperties(additionalProperties: BaseType | boolean, isRoot?: boolean): Definition {
        if (typeof additionalProperties === "boolean") {
            return additionalProperties ? {} : { additionalProperties: false };
        }

        return additionalProperties instanceof AnyType
            ? {}
            : { additionalProperties: this.childTypeFormatter.getDefinition(additionalProperties, isRoot) };
    }

    private prepareObjectProperty(property: ObjectProperty): ObjectProperty {
        const propType = property.getType();
        if (propType instanceof UndefinedType) {
            return new ObjectProperty(property.getName(), new UndefinedType(), false);
        } else if (!(propType instanceof UnionType)) {
            return property;
        }

        const requiredTypes = propType.getTypes().filter((it) => !(it instanceof UndefinedType));
        if (propType.getTypes().length === requiredTypes.length) {
            return property;
        } else if (requiredTypes.length === 0) {
            return new ObjectProperty(property.getName(), new UndefinedType(), false);
        }

        return new ObjectProperty(
            property.getName(),
            requiredTypes.length === 1 ? requiredTypes[0] : new UnionType(requiredTypes),
            false,
        );
    }
}
