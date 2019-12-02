// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { flatten } from "lodash";
import * as ts from "typescript";
import { Metadata } from "../types/export/metadata";
import { NoRootTypeError } from "./error/no-root-type-error";
import { Exporter } from "./export/exporter";
import { Context, NodeParser } from "./node-parser";
import { Definition } from "./schema/definition";
import { Schema } from "./schema/schema";
import { TypeFormatter } from "./type-formatter";
import { BaseType } from "./type/base-type";
import { DefinitionType } from "./type/definition-type";
import { localSymbolAtNode, symbolAtNode } from "./utils/symbol-at-node";

export interface RootTypeDefinition {
    rootType: BaseType;
    name: string;
}

export class SchemaGenerator {
    private allTypes: Map<string, ts.Node>;
    public constructor(
        private program: ts.Program,
        private nodeParser: NodeParser,
        private typeFormatter: TypeFormatter,
    ) {
    }

    public getProgram(): ts.Program {
        return this.program;
    }

    public createMetadata(names: string[]): Metadata {
        const schema = this.createSchemaForTypes(names);
        const exporter = Exporter.GetExporterFor(schema);

        exporter.Validate();

        return exporter.ConvertToMetadata();
    }

    public createSchemaForTypes(names: string[]): Schema {
        const rootTypes: RootTypeDefinition[] = names.map(fullName => {
            const rootNode = this.findRootNode(fullName);
            const rootType = this.nodeParser.createType(rootNode, fullName, new Context());
            return <RootTypeDefinition>{
                name: fullName,
                rootType: rootType,
            };
        });

        const rootChildrenDefinitions = this.getRootChildrenDefinitions(rootTypes);
        const definitions = rootTypes
            .reduce((result: Map<string, Definition>, type: RootTypeDefinition) => {
                return result.set(type.name, this.getRootTypeDefinition(type.rootType));
            }, rootChildrenDefinitions);

        return {
            $schema: "http://json-schema.org/draft-06/schema#",
            definitions: definitions,
        };
    }

    private findRootNode(fullName: string): ts.Node {
        const typeChecker = this.program.getTypeChecker();

        if (!this.allTypes) {
            this.allTypes = new Map<string, ts.Node>();

            this.program.getSourceFiles().forEach(
                (sourceFile) => this.inspectNode(sourceFile, typeChecker, this.allTypes),
            );
        }

        if (!this.allTypes.has(fullName)) {
            throw new NoRootTypeError(fullName);
        }

        const root = this.allTypes.get(fullName)!;
        return root;
    }
    private inspectNode(node: ts.Node, typeChecker: ts.TypeChecker, allTypes: Map<string, ts.Node>): void {
        if (
            node.kind === ts.SyntaxKind.InterfaceDeclaration ||
            node.kind === ts.SyntaxKind.EnumDeclaration ||
            node.kind === ts.SyntaxKind.TypeAliasDeclaration
        ) {
            if (!this.isExportType(node)) {
                return;
            } else if (this.isGenericType(node as ts.TypeAliasDeclaration)) {
                return;
            }

            allTypes.set(this.getFullName(node, typeChecker), node);
        } else {
            ts.forEachChild(node, (subnode) => this.inspectNode(subnode, typeChecker, allTypes));
        }
    }

    private isExportType(node: ts.Node): boolean {
        const localSymbol = localSymbolAtNode(node);
        return localSymbol ? "exportSymbol" in localSymbol : false;
    }
    private isGenericType(node: ts.TypeAliasDeclaration): boolean {
        return !!(
            node.typeParameters &&
            node.typeParameters.length > 0
        );
    }
    private getFullName(node: ts.Node, typeChecker: ts.TypeChecker): string {
        const symbol = symbolAtNode(node)!;
        return typeChecker.getFullyQualifiedName(symbol).replace(/".*"\./, "");
    }

    private getRootTypeDefinition(rootType: BaseType): Definition {
        return this.typeFormatter.getDefinition(rootType, true);
    }

    private getRootChildrenDefinitions(rootTypes: RootTypeDefinition[]): Map<string, Definition> {
        const childrenTypes: BaseType[] = flatten(rootTypes.map(rootType => this.typeFormatter.getChildren(rootType.rootType)));
        const children = childrenTypes
            .filter((child) => child instanceof DefinitionType)
            .reduce((result: Map<string, Definition>, child: DefinitionType) => {
                return result.set(child.getId(), this.typeFormatter.getDefinition(child.getType(), false));
            }, new Map<string, Definition>());

        return children;
    }
}
