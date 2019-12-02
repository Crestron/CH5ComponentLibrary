// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import * as ts from "typescript";
import { LogicError } from "../error/logic-error";
import { Context, NodeParser } from "../node-parser";
import { SubNodeParser } from "../sub-node-parser";
import { BaseType } from "../type/base-type";
import { LiteralType } from "../type/literal-type";
import { ObjectProperty, ObjectType } from "../type/object-type";
import { StringType } from "../type/string-type";
import { UnionType } from "../type/union-type";
import { derefType } from "../utils/deref-type";

export class MappedTypeNodeParser implements SubNodeParser {
    public constructor(
        private typeChecker: ts.TypeChecker,
        private childNodeParser: NodeParser,
    ) {
    }

    public supportsNode(node: ts.MappedTypeNode): boolean {
        return node.kind === ts.SyntaxKind.MappedType;
    }

    public createType(node: ts.MappedTypeNode, typeName: string, context: Context): BaseType {
        const constraintType = this.childNodeParser.createType(node.typeParameter.constraint!, typeName, context);
        const keyListType = derefType(constraintType);
        const id = `indexed-type-${node.getFullStart()}`;

        if (keyListType instanceof UnionType) {
            // Key type resolves to a set of known properties
            return new ObjectType(id, [], this.getProperties(node, typeName, keyListType, context), false);
        } else if (keyListType instanceof StringType) {
            // Key type widens to `string`
            return new ObjectType(id, [], [], this.childNodeParser.createType(node.type!, typeName, context));
        } else {
            throw new LogicError(
                // tslint:disable-next-line:max-line-length
                `Unexpected key type "${constraintType.getId()}" for type "${node.getText()}" (expected "UnionType" or "StringType")`,
            );
        }
    }

    private getProperties(node: ts.MappedTypeNode, typeName: string, keyListType: UnionType, context: Context): ObjectProperty[] {
        return keyListType.getTypes().reduce((result: ObjectProperty[], key: LiteralType) => {
            const objectProperty = new ObjectProperty(
                key.getValue() as string,
                this.childNodeParser.createType(node.type!, typeName, this.createSubContext(node, key, context)),
                !node.questionToken,
            );

            result.push(objectProperty);
            return result;
        }, []);
    }

    private createSubContext(node: ts.MappedTypeNode, key: LiteralType, parentContext: Context): Context {
        const subContext = new Context(node);

        parentContext.getParameters().forEach((parentParameter) => {
            subContext.pushParameter(parentParameter);
            subContext.pushArgument(parentContext.getArgument(parentParameter));
        });

        subContext.pushParameter(node.typeParameter.name.text);
        subContext.pushArgument(key);

        return subContext;
    }
}
