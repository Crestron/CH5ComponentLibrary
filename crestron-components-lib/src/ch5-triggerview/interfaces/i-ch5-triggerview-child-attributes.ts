// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5CommonAttributes } from "../../ch5-common/interfaces";


/**
 * @ignore
 */
export interface ICh5TriggerViewChildAttributes extends ICh5CommonAttributes {
  
  /**
   * @documentation
   * [
   * "`sendeventonshow` attribute",
   * "***",
   * "Sends a digital pulse when a child view becomes visible. Allows the control system ",
   * "to take various actions based on which view is active."
   * ]
   * @name sendeventonshow
   */
  sendEventOnShow: string;

  /**
   * @documentation
   * [
   * "`receivestateshow` attribute",
   * "***",
   * "When true, this will tell the parent component (ch5-triggerview) to hide all the other ChildViews and to only show this one."
   * ]
   * @name receivestateshow
   */
  receiveStateShow: string;

}
