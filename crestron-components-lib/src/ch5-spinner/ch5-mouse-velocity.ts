// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

export interface IMousePosition {

  start: {x: number, y: number, time: Date};
  end: {x: number, y: number, time: Date};
}

export class Ch5MouseVelocity implements IMousePosition {

  /**
   * x & y coordinates when user start click/touch
   */
  public start: {x: number, y: number, time: Date} = {
    x: 0,
    y: 0,
    time: new Date()
  }

  /**
   * x & y coordinates when user ends up the click/touch event
   * @private
   * @memberof Ch5MousePosition
   */
  public end: {x: number, y: number, time: Date} = {
    x: 0,
    y: 0,
    time: new Date()
  };

  public step: number;

  constructor(step: number) {
    this.step = step;
  }

  public static calculateVelocity(start: number, end: number, step: number, timeDiff: number): number {
    return (Math.abs(start - end) / timeDiff) / step;
  }

  public get x1(): number {
    return this.start.x;
  }

  public get y1(): number {
    return this.start.y;
  }

  public get x2(): number {
    return this.end.x;
  }

  public get y2(): number {
    return this.end.y;
  }

  public get timeStart(): number {
    return this.start.time.getTime();
  }

  public get timeEnd(): number {
    return this.end.time.getTime();
  }

  public get timeDiff(): number {
    return this.timeEnd - this.timeStart;
  }

  public getYSteps(): number {
    return Math.floor(Ch5MouseVelocity.calculateVelocity(this.y1, this.y2,this.step,this.timeDiff));
  }
}
