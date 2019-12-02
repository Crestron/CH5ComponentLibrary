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
import { UnionType } from "../type/union-type";

export class UnionTypeFormatter implements SubTypeFormatter {
    public constructor(
        private childTypeFormatter: TypeFormatter,
    ) {
    }

    public supportsType(type: UnionType): boolean {
        return type instanceof UnionType;
    }
    public getDefinition(type: UnionType, isRoot?: boolean): Definition {
        const definitions = type.getTypes().map((item) => this.childTypeFormatter.getDefinition(item, isRoot));
        // special case for string literals | string -> string
        let stringType = true;
        let oneNotEnum = false;
        for (const def of definitions) {
            if (def.type !== "string") {
                stringType = false;
                break;
            }
            if (def.enum === undefined) {
                oneNotEnum = true;
            }
        }
        if (stringType && oneNotEnum) {
            return {
                type: "string",
            };
        }

        return definitions.length > 1 ? {
            anyOf: definitions,
        } : definitions[0];
    }
    public getChildren(type: UnionType): BaseType[] {
        return type.getTypes().reduce((result: BaseType[], item) => [
            ...result,
            ...this.childTypeFormatter.getChildren(item),
        ], []);
    }
}
