// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Definition } from "../schema/definition";
import { SubTypeFormatter } from "../sub-type-formatter";
import { TypeFormatter } from "../type-formatter";
import { BaseType } from "../type/base-type";
import { RestType } from "../type/rest-type";

export class RestTypeFormatter implements SubTypeFormatter {
    public constructor(
        private childTypeFormatter: TypeFormatter,
    ) {
    }

    public supportsType(type: RestType): boolean {
        return type instanceof RestType;
    }
    public getDefinition(type: RestType, isRoot?: boolean): Definition {
        return this.childTypeFormatter.getDefinition(type.getType(), isRoot);
    }
    public getChildren(type: RestType): BaseType[] {
        return this.childTypeFormatter.getChildren(type.getType());
    }
}
