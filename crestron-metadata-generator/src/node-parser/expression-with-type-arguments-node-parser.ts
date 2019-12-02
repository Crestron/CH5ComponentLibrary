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

export class ExpressionWithTypeArgumentsNodeParser implements SubNodeParser {
    public constructor(
        private typeChecker: ts.TypeChecker,
        private childNodeParser: NodeParser,
    ) {
    }

    public supportsNode(node: ts.ExpressionWithTypeArguments): boolean {
        return node.kind === ts.SyntaxKind.ExpressionWithTypeArguments;
    }
    public createType(node: ts.ExpressionWithTypeArguments, typeName: string, context: Context): BaseType {
        const typeSymbol = this.typeChecker.getSymbolAtLocation(node.expression)!;
        if (typeSymbol.flags & ts.SymbolFlags.Alias) {
            const aliasedSymbol = this.typeChecker.getAliasedSymbol(typeSymbol);
            return this.childNodeParser.createType(
                aliasedSymbol.declarations![0], typeName,
                this.createSubContext(node, typeName, context),
            );
        } else if (typeSymbol.flags & ts.SymbolFlags.TypeParameter) {
            return context.getArgument(typeSymbol.name);
        } else {
            return this.childNodeParser.createType(
                typeSymbol.declarations![0], typeName,
                this.createSubContext(node, typeName, context),
            );
        }
    }

    private createSubContext(node: ts.ExpressionWithTypeArguments, typeName: string, parentContext: Context): Context {
        const subContext = new Context(node);
        if (node.typeArguments && node.typeArguments.length) {
            node.typeArguments.forEach((typeArg) => {
                subContext.pushArgument(this.childNodeParser.createType(typeArg, typeName, parentContext));
            });
        }
        return subContext;
    }
}
