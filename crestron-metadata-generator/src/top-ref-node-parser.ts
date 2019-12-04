// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import * as ts from "typescript";
import { Context, NodeParser } from "./node-parser";
import { BaseType } from "./type/base-type";
import { DefinitionType } from "./type/definition-type";

export class TopRefNodeParser implements NodeParser {
    public constructor(
        private childNodeParser: NodeParser,
        private topRef: boolean,
    ) {
    }

    public createType(node: ts.Node, typeName: string, context: Context): BaseType {
        const baseType = this.childNodeParser.createType(node, typeName, context);
        if (this.topRef && !(baseType instanceof DefinitionType)) {
            return new DefinitionType(typeName, baseType);
        } else if (!this.topRef && (baseType instanceof DefinitionType)) {
            return baseType.getType();
        } else {
            return baseType;
        }
    }
}
