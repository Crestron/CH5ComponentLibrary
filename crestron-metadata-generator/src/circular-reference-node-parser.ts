// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import * as ts from "typescript";
import { Context } from "./node-parser";
import { SubNodeParser } from "./sub-node-parser";
import { BaseType } from "./type/base-type";
import { ReferenceType } from "./type/reference-type";

export class CircularReferenceNodeParser implements SubNodeParser {
    private circular = new Map<string, BaseType>();

    public constructor(
        private childNodeParser: SubNodeParser,
    ) {
    }

    public supportsNode(node: ts.Node): boolean {
        return this.childNodeParser.supportsNode(node);
    }
    public createType(node: ts.Node, typeName: string, context: Context): BaseType {
        const key = this.createCacheKey(node, context);
        if (this.circular.has(key)) {
            return this.circular.get(key)!;
        }

        const reference = new ReferenceType();
        this.circular.set(key, reference);
        reference.setType(this.childNodeParser.createType(node, typeName, context));
        this.circular.delete(key);

        return reference.getType();
    }

    private createCacheKey(node: ts.Node | undefined, context: Context): string {
        const ids: number[] = [];
        while (node) {
            ids.push(node.pos, node.end);
            node = node.parent;
        }
        return ids.join("-") + "<" + context.getArguments().map((arg) => arg.getId()).join(",") + ">";
    }
}
