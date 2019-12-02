// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { UnknownTypeError } from "./error/unknown-type-error";
import { Definition } from "./schema/definition";
import { SubTypeFormatter } from "./sub-type-formatter";
import { BaseType } from "./type/base-type";

export class ChainTypeFormatter implements SubTypeFormatter {
    public constructor(
        private typeFormatters: SubTypeFormatter[],
    ) {
    }

    public addTypeFormatter(typeFormatter: SubTypeFormatter): this {
        this.typeFormatters.push(typeFormatter);
        return this;
    }

    public supportsType(type: BaseType): boolean {
        return this.typeFormatters.some((typeFormatter) => typeFormatter.supportsType(type));
    }
    public getDefinition(type: BaseType, isRoot?: boolean): Definition {
        return this.getTypeFormatter(type).getDefinition(type, isRoot);
    }
    public getChildren(type: BaseType): BaseType[] {
        return this.getTypeFormatter(type).getChildren(type);
    }

    private getTypeFormatter(type: BaseType): SubTypeFormatter {
        for (const typeFormatter of this.typeFormatters) {
            if (typeFormatter.supportsType(type)) {
                return typeFormatter;
            }
        }

        throw new UnknownTypeError(type);
    }
}
