// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { Logger } from '../logger/index';
import { AbstractAppender } from '../appender/AbstractAppender';
import { LogMessagesFilter } from '../helpers/LogMessagesFilter';

export function getLogger(appender: AbstractAppender, overrideGlobalConsole?: boolean, logFilter?: LogMessagesFilter, ) {

  const logger = new Logger(appender, logFilter);
  appender.configObserver(logger, !!logFilter);

  
  if (overrideGlobalConsole) {
      console.log = logger.log;
      console.error = logger.error;
      console.info = logger.info;
      console.warn = logger.warn;
  }

  return logger;
}
