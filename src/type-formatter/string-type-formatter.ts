// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Definition } from "../schema/definition";
import { SubTypeFormatter } from "../sub-type-formatter";
import { BaseType } from "../type/base-type";
import { StringType } from "../type/string-type";

export class StringTypeFormatter implements SubTypeFormatter {
    public supportsType(type: StringType): boolean {
        return type instanceof StringType;
    }
    public getDefinition(type: StringType, isRoot?: boolean): Definition {
        return {type: "string"};
    }
    public getChildren(type: StringType): BaseType[] {
        return [];
    }
}
