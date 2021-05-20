// Copyright (C) 2018 to the present, Crestron Electronics, Inc.
// All rights reserved.
// No part of this software may be reproduced in any form, machine
// or natural, without the express written consent of Crestron Electronics.
// Use of this source code is subject to the terms of the Crestron Software License Agreement
// under which you licensed this source code.

import { ICh5ButtonAttributes } from "./i-ch5-button-attributes";
import { ICh5Common } from "../ch5-common";

/**
 * @ignore
 */
export interface ICh5Button extends ICh5ButtonAttributes, ICh5Common {

  /**
   * @documentation
   * [
   * "`onpress` attribute",
   * "***",
   * "Runs when a press event is initiated."
   * ]
   * @name onpress
   */
  onpress: string;

  /**
   * @documentation
   * [
   * "`onrelease` attribute",
   * "***",
   * "Runs when a release event is initiated."
   * ]
   * @name onrelease
   */
  onrelease: string;

  /**
   * @documentation
   * [
   * "`customclassselected` attribute",
   * "***",
   * "Specifies a custom class for the selected state of the button."
   * ]
   * @name customclassselected
   */
  customClassSelected: string | null;
}