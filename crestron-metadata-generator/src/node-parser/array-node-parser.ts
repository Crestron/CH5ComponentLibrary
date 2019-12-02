// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import * as ts from "typescript";
import { Context, NodeParser } from "../node-parser";
import { SubNodeParser } from "../sub-node-parser";
import { ArrayType } from "../type/array-type";
import { BaseType } from "../type/base-type";

export class ArrayNodeParser implements SubNodeParser {
    public constructor(
        private childNodeParser: NodeParser,
    ) {
    }

    public supportsNode(node: ts.ArrayTypeNode): boolean {
        return node.kind === ts.SyntaxKind.ArrayType;
    }
    public createType(node: ts.ArrayTypeNode, typeName: string, context: Context): BaseType {
        return new ArrayType(
            this.childNodeParser.createType(node.elementType, typeName, context),
        );
    }
}
