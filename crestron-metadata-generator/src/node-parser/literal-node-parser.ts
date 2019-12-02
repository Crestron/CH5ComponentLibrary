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

export class LiteralNodeParser implements SubNodeParser {
    public constructor(
        private typeChecker: ts.TypeChecker,
        private childNodeParser: NodeParser,
    ) {
    }

    public supportsNode(node: ts.LiteralTypeNode): boolean {
        return node.kind === ts.SyntaxKind.LiteralType;
    }
    public createType(node: ts.LiteralTypeNode, typeName: string, context: Context): BaseType {
        return this.childNodeParser.createType(node.literal, typeName, context);
    }
}
