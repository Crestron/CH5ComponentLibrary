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
import { OptionalType } from "../type/optional-type";

export class OptionalTypeNodeParser implements SubNodeParser {
    public constructor(
        private childNodeParser: NodeParser,
    ) {
    }
    public supportsNode(node: ts.OptionalTypeNode): boolean {
        return node.kind === ts.SyntaxKind.OptionalType;
    }
    public createType(node: ts.OptionalTypeNode, typeName: string, context: Context): BaseType {
        return new OptionalType(
            this.childNodeParser.createType(node.type, typeName, context),
        );
    }
}
