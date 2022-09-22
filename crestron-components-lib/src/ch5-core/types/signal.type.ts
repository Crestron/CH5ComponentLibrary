// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Ch5Signal } from "../ch5-signal";

export type TSignal = boolean | number | string | object;

export type TCh5Signal = Ch5Signal<boolean> | Ch5Signal<number> | Ch5Signal<string> | Ch5Signal<object> | null;

export type TSignalBagByType = {
    // "boolean": { [key:string]:Ch5Signal<boolean> | null },
    // "number":  { [key:string]:Ch5Signal<number> | null },
    // "string":  { [key:string]:Ch5Signal<string> | null },
    // "object":  { [key:string]:Ch5Signal<object> | null },
    // [key: string]: { [key:string]:Ch5Signal<boolean>|Ch5Signal<number>|Ch5Signal<string>|Ch5Signal<object>|null }
    "boolean": { [key:string]:object | null };
    "number":  { [key:string]:object | null };
    "object":  { [key:string]:object | null };
    "string":  { [key:string]:object | null };
    [key: string]: { [key:string]:object|null };
}
