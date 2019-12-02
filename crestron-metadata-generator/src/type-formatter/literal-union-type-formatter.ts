// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Definition } from "../schema/definition";
import { SubTypeFormatter } from "../sub-type-formatter";
import { BaseType } from "../type/base-type";
import { LiteralType } from "../type/literal-type";
import { NullType } from "../type/null-type";
import { UnionType } from "../type/union-type";
import { uniqueArray } from "../utils/unique-array";

export class LiteralUnionTypeFormatter implements SubTypeFormatter {
    public supportsType(type: UnionType): boolean {
        return type instanceof UnionType && this.isLiteralUnion(type);
    }
    public getDefinition(type: UnionType, isRoot?: boolean): Definition {
        const values: (string | number | boolean | null)[] = uniqueArray(
            type.getTypes().map((item: LiteralType | NullType) => this.getLiteralValue(item)));
        const types: string[] = uniqueArray(
            type.getTypes().map((item: LiteralType | NullType) => this.getLiteralType(item)));
        if (types.length === 1) {
            return {
                type: types[0],
                enum: values,
                isAliasType: true,
            };
        } else {
            return {
                type: types,
                enum: values,
                isAliasType: true,
            };
        }
    }
    public getChildren(type: UnionType): BaseType[] {
        return [];
    }

    private isLiteralUnion(type: UnionType): boolean {
        return type.getTypes().every((item) => item instanceof LiteralType || item instanceof NullType);
    }
    private getLiteralValue(value: LiteralType | NullType): string | number | boolean | null {
        return value instanceof LiteralType ? value.getValue() : null;
    }
    private getLiteralType(value: LiteralType | NullType): string {
        return value instanceof LiteralType ? typeof value.getValue() : "null";
    }
}
