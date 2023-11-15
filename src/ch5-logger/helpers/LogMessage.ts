// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { TDataLog } from '../types/index';
import { LogLevelEnum } from '../enums/index';
import { LogMessagesFilter } from './LogMessagesFilter';

export class LogMessage {

    public date: Date = {} as Date;
    public readonly level: LogLevelEnum = LogLevelEnum.info; // init with lowest log level
    public readonly message: string = '';
    public readonly source: string = '';

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(data: TDataLog, logFilter: LogMessagesFilter) {

        const currentDate = new Date();
        this.date = currentDate;
        this.message = data.message;
        this.level = data.level;
        this.source = data.source;
    }

    protected getStringTime() {
        const hours = this.date.getHours();
        const minutes = this.date.getMinutes();
        const seconds = this.date.getSeconds();

        return `[${hours}:${minutes}:${seconds}]`;
    }

    public toString() {
        return `[level ${this.level}][${this.source}] ${this.getStringTime()} - ${this.message}`;
    }
}
