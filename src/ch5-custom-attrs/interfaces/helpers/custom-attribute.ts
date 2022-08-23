// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICustomAttribute } from "./i-custom-attribute";

export abstract class CustomAttribute<T> implements ICustomAttribute<T> {
    private _type: T | null = null;

    public get type(): T {
        const self: CustomAttribute<T> = this;
        if (!self._type) {
            throw new Error("Type is null ");
        }
        return self._type as T;
    }

    public set type(value: T) {
        this._type = value;
    }
}