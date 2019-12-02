// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { DebugConfiguration } from "../../debug/debug-configuration";
import { IStringBuilder } from "./i-string-builder";

export class StringBuilder implements IStringBuilder {
    private returnLines: any = [];

    public Append(value: string): StringBuilder {
        this.returnLines.push(value);
        return this;
    }

    public AppendLine(value: string): StringBuilder {
        this.Append(value);
        this.Append(DebugConfiguration.NEWLINE);
        return this;
    }

    public Clear(): StringBuilder {
        this.returnLines = [];
        return this;
    }

    public ToString(): string {
        return this.returnLines.join("");
    }
}
