// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { LogicError } from "../error/logic-error";
import { Definition } from "../schema/definition";
import { SubTypeFormatter } from "../sub-type-formatter";
import { BaseType } from "../type/base-type";
import { PrimitiveType } from "../type/primitive-type";
import { UnionType } from "../type/union-type";
import { uniqueArray } from "../utils/unique-array";

import { BooleanType } from "../type/boolean-type";
import { NullType } from "../type/null-type";
import { NumberType } from "../type/number-type";
import { StringType } from "../type/string-type";

export class PrimitiveUnionTypeFormatter implements SubTypeFormatter {
    public supportsType(type: UnionType): boolean {
        return type instanceof UnionType && this.isPrimitiveUnion(type);
    }
    public getDefinition(type: UnionType, isRoot?: boolean): Definition {
        return {
            type: uniqueArray(
                type.getTypes().map((item) => this.getPrimitiveType(item)),
            ),
        };
    }
    public getChildren(type: UnionType): BaseType[] {
        return [];
    }

    private isPrimitiveUnion(type: UnionType): boolean {
        return type.getTypes().every((item) => item instanceof PrimitiveType);
    }
    private getPrimitiveType(item: BaseType): string {
        if (item instanceof StringType) {
            return "string";
        } else if (item instanceof NumberType) {
            return "number";
        } else if (item instanceof BooleanType) {
            return "boolean";
        } else if (item instanceof NullType) {
            return "null";
        }

        throw new LogicError("Unexpected code branch");
    }
}
