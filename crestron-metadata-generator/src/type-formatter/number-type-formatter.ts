// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Definition } from "../schema/definition";
import { SubTypeFormatter } from "../sub-type-formatter";
import { BaseType } from "../type/base-type";
import { NumberType } from "../type/number-type";

export class NumberTypeFormatter implements SubTypeFormatter {
    public supportsType(type: NumberType): boolean {
        return type instanceof NumberType;
    }
    public getDefinition(type: NumberType, isRoot?: boolean): Definition {
        return {type: "number"};
    }
    public getChildren(type: NumberType): BaseType[] {
        return [];
    }
}
