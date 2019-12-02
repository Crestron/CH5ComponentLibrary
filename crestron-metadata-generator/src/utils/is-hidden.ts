// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import * as ts from "typescript";
import { symbolAtNode } from "./symbol-at-node";

export function isHidden(symbol: ts.Symbol): boolean {
    const jsDocTags: ts.JSDocTagInfo[] = symbol.getJsDocTags();
    if (!jsDocTags || !jsDocTags.length) {
        return false;
    }

    const jsDocTag: ts.JSDocTagInfo | undefined = jsDocTags.find(
        (tag: ts.JSDocTagInfo) => tag.name === "hide");
    return !!jsDocTag;
}

export function isNodeHidden(node: ts.Node): boolean | null {
    const symbol = symbolAtNode(node);
    if (!symbol) {
        return null;
    }

    return isHidden(symbol);
}

export function referenceHidden(typeChecker: ts.TypeChecker) {
    return function(node: ts.Node) {
        if (node.kind === ts.SyntaxKind.TypeReference) {
            return isHidden(typeChecker.getSymbolAtLocation(
                (<ts.TypeReferenceNode> node).typeName)!);
        }

        return isNodeHidden(node);
    };
}
