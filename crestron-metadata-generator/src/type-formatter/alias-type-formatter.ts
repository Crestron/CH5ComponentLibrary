// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Definition } from "../schema/definition";
import { SubTypeFormatter } from "../sub-type-formatter";
import { TypeFormatter } from "../type-formatter";
import { AliasType } from "../type/alias-type";
import { BaseType } from "../type/base-type";

export class AliasTypeFormatter implements SubTypeFormatter {
    public constructor(
        private childTypeFormatter: TypeFormatter,
    ) {
    }

    public supportsType(type: AliasType): boolean {
        return type instanceof AliasType;
    }
    public getDefinition(type: AliasType, isRoot?: boolean): Definition {
        return this.childTypeFormatter.getDefinition(type.getType(), isRoot);
    }
    public getChildren(type: AliasType): BaseType[] {
        return this.childTypeFormatter.getChildren(type.getType());
    }
}
