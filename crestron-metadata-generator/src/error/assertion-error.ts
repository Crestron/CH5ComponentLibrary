// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { BaseError } from "./base-error";

export class AssertionError extends BaseError {
    public constructor(private details: string) {
        super();
    }

    public get name(): string {
        return "AssertionError";
    }
    public get message(): string {
        return `Assertion error: ${this.details}`;
    }

    public getDetails(): string {
        return this.details;
    }
}
