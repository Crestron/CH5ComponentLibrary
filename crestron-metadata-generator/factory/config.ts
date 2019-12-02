// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

export interface OptionalConfig {
    expose: "all" | "none" | "export";
    topRef: boolean;
    jsDoc: "none" | "extended" | "basic";
    sortProps: boolean;
}
export interface ProgramConfig extends OptionalConfig {
    path: string;
    type: string;
    allTypes: string;
}

export const DEFAULT_CONFIG: OptionalConfig = {
    expose: "export",
    topRef: false,
    jsDoc: "extended",
    sortProps: true,
};
