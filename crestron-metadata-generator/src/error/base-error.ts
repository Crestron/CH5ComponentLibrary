// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

export abstract class BaseError implements Error {
    private callStack: any;

    public constructor() {
        this.callStack = new Error().stack;
    }

    public get stack(): string {
        return this.callStack;
    }

    public abstract get name(): string;
    public abstract get message(): string;
}
