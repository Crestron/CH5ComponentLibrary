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

export class TypeofNodeParser implements SubNodeParser {
    public constructor(
        private typeChecker: ts.TypeChecker,
        private childNodeParser: NodeParser,
    ) {
    }

    public supportsNode(node: ts.TypeQueryNode): boolean {
        return node.kind === ts.SyntaxKind.TypeQuery;
    }

    public createType(node: ts.TypeQueryNode, typeName: string, context: Context): BaseType {
        const symbol = this.typeChecker.getSymbolAtLocation(node.exprName)!;

        const valueDec = (<any>symbol.valueDeclaration);

        if (valueDec.type) {
            return this.childNodeParser.createType(valueDec.type, typeName, context);
        } else if (valueDec.initializer) {
            return this.childNodeParser.createType(valueDec.initializer, typeName, context);
        } else {
            throw new LogicError(`Invalid type query "${valueDec.getFullText()}"`);
        }
    }
}
