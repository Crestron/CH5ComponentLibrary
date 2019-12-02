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
import { RestType } from "../type/rest-type";

export class RestTypeNodeParser implements SubNodeParser {
    public constructor(
        private childNodeParser: NodeParser,
    ) {
    }
    public supportsNode(node: ts.RestTypeNode): boolean {
        return node.kind === ts.SyntaxKind.RestType;
    }
    public createType(node: ts.RestTypeNode, typeName: string, context: Context): BaseType {
        return new RestType(
            this.childNodeParser.createType(node.type, typeName, context) as ArrayType,
        );
    }
}
