// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Definition } from "../schema/definition";
import { SubTypeFormatter } from "../sub-type-formatter";
import { BaseType } from "../type/base-type";
import { EnumType, EnumValue } from "../type/enum-type";
import { uniqueArray } from "../utils/unique-array";

export class EnumTypeFormatter implements SubTypeFormatter {
    public supportsType(type: EnumType): boolean {
        return type instanceof EnumType;
    }
    public getDefinition(type: EnumType, isRoot?: boolean): Definition {
        const values = uniqueArray(type.getValues());
        const types = uniqueArray(values.map((value) => this.getValueType(value)));
        return {
            type: types.length === 1 ? types[0] : types,
            enum: values,
            isAliasType: true,
        };
    }
    public getChildren(type: EnumType): BaseType[] {
        return [];
    }

    private getValueType(value: EnumValue): string {
        return value === null ? "null" : typeof value;
    }
}
