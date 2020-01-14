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

export class AppenderFactory {

    public getAppender(appender: AppendersEnum, sendLogTimeOffset: number = 0, config: any) {
        
        if (appender === AppendersEnum.remote) {
            return RemoteAppender.getInstance(sendLogTimeOffset, config);
        }

        throw new Error('Appender type is invalid');
    }
}
