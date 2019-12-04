// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { BaseType } from "../type/base-type";
import { BaseError } from "./base-error";

export class UnknownTypeError extends BaseError {
    public constructor(private type: BaseType) {
        super();
    }

    public get name(): string {
        return "UnknownTypeError";
    }
    public get message(): string {
        return `Unknown type "${this.type.getId()}"`;
    }

    public getType(): BaseType {
        return this.type;
    }
}
