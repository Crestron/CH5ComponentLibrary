/*
 * Copyright (C) 2018 to the present, Crestron Electronics, Inc.
 * All rights reserved.
 * No part of this software may be reproduced in any form, machine
 * or natural, without the express written consent of Crestron Electronics.
 * Use of this source code is subject to the terms of the Crestron Software License Agreement
 * under which you licensed this source code.
 */

import { AppendersEnum } from '../enums/index';
import { RemoteAppender } from './RemoteAppender';
import { TAppenderConfig } from '../types';

export class AppenderFactory {

    public getAppender(appender: AppendersEnum, sendLogTimeOffset: number = 0, appenderConfig: TAppenderConfig) {
        
        if (appender === AppendersEnum.remote) {
            return RemoteAppender.getInstance(sendLogTimeOffset, appenderConfig);
        }

        throw new Error('Appender type is invalid');
    }
}
