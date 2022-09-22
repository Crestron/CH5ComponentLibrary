/*
 * Copyright (C) 2018 to the present, Crestron Electronics, Inc.
 * All rights reserved.
 * No part of this software may be reproduced in any form, machine
 * or natural, without the express written consent of Crestron Electronics.
 * Use of this source code is subject to the terms of the Crestron Software License Agreement
 * under which you licensed this source code.
 */

import { TDataLog } from '../types';
import { LogLevelEnum } from '../enums';
import isNil from 'lodash/isNil';
import {Ch5Debug} from '../../ch5-core/ch5-debug';

/**
 * Check if the log message should be displayed after the filter is applied on the message
 */
export class LogMessagesFilter {

    private _regularExpression: string = '';

    public level: LogLevelEnum;
    public source: string = Ch5Debug.getConfigKeyValue(Ch5Debug.DEBUG_MESSAGE_FILTER_SOURCE_KEY) as string;

    /**
     * If there is a configuration for default log level, use it
     * If no config is found for filter level, use warning as default log level
     */
    public static getDefaultLevel(): LogLevelEnum {
        const defaultLevel = Ch5Debug.getConfigKeyValue(Ch5Debug.DEBUG_MESSAGE_FILTER_LEVEL_KEY);
        return defaultLevel ? defaultLevel as LogLevelEnum : LogLevelEnum.warning;
    }

    constructor(level?: LogLevelEnum, source?: string, regexStr?: string) {
        this.level = !isNil(level) ? level : LogMessagesFilter.getDefaultLevel();
        this.regularExpression = regexStr ? regexStr : this._regularExpression;
        this.source = source ? source : this.source;
    }

    public get regularExpression():string {
        return this._regularExpression;
    }

    public set regularExpression(value: string) {
        if (isNil(value)) {
            this._regularExpression = '';
            return;
        }

        if (value.charAt(0) === '/' && value.charAt(value.length - 1) === '/') {
            const lastSlashPos = value.lastIndexOf('/');
            this._regularExpression = value.substr(1).substring(0, lastSlashPos - 1);
            return;
        }

        this._regularExpression = value;
    }

    public undateSourceFromConfig() {
        this.source = Ch5Debug.getConfigKeyValue(Ch5Debug.DEBUG_MESSAGE_FILTER_SOURCE_KEY) as string;
    }

    public clearFilter() {
        this.level = LogMessagesFilter.getDefaultLevel();
        this.regularExpression = '';
        this.source = '';
    }

    public applyFilter(data: TDataLog): boolean {
        const logLevelMatched: boolean = this.isMatchingFilterLevel(data.level);
        const logRegexMatched: boolean = this.isMatchingFilterRegex(data.message);
        const logSourceMatched: boolean = this.isMatchingFilterSource(data.source);

        const isFilterMatched = logLevelMatched && logRegexMatched && logSourceMatched;

        return isFilterMatched;
    }

    public isMatchingFilterLevel(dataLevel: LogLevelEnum): boolean {
        // dataLevel should be equal or bigger than the filter level
        // ex: dataLevel = info => logs with level: warn, error should be also shown
        const isMinimumLogLevel = dataLevel >= this.level;

        return isMinimumLogLevel;
    }

    public isMatchingFilterRegex(message: string): boolean {
        if (!this.regularExpression) {
            return true; // no regex => nothing to filter here
        }
        // Passing the "i" flag to the RegExp constructor will disable case sensitiveness
        const regExp = new RegExp(this.regularExpression, "i");
        return !!regExp.test(message); // cast to boolean
    }

    public isMatchingFilterSource(dataSource: string): boolean {
        if (!this.source) {
            // no source => no filter by source
            return true;
        }

        // match source (partial match inclueded)
        return !isNil(dataSource) && dataSource.indexOf(this.source) > -1;
    }
}
