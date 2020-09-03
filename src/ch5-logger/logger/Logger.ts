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
import { LogMessagesFilter } from "../helpers/LogMessagesFilter";
import { BehaviorSubject } from 'rxjs';

export class Logger {
    private static _instance: Logger;
    private _subscribeDockerStatus: BehaviorSubject<string> = new BehaviorSubject("");    
    private _appender: AbstractAppender = {} as AbstractAppender;
    private _logFilter: LogMessagesFilter = new LogMessagesFilter();
    private _messagesQueue: LogMessage[] = [];

    public static getInstance(appender: AbstractAppender, logFilter?: LogMessagesFilter): Logger {
        if (Logger._instance === undefined) {
            Logger._instance = new Logger(appender, logFilter)
        }
        return Logger._instance;
    }

    private clearInstance(){
        if (Logger._instance !== undefined) {
            this.appender.clearInstance();
            delete Logger._instance;
        }
    }

    private constructor(appender: AbstractAppender, logFilter?: LogMessagesFilter) {
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

        this._appender.isInitializedSubject.subscribe(() => {
            this.checkAndAppendMessages();
        });
    }

    public get subscribeDockerStatus(): BehaviorSubject<string> {
        return this._subscribeDockerStatus;
    }
    
    public set subscribeDockerStatus(value: BehaviorSubject<string>) {
        this._subscribeDockerStatus = value;
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
        this.queueMessage(formattedMessage);
    }

    public info(...message: TLogMessageType) {
        const formattedMessage = this.formatMessage(1, message.join(' '));
        this.queueMessage(formattedMessage);
    }

    public warn(message: string) {
        const formattedMessage = this.formatMessage(2, message);
        this.queueMessage(formattedMessage);
    }

    public error(message: string, line?: number) {
        const formattedMessage = this.formatMessage(3, message);
        this.queueMessage(formattedMessage);
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

    /**
     * All messages are queued until the configuration is loaded
     * After that, the messages are removed in the same order they arrived (FIFO)
     */
    private checkAndAppendMessages() {
        while (this._messagesQueue.length > 0) {
            if (!this._appender.isInitialized) {
                return;
            }

            const firstMessage: LogMessage | undefined = this._messagesQueue.shift();

            // only log message if it passes the filter check
            if (firstMessage && this.logFilter.applyFilter(firstMessage)) {
                this.appender.log(firstMessage);
            }
        }
    }

    /**
     * Every message is queued at logging time, but is not displayed
     * until the configuration is loaded.
     * @param logMessage 
     */
    private queueMessage(logMessage: LogMessage) {
        this._messagesQueue.push(logMessage);
        this.checkAndAppendMessages();
    }
}
