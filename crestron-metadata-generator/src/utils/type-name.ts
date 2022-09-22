// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { RawType, RawTypeName } from "../schema/raw-type";

export function typeName(value: RawType): RawTypeName {
    if (value === null) {
        return "null";
    }

    const type = typeof value;
    if (
        type === "string" ||
        type === "number" ||
        type === "boolean"
    ) {
        return type;
    }

    /* istanbul ignore next */
    if (Array.isArray(value)) {
        return "array";
    } else if (type === "object") {
        return "object";
    } else {
        return "any";
    }
}
