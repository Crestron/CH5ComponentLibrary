// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { AssertionError } from "../error/assertion-error";

export function assertDefined<TValue>(
    value: TValue | undefined,
    message?: string,
): TValue {
    if (value === undefined) {
        throw new AssertionError(message || `Value "${value}" should not be undefined`);
    }

    return value;
}

export function assertInstanceOf<TType>(
    value: any,
    type: {new (...args: any[]): TType},
    message?: string,
): TType {
    if (!(value instanceof type)) {
        throw new AssertionError(`Value "${value}" should be instanceof "${type.name}"`);
    }

    return value;
}
