// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { AnyType } from "../type/any-type";
import { BaseType } from "../type/base-type";
import { IntersectionType } from "../type/intersection-type";
import { LiteralType } from "../type/literal-type";
import { ObjectType } from "../type/object-type";
import { TupleType } from "../type/tuple-type";
import { UnionType } from "../type/union-type";
import { derefType } from "./deref-type";
import { uniqueArray } from "./unique-array";

function uniqueLiterals(types: LiteralType[]): LiteralType[] {
    const values = types.map((type) => type.getValue());
    return uniqueArray(values).map((value) => new LiteralType(value));
}

export function getTypeKeys(type: BaseType): LiteralType[] {
    type = derefType(type);

    if (
        type instanceof IntersectionType ||
        type instanceof UnionType
    ) {
        return uniqueLiterals(type.getTypes().reduce((result: LiteralType[], subType) => [
            ...result,
            ...getTypeKeys(subType),
        ], []));
    }

    if (type instanceof TupleType) {
        return type.getTypes().map((it, idx) => new LiteralType(idx));
    }
    if (type instanceof ObjectType) {
        const objectProperties = type.getProperties().map((it) => new LiteralType(it.getName()));
        return uniqueLiterals(type.getBaseTypes().reduce((result: LiteralType[], parentType) => [
            ...result,
            ...getTypeKeys(parentType),
        ], objectProperties));
    }

    return [];
}

export function getTypeByKey(type: BaseType, index: LiteralType): BaseType | undefined {
    type = derefType(type);

    if (
        type instanceof IntersectionType ||
        type instanceof UnionType
    ) {
        for (const subType of type.getTypes()) {
            const subKeyType = getTypeByKey(subType, index);
            if (subKeyType) {
                return subKeyType;
            }
        }

        return undefined;
    }

    if (type instanceof TupleType) {
        return type.getTypes().find((it, idx) => idx === index.getValue());
    }
    if (type instanceof ObjectType) {
        const property = type.getProperties().find((it) => it.getName() === index.getValue());
        if (property) {
            return property.getType();
        }

        const additionalProperty = type.getAdditionalProperties();
        if (additionalProperty instanceof BaseType) {
            return additionalProperty;
        } else if (additionalProperty === true) {
            return new AnyType();
        }

        for (const subType of type.getBaseTypes()) {
            const subKeyType = getTypeByKey(subType, index);
            if (subKeyType) {
                return subKeyType;
            }
        }

        return undefined;
    }

    return undefined;
}
