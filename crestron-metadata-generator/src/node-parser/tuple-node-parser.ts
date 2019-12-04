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
import { TupleType } from "../type/tuple-type";
import { referenceHidden } from "../utils/is-hidden";

export class TupleNodeParser implements SubNodeParser {
    public constructor(
        private typeChecker: ts.TypeChecker,
        private childNodeParser: NodeParser,
    ) {
    }

    public supportsNode(node: ts.TupleTypeNode): boolean {
        return node.kind === ts.SyntaxKind.TupleType;
    }
    public createType(node: ts.TupleTypeNode, typeName: string, context: Context): BaseType {
        const hidden = referenceHidden(this.typeChecker);
        return new TupleType(
            node.elementTypes
                .filter((item) => !hidden(item))
                .map((item) => {
                    return this.childNodeParser.createType(item, typeName, context);
                }),
        );
    }
}
