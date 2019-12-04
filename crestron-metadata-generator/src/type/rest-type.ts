// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ArrayType } from "./array-type";
import { BaseType } from "./base-type";

export class RestType extends BaseType {
    public constructor(
        private item: ArrayType,
    ) {
        super();
    }

    public getId(): string {
        return "..." + this.item.getId();
    }

    public getType(): ArrayType {
        return this.item;
    }
}
