// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import * as path from "path";
import * as ts from "typescript";

import { BaseError } from "../error/base-error";
import { DiagnosticError } from "../error/diagnostic-error";
import { UnknownNodeError } from "../error/unknown-node-error";

function getSourceFile(node: ts.Node): ts.SourceFile | undefined {
    let sourceFile: ts.Node | undefined = node.parent;
    while (sourceFile) {
        if (sourceFile.kind === ts.SyntaxKind.SourceFile) {
            return sourceFile as ts.SourceFile;
        }
        sourceFile = sourceFile.parent;
    }

    return undefined;
}

function getNodeLocation(node: ts.Node): [string, number, number] {
    const sourceFile: ts.SourceFile | undefined = getSourceFile(node);
    if (!sourceFile) {
        return ["<unknown file>", 0, 0];
    }

    const lineAndChar: ts.LineAndCharacter = ts.getLineAndCharacterOfPosition(sourceFile, node.getStart(sourceFile));
    return [sourceFile.fileName, lineAndChar.line + 1, lineAndChar.character];
}

export function formatError(error: BaseError): string {
    if (error instanceof DiagnosticError) {
        const rootDir: string = process.cwd().split(path.sep)[0] || "/";
        return ts.formatDiagnostics(error.getDiagnostics(), {
            getCanonicalFileName: (fileName: string) => fileName,
            getCurrentDirectory: () => rootDir,
            getNewLine: () => "\n",
        });
    } else if (error instanceof UnknownNodeError) {
        const unknownNode: ts.Node = error.getReference() || error.getNode();
        const nodeFullText: string = unknownNode.getFullText().trim().split("\n")[0].trim();
        const [sourceFile, lineNumber, charPos]: [string, number, number] = getNodeLocation(unknownNode);
        return `${error.name}: Unknown node "${nodeFullText}" (ts.SyntaxKind = ${error.getNode().kind}) ` +
            `at ${sourceFile}(${lineNumber},${charPos})\n`;
    }

    return `${error.name}: ${error.message}\n`;
}
