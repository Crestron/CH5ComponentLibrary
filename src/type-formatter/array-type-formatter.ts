// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Definition } from "../schema/definition";
import { SubTypeFormatter } from "../sub-type-formatter";
import { TypeFormatter } from "../type-formatter";
import { ArrayType } from "../type/array-type";
import { BaseType } from "../type/base-type";

export class ArrayTypeFormatter implements SubTypeFormatter {
    public constructor(
        private childTypeFormatter: TypeFormatter,
    ) {
    }

    public supportsType(type: ArrayType): boolean {
        return type instanceof ArrayType;
    }
    public getDefinition(type: BaseType, isRoot?: boolean): Definition {
        return {
            type: "array",
            items: this.childTypeFormatter.getDefinition(type, isRoot),
        };
    }
    public getChildren(type: ArrayType): BaseType[] {
        return this.childTypeFormatter.getChildren(type.getItem());
    }
}
