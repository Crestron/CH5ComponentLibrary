// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import * as data from "../../debugging.json";

export class DebugConfiguration {
    public static CONSOLE_PREFIX = "[Metadata Extractor]";
    public static CONSOLE_SEPARATOR = ":";
    public static NEWLINE = "\r\n";
    public static TAB = "\t";

    public static shouldPrintToOutputStream(): boolean {
        return DebugConfiguration.convertToBoolean(data.outputEnabled);
    }

    public static shouldPrintToConsole(): boolean {
        return  DebugConfiguration.convertToBoolean(data.consoleEnabled);
    }

    private static convertToBoolean(input: string): boolean {
        try {
            return JSON.parse(input);
        } catch (e) {
            return false;
        }
    }
}
