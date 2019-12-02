// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import * as ts from "typescript";
import { BaseError } from "./base-error";

export class UnknownNodeError extends BaseError {
    public constructor(private node: ts.Node, private reference?: ts.Node) {
        super();
    }

    public get name(): string {
        return "UnknownNodeError";
    }
    public get message(): string {
        return `Unknown node "${this.node.getFullText()}`;
    }

    public getNode(): ts.Node {
        return this.node;
    }
    public getReference(): ts.Node | undefined {
        return this.reference;
    }
}
