// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

export interface PartialConfig {
    expose: "all" | "none" | "export";
    topRef: boolean;
    jsDoc: "none" | "extended" | "basic";
    strictTuples?: boolean;
    allTypes?: boolean;
}

export interface Config extends PartialConfig {
    path: string;
    types: string[];
    writeFileTo: string | undefined;
    allTypes?: boolean;
}

export const DEFAULT_CONFIG: PartialConfig = {
    expose: "export",
    topRef: false,
    jsDoc: "extended",
    strictTuples: false,
    allTypes: false,
};
