// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { AbstractAppender } from "../appender/AbstractAppender";
import { TDataLog, TLogMessageType } from "../types/index";
import { LogMessage } from "../helpers/index";
import { LogLevelEnum } from "../enums/index";
import isNil from 'lodash/isNil';
import {LogMessagesFilter} from "../helpers/LogMessagesFilter";

export class Logger {

    private _appender: AbstractAppender = {} as AbstractAppender;
    private _logFilter: LogMessagesFilter = new LogMessagesFilter();

    public constructor(appender: AbstractAppender, logFilter?: LogMessagesFilter) {
        if (!(appender instanceof AbstractAppender)) {
            throw Error('Appender is not defined');
        }

        this.appender = appender;
        this.addWindowErrorListener();

        this.log = this.log.bind(this);
        this.info = this.info.bind(this);
        this.warn = this.warn.bind(this);
        this.error = this.error.bind(this);

        if (logFilter) {
            this.logFilter = logFilter;
        }
    }

    // Used to change the log filter
    set logFilter(logFilter: LogMessagesFilter) {
        if (!isNil(logFilter)) {
            this._logFilter = new LogMessagesFilter(logFilter.level, logFilter.source, logFilter.regularExpression);
            return;
        }

        this._logFilter = new LogMessagesFilter();
    }

    get logFilter(): LogMessagesFilter {
        return this._logFilter;
    }

    public log(...message: TLogMessageType) {
        const formattedMessage = this.formatMessage(0, message.join(' '));
        this.checkAndAppendMessage(formattedMessage);
    }

    public info(...message: TLogMessageType) {
        const formattedMessage = this.formatMessage(1, message.join(' '));
        this.checkAndAppendMessage(formattedMessage);
    }

    public warn(message: string) {
        const formattedMessage = this.formatMessage(2, message);
        this.checkAndAppendMessage(formattedMessage);
    }

    public error(message: string, line?: number) {
        const formattedMessage = this.formatMessage(3, message);
        this.checkAndAppendMessage(formattedMessage);
    }

    public windowErrorListener(error: ErrorEvent | CustomEvent) {
        if (error instanceof ErrorEvent) {
            this.error(error.message, error.lineno);
        } else if (error instanceof CustomEvent) {
            this.error(error.detail);
        }
    }

    public addWindowErrorListener() {
        window.addEventListener('error', (error: ErrorEvent) => {
            this.windowErrorListener(error);
        });
    }

    public set appender(appender: AbstractAppender) {
        if (appender instanceof AbstractAppender) {
            this._appender = appender;
        }
    }

    public get appender(): AbstractAppender {
        return this._appender;
    }

    protected formatMessage(level: LogLevelEnum, message: string) {
        const sourceDelimiterIndex: number = message.indexOf(':');
        const source: string = sourceDelimiterIndex > -1 ? message.slice(0, sourceDelimiterIndex) : '';
        const extractedMessage: string = sourceDelimiterIndex > -1 ? message.slice(sourceDelimiterIndex) : message;
        const data: TDataLog = {
            level,
            message: extractedMessage,
            source,
        };

        const logMessage = new LogMessage(data, this.logFilter);

        return logMessage;
    }

    private checkAndAppendMessage(logMessage: LogMessage) {
        if (logMessage.canBeDisplayed) {
            this.appender.log(logMessage);
        }
    }
}
