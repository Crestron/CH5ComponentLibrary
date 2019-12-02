// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Definition } from "./schema/definition";
import { SubTypeFormatter } from "./sub-type-formatter";
import { BaseType } from "./type/base-type";

export class CircularReferenceTypeFormatter implements SubTypeFormatter {
    private definition = new Map<BaseType, Definition>();
    private children = new Map<BaseType, BaseType[]>();

    public constructor(
        private childTypeFormatter: SubTypeFormatter,
    ) {
    }

    public supportsType(type: BaseType): boolean {
        return this.childTypeFormatter.supportsType(type);
    }
    public getDefinition(type: BaseType, isRoot?: boolean): Definition {
        if (this.definition.has(type)) {
            return this.definition.get(type)!;
        }

        const definition: Definition = {};
        this.definition.set(type, definition);
        Object.assign(definition, this.childTypeFormatter.getDefinition(type, isRoot));
        return definition;
    }
    public getChildren(type: BaseType): BaseType[] {
        if (this.children.has(type)) {
            return this.children.get(type)!;
        }

        const children: BaseType[] = [];
        this.children.set(type, children);
        children.push(...this.childTypeFormatter.getChildren(type));
        return children;
    }
}
