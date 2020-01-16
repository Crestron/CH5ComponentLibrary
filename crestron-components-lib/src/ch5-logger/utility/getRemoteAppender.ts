// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { AppenderFactory } from '../appender/AppenderFactory';
import { AppendersEnum } from '../enums/index';
import { RemoteAppender } from '../appender/RemoteAppender';
import { TAppenderConfig } from '../types';


export function getRemoteAppender(hostname: string, port: string, secure: boolean): RemoteAppender {

    const appenderFactory = new AppenderFactory();
    const appenderConfig: TAppenderConfig = {hostname, port, secure};
    const remoteAppender = appenderFactory.getAppender(AppendersEnum.remote, 0, appenderConfig) as RemoteAppender;

    return remoteAppender;
}
