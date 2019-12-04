// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { BaseType } from "./base-type";

export class ReferenceType extends BaseType {
    private type: BaseType;

    public getId(): string {
        return this.type.getId();
    }

    public getType(): BaseType {
        return this.type;
    }
    public setType(type: BaseType): void {
        this.type = type;
    }
}
