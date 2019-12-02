// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import * as ts from "typescript";
import { Context, NodeParser } from "../node-parser";
import { SubNodeParser } from "../sub-node-parser";
import { BaseType } from "../type/base-type";
import { LiteralType } from "../type/literal-type";
import { TupleType } from "../type/tuple-type";
import { UnionType } from "../type/union-type";

export class CallExpressionParser implements SubNodeParser {
    public constructor(
        private typeChecker: ts.TypeChecker,
        private childNodeParser: NodeParser,
    ) {
    }

    public supportsNode(node: ts.CallExpression): boolean {
        return node.kind === ts.SyntaxKind.CallExpression;
    }
    public createType(node: ts.CallExpression, typeName: string, context: Context): BaseType {
        const type = this.typeChecker.getTypeAtLocation(node);

        // FIXME: make this general
        return new TupleType([new UnionType(
            (type as any).typeArguments[0].types.map((t: any) => new LiteralType(t.value)),
        )]);
    }
}
