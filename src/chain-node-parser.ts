// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import * as ts from "typescript";
import { UnknownNodeError } from "./error/unknown-node-error";
import { Context } from "./node-parser";
import { SubNodeParser } from "./sub-node-parser";
import { BaseType } from "./type/base-type";

export class ChainNodeParser implements SubNodeParser {
    public constructor(
        private typeChecker: ts.TypeChecker,
        private nodeParsers: SubNodeParser[],
    ) {
    }

    public addNodeParser(nodeParser: SubNodeParser): this {
        this.nodeParsers.push(nodeParser);
        return this;
    }

    public supportsNode(node: ts.Node): boolean {
        return this.nodeParsers.some((nodeParser) => nodeParser.supportsNode(node));
    }
    public createType(node: ts.Node, typeName: string, context: Context): BaseType {
        return this.getNodeParser(node, context).createType(node, typeName, context);
    }

    private getNodeParser(node: ts.Node, context: Context): SubNodeParser {
        for (const nodeParser of this.nodeParsers) {
            if (nodeParser.supportsNode(node)) {
                return nodeParser;
            }
        }

        throw new UnknownNodeError(node, context.getReference());
    }
}
