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
import { IntersectionType } from "../type/intersection-type";
import { referenceHidden } from "../utils/is-hidden";

export class IntersectionNodeParser implements SubNodeParser {
    public constructor(
        private typeChecker: ts.TypeChecker,
        private childNodeParser: NodeParser,
    ) {
    }

    public supportsNode(node: ts.IntersectionTypeNode): boolean {
        return node.kind === ts.SyntaxKind.IntersectionType;
    }
    public createType(node: ts.IntersectionTypeNode, typeName: string, context: Context): BaseType {
        const hidden = referenceHidden(this.typeChecker);
        return new IntersectionType(
            node.types
                .filter((subnode) => !hidden(subnode))
                .map((subnode) => this.childNodeParser.createType(subnode, typeName, context)),
        );
    }
}
