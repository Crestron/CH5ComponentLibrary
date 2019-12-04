// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import * as ts from "typescript";
import { Context } from "../node-parser";
import { SubNodeParser } from "../sub-node-parser";
import { BaseType } from "../type/base-type";
import { LiteralType } from "../type/literal-type";

export class NumberLiteralNodeParser implements SubNodeParser {
    public supportsNode(node: ts.NumericLiteral): boolean {
        return node.kind === ts.SyntaxKind.NumericLiteral;
    }
    public createType(node: ts.NumericLiteral, typeName: string, context: Context): BaseType {
        return new LiteralType(parseFloat(node.text));
    }
}
