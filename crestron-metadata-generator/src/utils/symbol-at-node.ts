// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import * as ts from "typescript";

export function symbolAtNode(node: ts.Node): ts.Symbol | undefined {
    return (node as any).symbol;
}
export function localSymbolAtNode(node: ts.Node): ts.Symbol | undefined {
    return (node as any).localSymbol;
}
