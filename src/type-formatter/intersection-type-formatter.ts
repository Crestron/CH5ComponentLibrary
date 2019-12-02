// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Definition } from "../schema/definition";
import { SubTypeFormatter } from "../sub-type-formatter";
import { TypeFormatter } from "../type-formatter";
import { BaseType } from "../type/base-type";
import { IntersectionType } from "../type/intersection-type";
import { ObjectType } from "../type/object-type";
import { getAllOfDefinitionReducer } from "../utils/all-of-definition";

export class IntersectionTypeFormatter implements SubTypeFormatter {
    public constructor(
        private childTypeFormatter: TypeFormatter,
    ) {
    }

    public supportsType(type: IntersectionType): boolean {
        return type instanceof IntersectionType;
    }
    public getDefinition(type: IntersectionType, isRoot?: boolean): Definition {
        return type.getTypes().reduce(
            getAllOfDefinitionReducer(this.childTypeFormatter, isRoot),
            {type: "object", additionalProperties: false} as Definition);
    }
    public getChildren(type: IntersectionType): BaseType[] {
        return type.getTypes().reduce((result: BaseType[], item) => {
            // Remove the first child, which is the definition of the child itself because we are merging objects.
            // However, if the child is just a reference, we cannot remove it.
            const slice = item instanceof ObjectType ? 0 : 1;
            return [
                ...result,
                ...this.childTypeFormatter.getChildren(item).slice(slice),
            ];
        }
        , []);
    }
}
