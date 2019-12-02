// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import * as ts from "typescript";
import { LogicError } from "../error/logic-error";
import { Context, NodeParser } from "../node-parser";
import { SubNodeParser } from "../sub-node-parser";
import { BaseType } from "../type/base-type";
import { LiteralType } from "../type/literal-type";
import { getTypeByKey } from "../utils/type-keys";

export class IndexedAccessTypeNodeParser implements SubNodeParser {
    public constructor(
        private typeChecker: ts.TypeChecker,
        private childNodeParser: NodeParser,
    ) {
    }

    public supportsNode(node: ts.IndexedAccessTypeNode): boolean {
        return node.kind === ts.SyntaxKind.IndexedAccessType;
    }
    public createType(node: ts.IndexedAccessTypeNode, typeName: string, context: Context): BaseType {
        const indexType = this.childNodeParser.createType(node.indexType, typeName, context);
        if (!(indexType instanceof LiteralType)) {
            throw new LogicError(`Unexpected type "${indexType.getId()}" (expected "LiteralType")`);
        }

        const objectType = this.childNodeParser.createType(node.objectType, typeName, context);
        const propertyType = getTypeByKey(objectType, indexType);
        if (!propertyType) {
            throw new LogicError(`Invalid index "${indexType.getValue()}" in type "${objectType.getId()}"`);
        }

        return propertyType;
    }
}
