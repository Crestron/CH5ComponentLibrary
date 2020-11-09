// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { LogLevelEnum } from '../enums/index';

export type TDataLog = {
    level: LogLevelEnum;
    source: string;
    message: string;
}

export type TLogMessageType = any[];

export type TAppenderConfig = {
    hostname: string;   // hostname or IP
    port: string;
    secure: boolean;
};