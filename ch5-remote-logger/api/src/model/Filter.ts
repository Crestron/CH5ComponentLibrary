/*
 * Copyright (C) 2018 to the present, Crestron Electronics, Inc.
 * All rights reserved.
 * No part of this software may be reproduced in any form, machine
 * or natural, without the express written consent of Crestron Electronics.
 * Use of this source code is subject to the terms of the Crestron Software License Agreement
 * under which you licensed this source code.
 */

import { ElogLevel } from '../enums';
import { isNil } from 'lodash';

export class Filter {
  public readonly level: ElogLevel = ElogLevel.WARN;
  public readonly source: string = '';
  public readonly regularExpression: string = '';

  public constructor(level?: ElogLevel, source?: string, regularExpression?: string) {

    if (level) {
      this.level = level;
    }

    if (source) {
      this.source = source;
    }

    if (regularExpression) {
      this.regularExpression = regularExpression;
    }
  }
}
