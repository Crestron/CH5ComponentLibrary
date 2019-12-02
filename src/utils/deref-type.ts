// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { AliasType } from "../type/alias-type";
import { AnnotatedType } from "../type/annotated-type";
import { BaseType } from "../type/base-type";
import { DefinitionType } from "../type/definition-type";
import { ReferenceType } from "../type/reference-type";

export function derefType(type: BaseType): BaseType {
    if (
        type instanceof ReferenceType ||
        type instanceof DefinitionType ||
        type instanceof AliasType ||
        type instanceof AnnotatedType
    ) {
        return derefType(type.getType());
    }

    return type;
}
