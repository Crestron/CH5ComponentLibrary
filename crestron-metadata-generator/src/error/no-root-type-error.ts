// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { BaseError } from "./base-error";

export class NoRootTypeError extends BaseError {
    public constructor(private type: string) {
        super();
    }

    public get name(): string {
        return "NoRootTypeError";
    }
    public get message(): string {
        return `No root type "${this.type}" found`;
    }

    public getType(): string {
        return this.type;
    }
}
