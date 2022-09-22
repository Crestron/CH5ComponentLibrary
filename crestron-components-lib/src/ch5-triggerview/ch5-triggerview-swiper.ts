// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

export class Ch5TriggerViewSwiper {

  public slides: HTMLElement[] = [];

  private _activeView: number = 0;

  public get activeView(): number {
    return this._activeView
  }
  public set activeView(input: number) {
    this._activeView = input;
  }

  constructor(id: string) {
    //
  }
  public incrementActiveView(endless: boolean) {
    if (endless === true) {
      if (this._activeView !== this.slides.length - 1) {
        this._activeView += 1;
      } else {
        this._activeView = 0;
      }
    } else {
      if (this._activeView !== this.slides.length - 1) {
        this._activeView += 1;
      }
    }
  }

  public decrementActiveView(endless: boolean) {
    if (endless === true) {
      if (this._activeView !== 0) {
        this._activeView -= 1;
      } else {
        this._activeView = this.slides.length - 1;
      }
    } else {
      if (this._activeView !== 0) {
        this._activeView -= 1;
      }
    }
  }

}
