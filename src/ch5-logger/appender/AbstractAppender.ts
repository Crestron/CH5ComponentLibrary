/*
 * Copyright (C) 2018 to the present, Crestron Electronics, Inc.
 * All rights reserved.
 * No part of this software may be reproduced in any form, machine
 * or natural, without the express written consent of Crestron Electronics.
 * Use of this source code is subject to the terms of the Crestron Software License Agreement
 * under which you licensed this source code.
 */

import { LogMessage } from '../helpers/index';
import { Observable, timer, BehaviorSubject } from 'rxjs';
import isNil from 'lodash/isNil';

export abstract class AbstractAppender {

  private _sendLogTimeOffset: Observable<number> = {} as Observable<number>;
  public isInitialized: boolean = false;
  public isInitializedSubject: BehaviorSubject<boolean> = new BehaviorSubject(this.isInitialized);

  public constructor(sendLogTimeOffsetInMiliseconds: number) {
    this.sendLogTimeOffset = timer(sendLogTimeOffsetInMiliseconds);
  }

  public set sendLogTimeOffset(sendLogTimeOffset: Observable<number>) {
    if (isNil(sendLogTimeOffset)) {
      return;
    }

    this._sendLogTimeOffset = sendLogTimeOffset;
  }

  public get sendLogTimeOffset(): Observable<number> {
    return this._sendLogTimeOffset;
  }

  public abstract clearInstance(): void;

  public abstract configObserver(config: {}, hasConfig: boolean): void;

  public abstract log(data: LogMessage): void;
}
