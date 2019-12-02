// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { isNil } from "lodash";
import * as ts from "typescript";
import { localSymbolAtNode, symbolAtNode } from "../../../src/utils/symbol-at-node";
interface AdvancedMapping {
    node: ts.Node;
    sourceFile: ts.SourceFile;
}

function reflectTypes(program: ts.Program): string[] {
    const typeChecker = program.getTypeChecker();
    const allTypes = new Map<string, AdvancedMapping>();

    const sourceFiles = program.getSourceFiles();
    const userland = sourceFiles.map(x => x.fileName).filter(x => x.indexOf("node_modules") < 0);

    program.getSourceFiles().forEach(
        (sourceFile) => inspectNode(sourceFile, sourceFile, typeChecker, allTypes),
    );

    const types: string[] = [];

    allTypes.forEach((value: AdvancedMapping, key: string) => {
        if (!isNil(userland.find(x => x === value.sourceFile.fileName))) {
            types.push(key);
        }
    });

    return types;
}

function inspectNode(sourceFile: ts.SourceFile, node: ts.Node, typeChecker: ts.TypeChecker, allTypes: Map<string, AdvancedMapping>): void {
    if (
        node.kind === ts.SyntaxKind.InterfaceDeclaration
    ) {

        if (!isExportType(node)) {
            return;
        } else if (isGenericType(node as ts.TypeAliasDeclaration)) {
            return;
        }

        const flag: ts.SymbolFlags = ts.SymbolFlags.Interface;

        const symbols: ts.Symbol[] | undefined = typeChecker.getSymbolsInScope(node, flag);
        let ignore = false;
        if (!isNil(symbols)) {
            for (const symbol of symbols) {
                const jsTags = symbol.getJsDocTags();
                if (!isNil(jsTags) && jsTags.length > 0) {
                    for (const tag of jsTags) {
                        if (tag.name === "ignore" || tag.text === "ignore") {
                            ignore = true;
                            break;
                        }
                    }
                }

                if (ignore) {
                    break;
                }
            }
        }

        if (!ignore) {
            allTypes.set(getFullName(node, typeChecker), <AdvancedMapping>{
                node: node,
                sourceFile: sourceFile,
            });
        }
    } else {
        ts.forEachChild(node, (subnode) => inspectNode(sourceFile, subnode, typeChecker, allTypes));
    }
}

function isExportType(node: ts.Node): boolean {
    const localSymbol = localSymbolAtNode(node);
    return localSymbol ? "exportSymbol" in localSymbol : false;
}
function isGenericType(node: ts.TypeAliasDeclaration): boolean {
    return !!(
        node.typeParameters &&
        node.typeParameters.length > 0
    );
}
function getFullName(node: ts.Node, typeChecker: ts.TypeChecker): string {
    const symbol = symbolAtNode(node)!;
    return typeChecker.getFullyQualifiedName(symbol).replace(/".*"\./, "");
}

export {
    reflectTypes,
};
