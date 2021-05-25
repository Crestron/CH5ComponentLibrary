// Copyright (C) 2021 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

export class Ch5CommonLog {

  constructor(public isDebugEnabled: boolean) { }

  public start(message: string, componentName: string = "") {
    if (true === this.isDebugEnabled) {
      console.group((componentName !== "" ? componentName + " " : "") + message);
    }
  }

  public stop() {
    if (true === this.isDebugEnabled) {
      console.groupEnd();
    }
  }

}
